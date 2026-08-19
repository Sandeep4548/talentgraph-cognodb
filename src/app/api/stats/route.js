import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_DASHBOARD_STATS } from '@/lib/queries';
import { mockCandidates, mockSkills, mockCompanies, mockRoles } from '@/lib/mockData';

export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json({
        candidates: mockCandidates.length,
        skills: mockSkills.length,
        companies: mockCompanies.length,
        roles: mockRoles.length,
        relationships: 124,
        isLiveDb: false,
        status: 'demo_mode'
      });
    }

    const records = await executeQuery(GET_DASHBOARD_STATS);
    
    if (records.length === 0) {
      return NextResponse.json({
        candidates: 0,
        skills: 0,
        companies: 0,
        roles: 0,
        relationships: 0,
        isLiveDb: true,
        status: 'connected'
      });
    }

    const record = records[0];
    const stats = {
      candidates: toNative(record.get('candidates')) || 0,
      skills: toNative(record.get('skills')) || 0,
      companies: toNative(record.get('companies')) || 0,
      roles: toNative(record.get('roles')) || 0,
      relationships: toNative(record.get('relationships')) || 0,
      isLiveDb: true,
      status: 'connected'
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.warn('[Stats API] Falling back to mock stats due to:', error.message);
    return NextResponse.json({
      candidates: mockCandidates.length,
      skills: mockSkills.length,
      companies: mockCompanies.length,
      roles: mockRoles.length,
      relationships: 124,
      isLiveDb: false,
      status: 'fallback',
      dbError: error.message
    });
  }
}
