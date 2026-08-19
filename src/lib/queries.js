// ============================================================================
// openCypher Queries for TalentGraph CognoDB Graph Database
// All queries are parameterized for security and performance.
// ============================================================================

export const GET_DASHBOARD_STATS = `
  MATCH (c:Candidate) WITH count(c) AS candidates
  MATCH (s:Skill) WITH candidates, count(s) AS skills
  MATCH (co:Company) WITH candidates, skills, count(co) AS companies
  MATCH (r:Role) WITH candidates, skills, companies, count(r) AS roles
  MATCH ()-[rel]->() WITH candidates, skills, companies, roles, count(rel) AS relationships
  RETURN candidates, skills, companies, roles, relationships
`;

export const SEARCH_CANDIDATES = `
  MATCH (c:Candidate)
  WHERE ($name IS NULL OR toLower(c.name) CONTAINS toLower($name) OR toLower(c.title) CONTAINS toLower($name))
  WITH c
  OPTIONAL MATCH (c)-[r:HAS_SKILL]->(s:Skill)
  WHERE ($skill IS NULL OR toLower(s.name) = toLower($skill) OR toLower(s.id) = toLower($skill))
  WITH c, count(s) AS matchedSkillCount, collect({id: s.id, name: s.name, proficiency: coalesce(r.proficiency, 3)}) AS skills
  WHERE ($skill IS NULL OR matchedSkillCount > 0)
  RETURN c.id AS id, c.name AS name, c.title AS title, c.location AS location, 
         c.experience AS experience, c.email AS email, c.about AS about, skills
  ORDER BY c.name ASC
  LIMIT 50
`;

export const GET_CANDIDATE_BY_ID = `
  MATCH (c:Candidate {id: $id})
  OPTIONAL MATCH (c)-[hs:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (c)-[w:WORKED_AT]->(co:Company)
  OPTIONAL MATCH (c)-[hr:HELD_ROLE]->(r:Role)
  OPTIONAL MATCH (c)-[wo:WORKED_ON]->(p:Project)
  OPTIONAL MATCH (c)-[:KNOWS]-(peer:Candidate)
  RETURN c {
    .*,
    skills: collect(DISTINCT {id: s.id, name: s.name, proficiency: hs.proficiency, category: s.category}),
    companies: collect(DISTINCT {id: co.id, name: co.name, role: coalesce(w.role, c.title), startYear: w.startYear, endYear: w.endYear}),
    roles: collect(DISTINCT {id: r.id, name: r.name, title: hr.title}),
    projects: collect(DISTINCT {id: p.id, name: p.name, role: wo.role, link: p.link, desc: p.desc}),
    directConnectionsCount: count(DISTINCT peer)
  } AS candidate
`;

/**
 * Multi-hop Graph Traversal (1 to 3 degrees of separation)
 * Finds all candidates reachable via KNOWS relationships, sorted by network proximity.
 */
export const GET_CANDIDATE_NETWORK = `
  MATCH (start:Candidate {id: $id})
  MATCH path = (start)-[:KNOWS*1..3]-(c:Candidate)
  WHERE c <> start
  WITH c, min(length(path)) AS distance
  ORDER BY distance ASC, c.name ASC
  OPTIONAL MATCH (c)-[r:HAS_SKILL]->(s:Skill)
  RETURN c.id AS id, c.name AS name, c.title AS title, c.location AS location,
         distance, collect(DISTINCT {name: s.name, proficiency: r.proficiency}) AS skills
  LIMIT 30
`;

/**
 * openCypher Shortest Path Algorithm
 * Traces the optimal career ladder between any two roles across the organization.
 */
export const FIND_CAREER_PATH = `
  MATCH (start:Role {id: $fromRoleId}), (end:Role {id: $toRoleId})
  MATCH path = shortestPath((start)-[:LEADS_TO*]->(end))
  UNWIND nodes(path) AS roleNode
  OPTIONAL MATCH (roleNode)-[:REQUIRES]->(reqSkill:Skill)
  WITH path, roleNode, collect(DISTINCT reqSkill.name) AS requiredSkills
  RETURN [n IN nodes(path) | n { .*, requiredSkills: [(n)-[:REQUIRES]->(s:Skill) | s.name] }] AS pathNodes,
         length(path) AS length
`;

/**
 * Skill Gap & Role Readiness Query
 * Compares target role prerequisites against candidate's current capabilities.
 */
