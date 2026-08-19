// Comprehensive mock dataset for fallback/offline demo mode
export const mockSkills = [
  { id: 'sk_js', name: 'JavaScript', category: 'Frontend' },
  { id: 'sk_ts', name: 'TypeScript', category: 'Frontend' },
  { id: 'sk_react', name: 'React', category: 'Frontend' },
  { id: 'sk_next', name: 'Next.js', category: 'Frontend' },
  { id: 'sk_vue', name: 'Vue.js', category: 'Frontend' },
  { id: 'sk_tailwind', name: 'Tailwind CSS', category: 'Frontend' },
  { id: 'sk_py', name: 'Python', category: 'Backend' },
  { id: 'sk_node', name: 'Node.js', category: 'Backend' },
  { id: 'sk_go', name: 'Go', category: 'Backend' },
  { id: 'sk_java', name: 'Java', category: 'Backend' },
  { id: 'sk_fastapi', name: 'FastAPI', category: 'Backend' },
  { id: 'sk_spring', name: 'Spring Boot', category: 'Backend' },
  { id: 'sk_pg', name: 'PostgreSQL', category: 'Database' },
  { id: 'sk_neo4j', name: 'Neo4j / CognoDB', category: 'Database' },
  { id: 'sk_redis', name: 'Redis', category: 'Database' },
  { id: 'sk_mongo', name: 'MongoDB', category: 'Database' },
  { id: 'sk_aws', name: 'AWS Cloud', category: 'DevOps' },
  { id: 'sk_docker', name: 'Docker', category: 'DevOps' },
  { id: 'sk_k8s', name: 'Kubernetes', category: 'DevOps' },
  { id: 'sk_tf', name: 'Terraform', category: 'DevOps' },
  { id: 'sk_cicd', name: 'CI/CD Pipelines', category: 'DevOps' },
  { id: 'sk_ml', name: 'Machine Learning', category: 'AI & Data' },
  { id: 'sk_pytorch', name: 'PyTorch', category: 'AI & Data' },
  { id: 'sk_llm', name: 'LLM Engineering', category: 'AI & Data' },
  { id: 'sk_figma', name: 'Figma', category: 'Design' },
  { id: 'sk_ux', name: 'User Research', category: 'Design' },
  { id: 'sk_arch', name: 'System Architecture', category: 'Leadership' },
  { id: 'sk_mgmt', name: 'Engineering Management', category: 'Leadership' }
];

export const mockCompanies = [
  { id: 'co_google', name: 'Google' },
  { id: 'co_meta', name: 'Meta' },
  { id: 'co_amazon', name: 'Amazon' },
  { id: 'co_stripe', name: 'Stripe' },
  { id: 'co_vercel', name: 'Vercel' },
  { id: 'co_netflix', name: 'Netflix' },
  { id: 'co_airbnb', name: 'Airbnb' },
  { id: 'co_openai', name: 'OpenAI' }
];

export const mockRoles = [
  { id: 'r_jdev', name: 'Junior Software Engineer', department: 'Engineering', requiredSkills: ['JavaScript', 'React', 'Git'] },
  { id: 'r_mdev', name: 'Software Engineer', department: 'Engineering', requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'] },
  { id: 'r_sdev', name: 'Senior Software Engineer', department: 'Engineering', requiredSkills: ['TypeScript', 'System Architecture', 'Node.js', 'AWS Cloud', 'Docker'] },
  { id: 'r_steng', name: 'Staff Software Engineer', department: 'Engineering', requiredSkills: ['System Architecture', 'Distributed Systems', 'Go', 'Kubernetes'] },
  { id: 'r_peng', name: 'Principal Engineer', department: 'Engineering', requiredSkills: ['System Architecture', 'Engineering Management', 'Kubernetes'] },
  { id: 'r_em', name: 'Engineering Manager', department: 'Leadership', requiredSkills: ['Engineering Management', 'System Architecture', 'CI/CD Pipelines'] },
  { id: 'r_vp', name: 'VP of Engineering', department: 'Leadership', requiredSkills: ['Engineering Management', 'Strategic Planning'] },
  { id: 'r_cto', name: 'Chief Technology Officer', department: 'Executive', requiredSkills: ['Engineering Management', 'System Architecture', 'Executive Leadership'] },
  { id: 'r_mle', name: 'ML Engineer', department: 'AI & Data', requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'Docker'] },
  { id: 'r_sds', name: 'Senior Data Scientist', department: 'AI & Data', requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'PostgreSQL'] },
  { id: 'r_hai', name: 'Head of AI', department: 'AI & Data', requiredSkills: ['LLM Engineering', 'Machine Learning', 'Engineering Management'] },
  { id: 'r_devo', name: 'DevOps Engineer', department: 'Platform', requiredSkills: ['Docker', 'Kubernetes', 'AWS Cloud', 'CI/CD Pipelines'] },
  { id: 'r_sdevo', name: 'Senior DevOps / SRE', department: 'Platform', requiredSkills: ['Kubernetes', 'Terraform', 'AWS Cloud', 'System Architecture'] },
  { id: 'r_ux', name: 'Product Designer', department: 'Design', requiredSkills: ['Figma', 'User Research', 'Design Systems'] }
];

