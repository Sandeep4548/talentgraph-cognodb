import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cypher, params = {} } = body;

    if (!cypher || typeof cypher !== 'string') {
      return NextResponse.json({ error: 'Missing Cypher query string' }, { status: 400 });
    }

    // Guardrail: only allow read queries in playground
    const trimmed = cypher.trim().toUpperCase();
    if (trimmed.startsWith('CREATE') || trimmed.startsWith('DELETE') || trimmed.startsWith('DROP') || trimmed.startsWith('MERGE')) {
      return NextResponse.json({ error: 'Mutation queries are disabled in the live query playground.' }, { status: 403 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({
        isLiveDb: false,
        executionTimeMs: 14,
        recordsCount: 3,
        records: [
          { name: 'Alexandra Vance', title: 'Senior Software Engineer', degree: 2, hops: 2 },
          { name: 'Marcus Chen', title: 'Staff Software Engineer', degree: 2, hops: 2 },
          { name: 'Sophia Patel', title: 'Senior Data Scientist', degree: 3, hops: 3 }
        ],
        note: 'Live CognoDB credentials not set. Returned simulated query response.'
      });
    }

    const startTime = performance.now();
    const rawRecords = await executeQuery(cypher, params);
    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 10) / 10;

    const records = rawRecords.map(rec => {
      const obj = {};
      rec.keys.forEach(k => {
        obj[k] = toNative(rec.get(k));
      });
      return obj;
    });

    return NextResponse.json({
      isLiveDb: true,
      executionTimeMs,
      recordsCount: records.length,
      records
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      isLiveDb: isDbConfigured()
    }, { status: 500 });
  }
}
