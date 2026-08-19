import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { SEARCH_CANDIDATES } from '@/lib/queries';
import { mockCandidates } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || null;
  const skill = searchParams.get('skill') || null;

  try {
    if (!isDbConfigured()) {
      let filtered = [...mockCandidates];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(s) || 
          c.title.toLowerCase().includes(s) ||
          c.location.toLowerCase().includes(s)
        );
      }
      if (skill) {
        const sk = skill.toLowerCase();
        filtered = filtered.filter(c => 
          c.skills.some(s => s.name.toLowerCase() === sk || s.id?.toLowerCase() === sk)
        );
      }
      return NextResponse.json(filtered);
    }

    const records = await executeQuery(SEARCH_CANDIDATES, { 
      name: search, 
      skill: skill 
    });

    const candidates = records.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      title: record.get('title'),
      location: record.get('location'),
      experience: toNative(record.get('experience')),
      email: record.get('email'),
      about: record.get('about'),
      skills: toNative(record.get('skills')) || []
    }));

    return NextResponse.json(candidates);
  } catch (error) {
    console.warn('[Candidates API] Falling back to mock data due to:', error.message);
    let filtered = [...mockCandidates];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(s) || 
        c.title.toLowerCase().includes(s)
      );
    }
    if (skill) {
      const sk = skill.toLowerCase();
      filtered = filtered.filter(c => 
        c.skills.some(s => s.name.toLowerCase() === sk || s.id?.toLowerCase() === sk)
      );
    }
    return NextResponse.json(filtered);
  }
}