export const mockRoleProgressions = [
  ['r_jdev', 'r_mdev'],
  ['r_mdev', 'r_sdev'],
  ['r_sdev', 'r_steng'],
  ['r_steng', 'r_peng'],
  ['r_sdev', 'r_em'],
  ['r_em', 'r_vp'],
  ['r_vp', 'r_cto'],
  ['r_mle', 'r_sds'],
  ['r_sds', 'r_hai'],
  ['r_devo', 'r_sdevo']
];

export const mockCandidates = [
  {
    id: 'c_1',
    name: 'Alexandra Vance',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    experience: 7,
    email: 'alexandra.vance@example.com',
    about: 'Full-stack distributed systems architect specializing in high-throughput React & Next.js web applications backed by Neo4j graph databases.',
    skills: [
      { id: 'sk_react', name: 'React', proficiency: 5, category: 'Frontend' },
      { id: 'sk_ts', name: 'TypeScript', proficiency: 5, category: 'Frontend' },
      { id: 'sk_next', name: 'Next.js', proficiency: 4, category: 'Frontend' },
      { id: 'sk_node', name: 'Node.js', proficiency: 4, category: 'Backend' },
      { id: 'sk_neo4j', name: 'Neo4j / CognoDB', proficiency: 5, category: 'Database' },
      { id: 'sk_aws', name: 'AWS Cloud', proficiency: 4, category: 'DevOps' }
    ],
    companies: [
      { id: 'co_stripe', name: 'Stripe', role: 'Senior Software Engineer', startYear: 2021, endYear: 2024 },
      { id: 'co_vercel', name: 'Vercel', role: 'Frontend Engineer', startYear: 2018, endYear: 2021 }
    ],
    roles: [{ id: 'r_sdev', name: 'Senior Software Engineer', title: 'Senior Software Engineer' }],
    projects: [
      { id: 'p_1', name: 'Next-Gen Billing Graph', role: 'Lead Architect' },
      { id: 'p_2', name: 'Edge Rendering Engine', role: 'Core Contributor' }
    ],
    connections: ['c_2', 'c_3', 'c_4', 'c_7']
  },
  {
    id: 'c_2',
    name: 'Marcus Chen',
    title: 'Staff Software Engineer',
    location: 'Seattle, WA',
    experience: 10,
    email: 'marcus.chen@example.com',
    about: 'Platform engineer specializing in Kubernetes orchestration, distributed cache invalidation, and graph query optimization.',
    skills: [
      { id: 'sk_go', name: 'Go', proficiency: 5, category: 'Backend' },
      { id: 'sk_k8s', name: 'Kubernetes', proficiency: 5, category: 'DevOps' },
      { id: 'sk_docker', name: 'Docker', proficiency: 5, category: 'DevOps' },
      { id: 'sk_arch', name: 'System Architecture', proficiency: 5, category: 'Leadership' },
      { id: 'sk_neo4j', name: 'Neo4j / CognoDB', proficiency: 4, category: 'Database' }
    ],
    companies: [
      { id: 'co_amazon', name: 'Amazon', role: 'Staff Software Engineer', startYear: 2020, endYear: 2024 },
      { id: 'co_google', name: 'Google', role: 'Senior Systems Engineer', startYear: 2016, endYear: 2020 }
    ],
    roles: [{ id: 'r_steng', name: 'Staff Software Engineer', title: 'Staff Software Engineer' }],
    projects: [
      { id: 'p_3', name: 'Global Container Mesh', role: 'Tech Lead' }
    ],
    connections: ['c_1', 'c_5', 'c_6', 'c_8']
  },
  {
    id: 'c_3',
    name: 'Elena Rostova',
    title: 'Head of AI',
    location: 'New York, NY',
    experience: 9,
    email: 'elena.rostova@example.com',
    about: 'GenAI and Knowledge Graph pioneer building hybrid RAG systems that combine vector embeddings with openCypher knowledge graphs.',
    skills: [
      { id: 'sk_py', name: 'Python', proficiency: 5, category: 'Backend' },
      { id: 'sk_pytorch', name: 'PyTorch', proficiency: 5, category: 'AI & Data' },
      { id: 'sk_llm', name: 'LLM Engineering', proficiency: 5, category: 'AI & Data' },
      { id: 'sk_neo4j', name: 'Neo4j / CognoDB', proficiency: 4, category: 'Database' },
      { id: 'sk_mgmt', name: 'Engineering Management', proficiency: 4, category: 'Leadership' }
    ],
    companies: [
      { id: 'co_openai', name: 'OpenAI', role: 'Head of AI', startYear: 2022, endYear: 2024 },
      { id: 'co_meta', name: 'Meta', role: 'Staff Research Scientist', startYear: 2018, endYear: 2022 }
    ],
    roles: [{ id: 'r_hai', name: 'Head of AI', title: 'Head of AI' }],
    projects: [
      { id: 'p_4', name: 'GraphRAG Autonomous Reasoning', role: 'Principal Investigator' }
    ],
    connections: ['c_1', 'c_4', 'c_9', 'c_10']
  },
  {
    id: 'c_4',
    name: 'Devin Sharma',
    title: 'Engineering Manager',
    location: 'Austin, TX',
    experience: 11,
    email: 'devin.sharma@example.com',
    about: 'Engineering leader passionate about mentoring high-velocity product teams, scaling graph data architectures, and driving engineering excellence.',
    skills: [
      { id: 'sk_mgmt', name: 'Engineering Management', proficiency: 5, category: 'Leadership' },
      { id: 'sk_arch', name: 'System Architecture', proficiency: 4, category: 'Leadership' },
      { id: 'sk_ts', name: 'TypeScript', proficiency: 4, category: 'Frontend' },
      { id: 'sk_aws', name: 'AWS Cloud', proficiency: 4, category: 'DevOps' }
    ],
    companies: [
      { id: 'co_airbnb', name: 'Airbnb', role: 'Engineering Manager', startYear: 2021, endYear: 2024 },
      { id: 'co_google', name: 'Google', role: 'Senior Software Engineer', startYear: 2015, endYear: 2021 }
    ],
    roles: [{ id: 'r_em', name: 'Engineering Manager', title: 'Engineering Manager' }],
    projects: [
      { id: 'p_5', name: 'Identity & Access Graph', role: 'Engineering Director' }
    ],
    connections: ['c_1', 'c_3', 'c_5', 'c_11']
  },
  {
    id: 'c_5',
    name: 'Sophia Patel',
    title: 'Senior Data Scientist',
    location: 'London, UK',
    experience: 6,
    email: 'sophia.patel@example.com',
    about: 'Graph ML practitioner focusing on network analysis, fraud detection, and predictive recommendation algorithms.',
    skills: [
      { id: 'sk_py', name: 'Python', proficiency: 5, category: 'Backend' },
      { id: 'sk_ml', name: 'Machine Learning', proficiency: 5, category: 'AI & Data' },
      { id: 'sk_neo4j', name: 'Neo4j / CognoDB', proficiency: 5, category: 'Database' },
      { id: 'sk_pg', name: 'PostgreSQL', proficiency: 4, category: 'Database' }
    ],
    companies: [
      { id: 'co_netflix', name: 'Netflix', role: 'Senior Data Scientist', startYear: 2020, endYear: 2024 }
    ],
    roles: [{ id: 'r_sds', name: 'Senior Data Scientist', title: 'Senior Data Scientist' }],
    projects: [
      { id: 'p_6', name: 'Real-Time Graph Recommendations', role: 'Lead Data Scientist' }
    ],
    connections: ['c_2', 'c_4', 'c_6', 'c_12']
  },
  {
    id: 'c_6',
    name: 'Lucas Dupont',
    title: 'Senior DevOps / SRE',
    location: 'Berlin, Germany',
    experience: 8,
    email: 'lucas.dupont@example.com',
    about: 'Zero-downtime infrastructure engineer specialized in multi-region Kubernetes clusters, GitOps pipelines, and Terraform automations.',
    skills: [
      { id: 'sk_k8s', name: 'Kubernetes', proficiency: 5, category: 'DevOps' },
      { id: 'sk_tf', name: 'Terraform', proficiency: 5, category: 'DevOps' },
      { id: 'sk_aws', name: 'AWS Cloud', proficiency: 5, category: 'DevOps' },
      { id: 'sk_docker', name: 'Docker', proficiency: 4, category: 'DevOps' }
    ],
    companies: [
      { id: 'co_stripe', name: 'Stripe', role: 'Senior SRE', startYear: 2021, endYear: 2024 },
      { id: 'co_meta', name: 'Meta', role: 'Infrastructure Engineer', startYear: 2017, endYear: 2021 }
    ],
    roles: [{ id: 'r_sdevo', name: 'Senior DevOps / SRE', title: 'Senior DevOps / SRE' }],
    projects: [
      { id: 'p_7', name: 'Multi-Region Mesh Deployment', role: 'Lead SRE' }
    ],
    connections: ['c_2', 'c_5', 'c_7', 'c_13']
  },
  {
    id: 'c_7',
    name: 'Maya Lin',
    title: 'Product Designer',
    location: 'Toronto, Canada',
    experience: 5,
    email: 'maya.lin@example.com',
    about: 'Design systems creator crafting immersive, highly accessible user experiences for complex data visualization and graph exploration tools.',
    skills: [
      { id: 'sk_figma', name: 'Figma', proficiency: 5, category: 'Design' },
      { id: 'sk_ux', name: 'User Research', proficiency: 5, category: 'Design' },
      { id: 'sk_tailwind', name: 'Tailwind CSS', proficiency: 4, category: 'Frontend' },
      { id: 'sk_react', name: 'React', proficiency: 3, category: 'Frontend' }
    ],
    companies: [
      { id: 'co_airbnb', name: 'Airbnb', role: 'Product Designer', startYear: 2020, endYear: 2024 }
    ],
    roles: [{ id: 'r_ux', name: 'Product Designer', title: 'Product Designer' }],
    projects: [
      { id: 'p_8', name: 'Dynamic Design Tokens System', role: 'Lead Designer' }
    ],
    connections: ['c_1', 'c_6', 'c_8', 'c_14']
  },
  {
    id: 'c_8',
    name: 'Hiroshi Tanaka',
    title: 'Software Engineer',
    location: 'Tokyo, Japan',
    experience: 4,
    email: 'hiroshi.tanaka@example.com',
    about: 'Frontend specialist building real-time collaboration tools with TypeScript, WebSockets, and state-of-the-art UI architectures.',
    skills: [
      { id: 'sk_ts', name: 'TypeScript', proficiency: 4, category: 'Frontend' },
      { id: 'sk_react', name: 'React', proficiency: 4, category: 'Frontend' },
      { id: 'sk_node', name: 'Node.js', proficiency: 3, category: 'Backend' },
      { id: 'sk_tailwind', name: 'Tailwind CSS', proficiency: 4, category: 'Frontend' }
    ],
    companies: [
      { id: 'co_vercel', name: 'Vercel', role: 'Frontend Engineer', startYear: 2022, endYear: 2024 }
    ],
    roles: [{ id: 'r_mdev', name: 'Software Engineer', title: 'Software Engineer' }],
    projects: [
      { id: 'p_9', name: 'Collaborative Canvas Engine', role: 'Frontend Engineer' }
    ],
    connections: ['c_2', 'c_7', 'c_9', 'c_15']
  }
];

