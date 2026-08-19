import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_ALL_ROLES } from '@/lib/queries';
import { mockRoles } from '@/lib/mockData';

export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(mockRoles);
    }

    const records = await executeQuery(GET_ALL_ROLES);
    const roles = records.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      department: record.get('department'),
      leadsTo: toNative(record.get('leadsTo')) || [],
      requiredSkills: toNative(record.get('requiredSkills')) || []
    }));

    return NextResponse.json(roles);
  } catch (error) {
    console.warn('[Roles API] Fallback to mock roles:', error.message);
    return NextResponse.json(mockRoles);
  }
}
