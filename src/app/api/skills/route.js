import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_ALL_SKILLS } from '@/lib/queries';
import { mockSkills } from '@/lib/mockData';

export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(mockSkills);
    }

    const records = await executeQuery(GET_ALL_SKILLS);
    const skills = records.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
      candidateCount: toNative(record.get('candidateCount')) || 0
    }));

    return NextResponse.json(skills);
  } catch (error) {
    console.warn('[Skills API] Fallback to mock skills:', error.message);
    return NextResponse.json(mockSkills);
  }
}