export function getMockGraphData() {
  const nodes = [];
  const links = [];

  // Candidates
  mockCandidates.forEach(c => {
    nodes.push({
      id: c.id,
      name: c.name,
      title: c.title,
      type: 'Candidate',
      color: '#3b82f6',
      size: 8
    });
  });

  // Skills
  mockSkills.forEach(s => {
    nodes.push({
      id: s.id,
      name: s.name,
      category: s.category,
      type: 'Skill',
      color: '#10b981',
      size: 6
    });
  });

  // Companies
  mockCompanies.forEach(co => {
    nodes.push({
      id: co.id,
      name: co.name,
      type: 'Company',
      color: '#f59e0b',
      size: 7
    });
  });

  // Roles
  mockRoles.forEach(r => {
    nodes.push({
      id: r.id,
      name: r.name,
      department: r.department,
      type: 'Role',
      color: '#a855f7',
      size: 6
    });
  });

  // Connect candidate skills
  mockCandidates.forEach(c => {
    c.skills.forEach(s => {
      links.push({
        source: c.id,
        target: s.id,
        type: 'HAS_SKILL',
        proficiency: s.proficiency
      });
    });

    c.companies.forEach(co => {
      links.push({
        source: c.id,
        target: co.id,
        type: 'WORKED_AT',
        role: co.role
      });
    });

    if (c.connections) {
      c.connections.forEach(targetId => {
        links.push({
          source: c.id,
          target: targetId,
          type: 'KNOWS'
        });
      });
    }
  });

  // Role progressions
  mockRoleProgressions.forEach(([from, to]) => {
    links.push({
      source: from,
      target: to,
      type: 'LEADS_TO'
    });
  });

  return { nodes, links };
}