export const SKILL_GAP_ANALYSIS = `
  MATCH (r:Role {id: $roleId})-[:REQUIRES]->(req:Skill)
  OPTIONAL MATCH (c:Candidate {id: $candidateId})-[hs:HAS_SKILL]->(req)
  RETURN req.id AS skillId, req.name AS skillName, req.category AS category,
         CASE WHEN hs IS NOT NULL THEN true ELSE false END AS hasSkill,
         coalesce(hs.proficiency, 0) AS currentProficiency,
         coalesce(req.importance, 'High') AS importance
  ORDER BY req.category, req.name
`;

/**
 * 2nd & 3rd Degree Hidden Talent Discovery
 * Finds candidates in candidate's extended network who possess a target skill.
 */
export const FIND_HIDDEN_TALENT = `
  MATCH (seed:Candidate {id: $seedId})-[:KNOWS*2..3]-(c:Candidate)-[:HAS_SKILL]->(s:Skill {id: $skillId})
  WHERE NOT (seed)-[:KNOWS]-(c) AND seed <> c
  MATCH path = shortestPath((seed)-[:KNOWS*]-(c))
  RETURN DISTINCT c.id AS id, c.name AS name, c.title AS title, c.location AS location,
         length(path) AS distance,
         [n IN nodes(path) | n.name] AS referralPath
  ORDER BY distance ASC
  LIMIT 15
`;

/**
 * Role-to-Candidate Recommendation Engine
 * Aggregates candidate skills matching the role's required skill set.
 */
export const RECOMMEND_CANDIDATES_FOR_ROLE = `
  MATCH (r:Role {id: $roleId})-[:REQUIRES]->(req:Skill)
  WITH r, collect(req) AS requiredSkills, count(req) AS totalRequired
  MATCH (c:Candidate)
  OPTIONAL MATCH (c)-[hs:HAS_SKILL]->(s:Skill)
  WHERE s IN requiredSkills
  WITH c, totalRequired, count(s) AS matchedSkillsCount, avg(coalesce(hs.proficiency, 3)) AS avgProficiency,
       collect(s.name) AS matchedSkillNames
  WHERE matchedSkillsCount > 0
  RETURN c.id AS id, c.name AS name, c.title AS title, c.location AS location,
         round((toFloat(matchedSkillsCount) / totalRequired) * 100) AS matchPercentage,
         round(avgProficiency * 10) / 10 AS avgProficiency,
         matchedSkillNames
  ORDER BY matchPercentage DESC, avgProficiency DESC
  LIMIT 20
`;

export const GET_ALL_SKILLS = `
  MATCH (s:Skill)
  OPTIONAL MATCH (s)<-[hs:HAS_SKILL]-(c:Candidate)
  RETURN s.id AS id, s.name AS name, s.category AS category, count(c) AS candidateCount
  ORDER BY s.category, s.name
`;

export const GET_ALL_ROLES = `
  MATCH (r:Role)
  OPTIONAL MATCH (r)-[:LEADS_TO]->(next:Role)
  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)
  RETURN r.id AS id, r.name AS name, r.department AS department,
         collect(DISTINCT next.id) AS leadsTo,
         collect(DISTINCT s.name) AS requiredSkills
  ORDER BY r.department, r.name
`;

export const GET_ALL_COMPANIES = `
  MATCH (co:Company)
  OPTIONAL MATCH (co)<-[:WORKED_AT]-(c:Candidate)
  RETURN co.id AS id, co.name AS name, count(c) AS employeeCount
  ORDER BY co.name
`;

export const SEARCH_GLOBAL = `
  MATCH (n)
  WHERE (n:Candidate OR n:Skill OR n:Company OR n:Role) AND toLower(n.name) CONTAINS toLower($q)
  RETURN labels(n)[0] AS type, n.id AS id, n.name AS name
  LIMIT 20
`;

export const GET_GRAPH_DATA = `
  MATCH (n)
  WHERE n:Candidate OR n:Skill OR n:Company OR n:Role
  WITH n LIMIT 250
  OPTIONAL MATCH (n)-[r]->(m)
  WHERE m:Candidate OR m:Skill OR m:Company OR m:Role
  RETURN collect(DISTINCT n { .*, labels: labels(n) }) AS nodes,
         collect(DISTINCT { source: n.id, target: m.id, type: type(r) }) AS links
`;
