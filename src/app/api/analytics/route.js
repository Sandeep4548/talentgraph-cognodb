import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { 
  SKILL_GAP_ANALYSIS, 
  FIND_CAREER_PATH, 
  RECOMMEND_CANDIDATES_FOR_ROLE,
  FIND_HIDDEN_TALENT,
  GET_ALL_ROLES
} from '@/lib/queries';
import { mockCandidates, mockRoles } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // -------------------------------------------------------------
    // 1. Skill Gap Analysis
    // -------------------------------------------------------------
    if (type === 'skill-gap') {
      const candidateId = searchParams.get('candidateId');
      const roleId = searchParams.get('roleId');
      if (!candidateId || !roleId) {
        return NextResponse.json({ error: 'Missing candidateId or roleId' }, { status: 400 });
      }

      if (!isDbConfigured()) {
        const candidate = mockCandidates.find(c => c.id === candidateId) || mockCandidates[0];
        const role = mockRoles.find(r => r.id === roleId || r.name === roleId) || mockRoles[0];
        const reqSkills = role.requiredSkills || ['TypeScript', 'React', 'Node.js', 'System Architecture'];

        const results = reqSkills.map((reqSkillName, idx) => {
          const candSkill = candidate.skills?.find(s => s.name.toLowerCase().includes(reqSkillName.toLowerCase()) || reqSkillName.toLowerCase().includes(s.name.toLowerCase()));
          return {
            skillId: `sk_${idx}`,
            skillName: reqSkillName,
            category: 'Core Competency',
            hasSkill: Boolean(candSkill),
            currentProficiency: candSkill ? candSkill.proficiency : 0,
            importance: idx === 0 ? 'High' : idx === 1 ? 'High' : 'Medium'
          };
        });
        return NextResponse.json(results);
      }

      const records = await executeQuery(SKILL_GAP_ANALYSIS, { candidateId, roleId });
      const results = records.map(r => ({
        skillId: r.get('skillId'),
        skillName: r.get('skillName'),
        category: r.get('category'),
        hasSkill: r.get('hasSkill'),
        currentProficiency: toNative(r.get('currentProficiency')) || 0,
        importance: r.get('importance') || 'High'
      }));
      return NextResponse.json(results);
    } 
    
    // -------------------------------------------------------------
    // 2. Career Path Finder (Shortest Path)
    // -------------------------------------------------------------
    if (type === 'career-path') {
      const fromRole = searchParams.get('fromRole');
      const toRole = searchParams.get('toRole');
      if (!fromRole || !toRole) {
        return NextResponse.json({ error: 'Missing fromRole or toRole' }, { status: 400 });
      }

      if (!isDbConfigured()) {
        // Generate a mock progression path
        const rFrom = mockRoles.find(r => r.id === fromRole || r.name === fromRole) || mockRoles[0];
        const rTo = mockRoles.find(r => r.id === toRole || r.name === toRole) || mockRoles[4];
        
        const pathNodes = [
          { id: rFrom.id, name: rFrom.name, department: rFrom.department, requiredSkills: rFrom.requiredSkills || ['JavaScript', 'Git'] },
          { id: 'r_mdev', name: 'Software Engineer', department: 'Engineering', requiredSkills: ['TypeScript', 'React', 'Node.js'] },
          { id: 'r_sdev', name: 'Senior Software Engineer', department: 'Engineering', requiredSkills: ['System Architecture', 'AWS Cloud'] },
          { id: rTo.id, name: rTo.name, department: rTo.department, requiredSkills: rTo.requiredSkills || ['Strategic Planning', 'Leadership'] }
        ];

        return NextResponse.json({
          pathNodes,
          length: pathNodes.length - 1
        });
      }

      const records = await executeQuery(FIND_CAREER_PATH, { fromRoleId: fromRole, toRoleId: toRole });
      if (records.length === 0) {
        return NextResponse.json({ pathNodes: [], length: 0 });
      }
      
      const result = records[0];
      const rawNodes = toNative(result.get('pathNodes')) || [];
      const length = toNative(result.get('length')) || 0;

      return NextResponse.json({
        pathNodes: rawNodes,
        length
      });
    }
    
    // -------------------------------------------------------------
    // 3. Role-Based Candidate Recommendations
    // -------------------------------------------------------------
    if (type === 'recommend') {
      const roleId = searchParams.get('roleId');
      if (!roleId) return NextResponse.json({ error: 'Missing roleId' }, { status: 400 });

      if (!isDbConfigured()) {
        const results = mockCandidates.map((c, i) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          location: c.location,
          matchPercentage: Math.max(35, 95 - i * 8),
          avgProficiency: 4.2,
          matchedSkillNames: c.skills.map(s => s.name).slice(0, 3)
        }));
        return NextResponse.json(results);
      }

      const records = await executeQuery(RECOMMEND_CANDIDATES_FOR_ROLE, { roleId });
      const results = records.map(r => ({
        id: r.get('id'),
        name: r.get('name'),
        title: r.get('title'),
        location: r.get('location'),
        matchPercentage: toNative(r.get('matchPercentage')),
        avgProficiency: toNative(r.get('avgProficiency')),
        matchedSkillNames: toNative(r.get('matchedSkillNames')) || []
      }));
      return NextResponse.json(results);
    }

    // -------------------------------------------------------------
    // 4. Hidden Talent & Multi-Hop Referral Discovery
    // -------------------------------------------------------------
    if (type === 'hidden-talent') {
      const seedId = searchParams.get('seedId');
      const skillId = searchParams.get('skillId');
      if (!seedId || !skillId) {
        return NextResponse.json({ error: 'Missing seedId or skillId' }, { status: 400 });
      }

      if (!isDbConfigured()) {
        const seed = mockCandidates.find(c => c.id === seedId) || mockCandidates[0];
        const results = mockCandidates
          .filter(c => c.id !== seed.id && c.skills.some(s => s.id === skillId || s.name.toLowerCase().includes(skillId.toLowerCase())))
          .slice(0, 5)
          .map((c, idx) => ({
            id: c.id,
            name: c.name,
            title: c.title,
            location: c.location,
            distance: 2,
            referralPath: [seed.name, 'Marcus Chen', c.name]
          }));
        return NextResponse.json(results);
      }

      const records = await executeQuery(FIND_HIDDEN_TALENT, { seedId, skillId });
      const results = records.map(r => ({
        id: r.get('id'),
        name: r.get('name'),
        title: r.get('title'),
        location: r.get('location'),
        distance: toNative(r.get('distance')),
        referralPath: toNative(r.get('referralPath'))
      }));
      return NextResponse.json(results);
    }

    return NextResponse.json({ error: 'Invalid or missing type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Analytics API] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
