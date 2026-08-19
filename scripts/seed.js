const neo4j = require('neo4j-driver');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local or .env
function loadEnv() {
  const envPaths = ['.env.local', '.env'];
  for (const envPath of envPaths) {
    const fullPath = path.resolve(process.cwd(), envPath);
    if (fs.existsSync(fullPath)) {
      console.log(`Loading environment from ${envPath}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
      break;
    }
  }
}

loadEnv();

const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
const user = process.env.COGNODB_USER || process.env.NEO4J_USERNAME || process.env.NEO4J_USER || 'cognodb';
const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;

if (!uri || !password) {
  console.error("❌ Missing database credentials.");
  console.error("Please set COGNODB_URI and COGNODB_PASSWORD in your .env.local file.");
  process.exit(1);
}

console.log(`🔌 Connecting to CognoDB at ${uri} as user '${user}'...`);
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// ==========================================
// Seed Data Definitions
// ==========================================

const skills = [
  // Frontend
  { id: 'sk_react', name: 'React', category: 'Frontend' },
  { id: 'sk_ts', name: 'TypeScript', category: 'Frontend' },
  { id: 'sk_js', name: 'JavaScript', category: 'Frontend' },
  { id: 'sk_next', name: 'Next.js', category: 'Frontend' },
  { id: 'sk_vue', name: 'Vue.js', category: 'Frontend' },
  { id: 'sk_tailwind', name: 'Tailwind CSS', category: 'Frontend' },
  // Backend
  { id: 'sk_py', name: 'Python', category: 'Backend' },
  { id: 'sk_node', name: 'Node.js', category: 'Backend' },
  { id: 'sk_go', name: 'Go', category: 'Backend' },
  { id: 'sk_java', name: 'Java', category: 'Backend' },
  { id: 'sk_fastapi', name: 'FastAPI', category: 'Backend' },
  { id: 'sk_spring', name: 'Spring Boot', category: 'Backend' },
  // Database & Graph
  { id: 'sk_neo4j', name: 'Neo4j / CognoDB', category: 'Database' },
  { id: 'sk_pg', name: 'PostgreSQL', category: 'Database' },
  { id: 'sk_redis', name: 'Redis', category: 'Database' },
  { id: 'sk_mongo', name: 'MongoDB', category: 'Database' },
  // DevOps & Cloud
  { id: 'sk_aws', name: 'AWS Cloud', category: 'DevOps' },
  { id: 'sk_docker', name: 'Docker', category: 'DevOps' },
  { id: 'sk_k8s', name: 'Kubernetes', category: 'DevOps' },
  { id: 'sk_tf', name: 'Terraform', category: 'DevOps' },
  { id: 'sk_cicd', name: 'CI/CD Pipelines', category: 'DevOps' },
  // AI & Data
  { id: 'sk_ml', name: 'Machine Learning', category: 'AI & Data' },
  { id: 'sk_pytorch', name: 'PyTorch', category: 'AI & Data' },
  { id: 'sk_llm', name: 'LLM Engineering', category: 'AI & Data' },
  // Design & Leadership
  { id: 'sk_figma', name: 'Figma', category: 'Design' },
  { id: 'sk_ux', name: 'User Research', category: 'Design' },
  { id: 'sk_arch', name: 'System Architecture', category: 'Leadership' },
  { id: 'sk_mgmt', name: 'Engineering Management', category: 'Leadership' }
];

const companies = [
  { id: 'co_google', name: 'Google' },
  { id: 'co_stripe', name: 'Stripe' },
  { id: 'co_meta', name: 'Meta' },
  { id: 'co_amazon', name: 'Amazon' },
  { id: 'co_vercel', name: 'Vercel' },
  { id: 'co_netflix', name: 'Netflix' },
  { id: 'co_airbnb', name: 'Airbnb' },
  { id: 'co_openai', name: 'OpenAI' },
  { id: 'co_apple', name: 'Apple' },
  { id: 'co_spotify', name: 'Spotify' },
  { id: 'co_github', name: 'GitHub' },
  { id: 'co_uber', name: 'Uber' }
];

const roles = [
  { id: 'r_jdev', name: 'Junior Software Engineer', department: 'Engineering' },
  { id: 'r_mdev', name: 'Software Engineer', department: 'Engineering' },
  { id: 'r_sdev', name: 'Senior Software Engineer', department: 'Engineering' },
  { id: 'r_steng', name: 'Staff Software Engineer', department: 'Engineering' },
  { id: 'r_peng', name: 'Principal Engineer', department: 'Engineering' },
  { id: 'r_em', name: 'Engineering Manager', department: 'Leadership' },
  { id: 'r_vp', name: 'VP of Engineering', department: 'Leadership' },
  { id: 'r_cto', name: 'Chief Technology Officer', department: 'Executive' },
  { id: 'r_da', name: 'Data Analyst', department: 'AI & Data' },
  { id: 'r_ds', name: 'Data Scientist', department: 'AI & Data' },
  { id: 'r_sds', name: 'Senior Data Scientist', department: 'AI & Data' },
  { id: 'r_mle', name: 'ML Engineer', department: 'AI & Data' },
  { id: 'r_hai', name: 'Head of AI', department: 'AI & Data' },
  { id: 'r_devo', name: 'DevOps Engineer', department: 'Platform' },
  { id: 'r_sdevo', name: 'Senior DevOps / SRE', department: 'Platform' },
  { id: 'r_plat', name: 'Platform Architect', department: 'Platform' },
  { id: 'r_ux', name: 'Product Designer', department: 'Design' },
  { id: 'r_sux', name: 'Senior Product Designer', department: 'Design' },
  { id: 'r_dlead', name: 'Design Lead', department: 'Design' }
];

const roleRequirements = [
  { roleId: 'r_jdev', skills: ['sk_js', 'sk_react'] },
  { roleId: 'r_mdev', skills: ['sk_ts', 'sk_react', 'sk_node', 'sk_pg'] },
  { roleId: 'r_sdev', skills: ['sk_ts', 'sk_arch', 'sk_node', 'sk_aws', 'sk_docker'] },
  { roleId: 'r_steng', skills: ['sk_arch', 'sk_go', 'sk_k8s', 'sk_neo4j'] },
  { roleId: 'r_peng', skills: ['sk_arch', 'sk_mgmt', 'sk_k8s'] },
  { roleId: 'r_em', skills: ['sk_mgmt', 'sk_arch', 'sk_cicd'] },
  { roleId: 'r_vp', skills: ['sk_mgmt', 'sk_arch'] },
  { roleId: 'r_cto', skills: ['sk_mgmt', 'sk_arch'] },
  { roleId: 'r_da', skills: ['sk_py', 'sk_pg'] },
  { roleId: 'r_ds', skills: ['sk_py', 'sk_ml', 'sk_pg'] },
  { roleId: 'r_sds', skills: ['sk_py', 'sk_ml', 'sk_pytorch', 'sk_neo4j'] },
  { roleId: 'r_mle', skills: ['sk_py', 'sk_pytorch', 'sk_docker', 'sk_ml'] },
  { roleId: 'r_hai', skills: ['sk_llm', 'sk_ml', 'sk_mgmt', 'sk_neo4j'] },
  { roleId: 'r_devo', skills: ['sk_docker', 'sk_k8s', 'sk_aws', 'sk_cicd'] },
  { roleId: 'r_sdevo', skills: ['sk_k8s', 'sk_tf', 'sk_aws', 'sk_arch'] },
  { roleId: 'r_plat', skills: ['sk_k8s', 'sk_arch', 'sk_tf', 'sk_go'] },
  { roleId: 'r_ux', skills: ['sk_figma', 'sk_ux'] },
  { roleId: 'r_sux', skills: ['sk_figma', 'sk_ux', 'sk_tailwind'] },
  { roleId: 'r_dlead', skills: ['sk_figma', 'sk_ux', 'sk_mgmt'] }
];

const roleProgressions = [
  ['r_jdev', 'r_mdev'],
  ['r_mdev', 'r_sdev'],
  ['r_sdev', 'r_steng'],
  ['r_steng', 'r_peng'],
  ['r_sdev', 'r_em'],
  ['r_em', 'r_vp'],
  ['r_vp', 'r_cto'],
  ['r_da', 'r_ds'],
  ['r_ds', 'r_sds'],
  ['r_sds', 'r_mle'],
  ['r_mle', 'r_hai'],
  ['r_devo', 'r_sdevo'],
  ['r_sdevo', 'r_plat'],
  ['r_ux', 'r_sux'],
  ['r_sux', 'r_dlead']
];

const projects = [
  { id: 'p_1', name: 'Real-Time Graph Intelligence', desc: 'High-throughput openCypher graph discovery engine.' },
  { id: 'p_2', name: 'Global Payment Orchestration', desc: 'Multi-region fault-tolerant payment settlement pipeline.' },
  { id: 'p_3', name: 'Autonomous GraphRAG Agents', desc: 'Enterprise agentic workflows connecting LLMs to knowledge graphs.' },
  { id: 'p_4', name: 'Edge CDN Streaming Layer', desc: 'Low-latency serverless rendering with dynamic caching.' },
  { id: 'p_5', name: 'Cloud Native Microservices Mesh', desc: 'Kubernetes zero-trust service mesh with automated canary deployments.' },
  { id: 'p_6', name: 'Collaborative Design System', desc: 'Dynamic tokenized component library adopted across 14 product squads.' }
];

const candidateSeeds = [
  {
    id: 'c_1',
    name: 'Alexandra Vance',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    experience: 7,
    email: 'alexandra.vance@example.com',
    about: 'Full-stack distributed systems architect specializing in high-throughput React & Next.js web applications backed by Neo4j graph databases.',
    skillIds: ['sk_react', 'sk_ts', 'sk_next', 'sk_node', 'sk_neo4j', 'sk_aws'],
    companyIds: ['co_stripe', 'co_vercel'],
    roleId: 'r_sdev',
    projectIds: ['p_1', 'p_2']
  },
  {
    id: 'c_2',
    name: 'Marcus Chen',
    title: 'Staff Software Engineer',
    location: 'Seattle, WA',
    experience: 10,
    email: 'marcus.chen@example.com',
    about: 'Platform engineer specializing in Kubernetes orchestration, distributed cache invalidation, and graph query optimization.',
    skillIds: ['sk_go', 'sk_k8s', 'sk_docker', 'sk_arch', 'sk_neo4j', 'sk_aws'],
    companyIds: ['co_amazon', 'co_google'],
    roleId: 'r_steng',
    projectIds: ['p_5']
  },
  {
    id: 'c_3',
    name: 'Elena Rostova',
    title: 'Head of AI',
    location: 'New York, NY',
    experience: 9,
    email: 'elena.rostova@example.com',
    about: 'GenAI and Knowledge Graph pioneer building hybrid RAG systems that combine vector embeddings with openCypher knowledge graphs.',
    skillIds: ['sk_py', 'sk_pytorch', 'sk_llm', 'sk_neo4j', 'sk_mgmt', 'sk_ml'],
    companyIds: ['co_openai', 'co_meta'],
    roleId: 'r_hai',
    projectIds: ['p_3']
  },
  {
    id: 'c_4',
    name: 'Devin Sharma',
    title: 'Engineering Manager',
    location: 'Austin, TX',
    experience: 11,
    email: 'devin.sharma@example.com',
    about: 'Engineering leader passionate about mentoring high-velocity product teams, scaling graph data architectures, and driving engineering excellence.',
    skillIds: ['sk_mgmt', 'sk_arch', 'sk_ts', 'sk_aws', 'sk_cicd'],
    companyIds: ['co_airbnb', 'co_google'],
    roleId: 'r_em',
    projectIds: ['p_2']
  },
  {
    id: 'c_5',
    name: 'Sophia Patel',
    title: 'Senior Data Scientist',
    location: 'London, UK',
    experience: 6,
    email: 'sophia.patel@example.com',
    about: 'Graph ML practitioner focusing on network analysis, fraud detection, and predictive recommendation algorithms.',
    skillIds: ['sk_py', 'sk_ml', 'sk_neo4j', 'sk_pg', 'sk_pytorch'],
    companyIds: ['co_netflix', 'co_spotify'],
    roleId: 'r_sds',
    projectIds: ['p_1', 'p_3']
  },
  {
    id: 'c_6',
    name: 'Lucas Dupont',
    title: 'Senior DevOps / SRE',
    location: 'Berlin, Germany',
    experience: 8,
    email: 'lucas.dupont@example.com',
    about: 'Zero-downtime infrastructure engineer specialized in multi-region Kubernetes clusters, GitOps pipelines, and Terraform automations.',
    skillIds: ['sk_k8s', 'sk_tf', 'sk_aws', 'sk_docker', 'sk_cicd', 'sk_arch'],
    companyIds: ['co_stripe', 'co_meta'],
    roleId: 'r_sdevo',
    projectIds: ['p_5']
  },
  {
    id: 'c_7',
    name: 'Maya Lin',
    title: 'Product Designer',
    location: 'Toronto, Canada',
    experience: 5,
    email: 'maya.lin@example.com',
    about: 'Design systems creator crafting immersive, highly accessible user experiences for complex data visualization and graph exploration tools.',
    skillIds: ['sk_figma', 'sk_ux', 'sk_tailwind', 'sk_react'],
    companyIds: ['co_airbnb', 'co_apple'],
    roleId: 'r_ux',
    projectIds: ['p_6']
  },
  {
    id: 'c_8',
    name: 'Hiroshi Tanaka',
    title: 'Software Engineer',
    location: 'Tokyo, Japan',
    experience: 4,
    email: 'hiroshi.tanaka@example.com',
    about: 'Frontend specialist building real-time collaboration tools with TypeScript, WebSockets, and state-of-the-art UI architectures.',
    skillIds: ['sk_ts', 'sk_react', 'sk_node', 'sk_tailwind', 'sk_next'],
    companyIds: ['co_vercel'],
    roleId: 'r_mdev',
    projectIds: ['p_4', 'p_6']
  },
  {
    id: 'c_9',
    name: 'Priya Narayanan',
    title: 'ML Engineer',
    location: 'Bangalore, India',
    experience: 5,
    email: 'priya.narayanan@example.com',
    about: 'Applied AI researcher building LLM fine-tuning pipelines and knowledge graph embeddings for semantic search.',
    skillIds: ['sk_py', 'sk_pytorch', 'sk_ml', 'sk_docker', 'sk_fastapi'],
    companyIds: ['co_google', 'co_uber'],
    roleId: 'r_mle',
    projectIds: ['p_3']
  },
  {
    id: 'c_10',
    name: 'Gabriel Morales',
    title: 'Principal Engineer',
    location: 'San Francisco, CA',
    experience: 14,
    email: 'gabriel.morales@example.com',
    about: 'Distinguished architect with deep expertise in global databases, graph consensus protocols, and mission-critical cloud backbones.',
    skillIds: ['sk_arch', 'sk_go', 'sk_k8s', 'sk_neo4j', 'sk_mgmt', 'sk_aws'],
    companyIds: ['co_meta', 'co_google', 'co_uber'],
    roleId: 'r_peng',
    projectIds: ['p_1', 'p_5']
  }
];

// Generate additional realistic candidates up to 50
const firstNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'William', 'Sophia', 'James', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Jackson', 'Elizabeth', 'Sebastian', 'Mila', 'David', 'Ella', 'Joseph', 'Avery', 'Samuel', 'Sofia', 'John', 'Camila', 'Owen', 'Aria', 'Jack', 'Scarlett'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];
const cities = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Bangalore, India', 'Tokyo, Japan', 'Remote', 'Singapore', 'Amsterdam, Netherlands'];

for (let i = 11; i <= 50; i++) {
  const fName = firstNames[(i - 11) % firstNames.length];
  const lName = lastNames[(i * 3) % lastNames.length];
  const role = roles[i % roles.length];
  const randSkills = [...skills].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
  const randCompanies = [...companies].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
  const randProjects = [projects[i % projects.length]];

  candidateSeeds.push({
    id: `c_${i}`,
    name: `${fName} ${lName}`,
    title: role.name,
    location: cities[i % cities.length],
    experience: Math.floor(Math.random() * 12) + 2,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`,
    about: `Dedicated ${role.name} with hands-on experience building scalable applications and collaborating in distributed agile engineering teams.`,
    skillIds: randSkills.map(s => s.id),
    companyIds: randCompanies.map(c => c.id),
    roleId: role.id,
    projectIds: randProjects.map(p => p.id)
  });
}

// ==========================================
// Main Seeder Function
// ==========================================

async function seed() {
  const session = driver.session();
  try {
    console.log('🧹 Clearing existing database graph...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('🔒 Creating schema uniqueness constraints...');
    const constraintLabels = ['Candidate', 'Skill', 'Company', 'Role', 'Project'];
    for (const label of constraintLabels) {
      try {
        await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`);
      } catch (err) {
        // Some openCypher dialects ignore or support ALTER
      }
    }

    console.log(`✨ Seeding ${skills.length} Skills...`);
    await session.run(`
      UNWIND $skills AS s
      CREATE (n:Skill {id: s.id, name: s.name, category: s.category})
    `, { skills });

    console.log(`✨ Seeding ${companies.length} Companies...`);
    await session.run(`
      UNWIND $companies AS c
      CREATE (n:Company {id: c.id, name: c.name})
    `, { companies });

    console.log(`✨ Seeding ${roles.length} Roles...`);
    await session.run(`
      UNWIND $roles AS r
      CREATE (n:Role {id: r.id, name: r.name, department: r.department})
    `, { roles });

    console.log(`✨ Seeding ${projects.length} Projects...`);
    await session.run(`
      UNWIND $projects AS p
      CREATE (n:Project {id: p.id, name: p.name, desc: p.desc})
    `, { projects });

    console.log(`✨ Seeding ${candidateSeeds.length} Candidates...`);
    await session.run(`
      UNWIND $candidates AS c
      CREATE (n:Candidate {
        id: c.id, 
        name: c.name, 
        title: c.title, 
        location: c.location, 
        experience: c.experience,
        email: c.email,
        about: c.about
      })
    `, { candidates: candidateSeeds });

    console.log('🔗 Establishing Role Career Progressions (LEADS_TO)...');
    for (const [from, to] of roleProgressions) {
      await session.run(`
        MATCH (f:Role {id: $from}), (t:Role {id: $to})
        MERGE (f)-[:LEADS_TO]->(t)
      `, { from, to });
    }

    console.log('🔗 Establishing Role Skill Requirements (REQUIRES)...');
    for (const req of roleRequirements) {
      for (const skillId of req.skills) {
        await session.run(`
          MATCH (r:Role {id: $roleId}), (s:Skill {id: $skillId})
          MERGE (r)-[:REQUIRES]->(s)
        `, { roleId: req.roleId, skillId });
      }
    }

    console.log('🔗 Linking Candidates to Skills, Companies, Roles, and Projects...');
    for (const c of candidateSeeds) {
      // HAS_SKILL
      for (const sId of c.skillIds) {
        const prof = Math.floor(Math.random() * 3) + 3; // 3 to 5
        await session.run(`
          MATCH (cand:Candidate {id: $cid}), (sk:Skill {id: $sid})
          MERGE (cand)-[:HAS_SKILL {proficiency: $prof}]->(sk)
        `, { cid: c.id, sid: sId, prof });
      }

      // WORKED_AT
      for (const compId of c.companyIds) {
        await session.run(`
          MATCH (cand:Candidate {id: $cid}), (co:Company {id: $compId})
          MERGE (cand)-[:WORKED_AT {role: $title, startYear: 2020, endYear: 2024}]->(co)
        `, { cid: c.id, compId, title: c.title });
      }

      // HELD_ROLE
      if (c.roleId) {
        await session.run(`
          MATCH (cand:Candidate {id: $cid}), (r:Role {id: $rid})
          MERGE (cand)-[:HELD_ROLE {title: $title}]->(r)
        `, { cid: c.id, rid: c.roleId, title: c.title });
      }

      // WORKED_ON
      for (const pId of c.projectIds) {
        await session.run(`
          MATCH (cand:Candidate {id: $cid}), (p:Project {id: $pid})
          MERGE (cand)-[:WORKED_ON {role: 'Lead / Contributor'}]->(p)
        `, { cid: c.id, pid: pId });
      }
    }

    console.log('🤝 Building Multi-Hop Professional Network (KNOWS)...');
    // Connect each candidate to 3-6 other candidates to create a rich small-world network
    for (let i = 0; i < candidateSeeds.length; i++) {
      const c1 = candidateSeeds[i];
      const neighborsCount = Math.floor(Math.random() * 4) + 3;
      for (let j = 1; j <= neighborsCount; j++) {
        const targetIdx = (i + j) % candidateSeeds.length;
        const c2 = candidateSeeds[targetIdx];
        await session.run(`
          MATCH (a:Candidate {id: $idA}), (b:Candidate {id: $idB})
          MERGE (a)-[:KNOWS]->(b)
          MERGE (b)-[:KNOWS]->(a)
        `, { idA: c1.id, idB: c2.id });
      }
    }

    console.log('📊 Verifying seeded graph totals...');
    const statsResult = await session.run(`
      MATCH (n) WITH count(n) AS nodeCount
      MATCH ()-[r]->() RETURN nodeCount, count(r) AS relCount
    `);

    const nodes = statsResult.records[0].get('nodeCount').toNumber ? statsResult.records[0].get('nodeCount').toNumber() : statsResult.records[0].get('nodeCount');
    const rels = statsResult.records[0].get('relCount').toNumber ? statsResult.records[0].get('relCount').toNumber() : statsResult.records[0].get('relCount');

    console.log('\n=============================================');
    console.log(`🎉 Seeding complete successfully!`);
    console.log(`Total Graph Nodes:         ${nodes}`);
    console.log(`Total Graph Relationships: ${rels}`);
    console.log('=============================================\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
