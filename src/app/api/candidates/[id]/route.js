import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_CANDIDATE_BY_ID } from '@/lib/queries';
import { mockCandidates } from '@/lib/mockData';

export async function GET(request, { params }) {
  const id = params.id;

  try {
    if (!isDbConfigured()) {
      const candidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];
      return NextResponse.json(candidate);
    }

    const records = await executeQuery(GET_CANDIDATE_BY_ID, { id });

    if (records.length === 0) {
      const candidate = mockCandidates.find(c => c.id === id);
      if (candidate) return NextResponse.json(candidate);
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const candidate = toNative(records[0].get('candidate'));
    return NextResponse.json(candidate);
  } catch (error) {
    console.warn('[Candidate Detail API] Fallback for ID:', id, error.message);
    const candidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];
    return NextResponse.json(candidate);
  }
}
