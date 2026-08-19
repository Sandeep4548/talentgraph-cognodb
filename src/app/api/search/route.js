import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured } from '@/lib/db';
import { SEARCH_GLOBAL } from '@/lib/queries';
import { mockCandidates, mockSkills, mockCompanies, mockRoles } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
  }

  try {
    if (!isDbConfigured()) {
      const lower = q.toLowerCase();
      const results = [];

      mockCandidates
        .filter(c => c.name.toLowerCase().includes(lower) || c.title.toLowerCase().includes(lower))
        .forEach(c => results.push({ type: 'Candidate', id: c.id, name: `${c.name} (${c.title})` }));

      mockSkills
        .filter(s => s.name.toLowerCase().includes(lower))
        .forEach(s => results.push({ type: 'Skill', id: s.id, name: s.name }));

      mockCompanies
        .filter(co => co.name.toLowerCase().includes(lower))
        .forEach(co => results.push({ type: 'Company', id: co.id, name: co.name }));

      mockRoles
        .filter(r => r.name.toLowerCase().includes(lower))
        .forEach(r => results.push({ type: 'Role', id: r.id, name: r.name }));

      return NextResponse.json(results.slice(0, 20));
    }

    const records = await executeQuery(SEARCH_GLOBAL, { q });

    const results = records.map(record => ({
      type: record.get('type'),
      id: record.get('id'),
      name: record.get('name')
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.warn('[Global Search API] Fallback:', error.message);
    const lower = q.toLowerCase();
    const results = [];
    mockCandidates
      .filter(c => c.name.toLowerCase().includes(lower))
      .forEach(c => results.push({ type: 'Candidate', id: c.id, name: c.name }));
    return NextResponse.json(results.slice(0, 10));
  }
}
