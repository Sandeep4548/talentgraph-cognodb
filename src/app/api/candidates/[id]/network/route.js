import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_CANDIDATE_NETWORK, GET_CANDIDATE_BY_ID } from '@/lib/queries';
import { mockCandidates } from '@/lib/mockData';

export async function GET(request, { params }) {
  const id = params.id;
  
  try {
    if (!isDbConfigured()) {
      const rootCandidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];
      const networkNodes = [
        { id: rootCandidate.id, name: rootCandidate.name, title: rootCandidate.title, distance: 0, isRoot: true }
      ];
      const networkLinks = [];

      mockCandidates.filter(c => c.id !== rootCandidate.id).slice(0, 10).forEach((c, idx) => {
        const distance = idx < 4 ? 1 : 2;
        networkNodes.push({
          id: c.id,
          name: c.name,
          title: c.title,
          distance,
          isRoot: false,
          skills: c.skills
        });

        if (distance === 1) {
          networkLinks.push({ source: rootCandidate.id, target: c.id, distance: 1 });
        } else {
          // Connect to a 1st degree node
          const intermediate = networkNodes[1]?.id || rootCandidate.id;
          networkLinks.push({ source: intermediate, target: c.id, distance: 2 });
        }
      });

      return NextResponse.json({
        root: rootCandidate,
        nodes: networkNodes,
        links: networkLinks,
        total1stDegree: 4,
        total2ndDegree: 6
      });
    }

    const [rootRecords, networkRecords] = await Promise.all([
      executeQuery(GET_CANDIDATE_BY_ID, { id }),
      executeQuery(GET_CANDIDATE_NETWORK, { id })
    ]);

    const rootCandidate = rootRecords.length > 0 ? toNative(rootRecords[0].get('candidate')) : null;

    const nodes = [
      {
        id,
        name: rootCandidate?.name || 'Current Candidate',
        title: rootCandidate?.title || '',
        distance: 0,
        isRoot: true,
        type: 'Candidate'
      }
    ];

    const links = [];
    let count1st = 0;
    let count2nd = 0;
    let count3rd = 0;

    networkRecords.forEach(record => {
      const peerId = record.get('id');
      const name = record.get('name');
      const title = record.get('title');
      const distance = toNative(record.get('distance')) || 1;
      const skills = toNative(record.get('skills')) || [];

      if (distance === 1) count1st++;
      else if (distance === 2) count2nd++;
      else if (distance >= 3) count3rd++;

      nodes.push({
        id: peerId,
        name,
        title,
        distance,
        isRoot: false,
        type: 'Candidate',
        skills
      });

      if (distance === 1) {
        links.push({ source: id, target: peerId, distance: 1 });
      }
    });

    return NextResponse.json({
      root: rootCandidate,
      nodes,
      links,
      stats: {
        degree1: count1st,
        degree2: count2nd,
        degree3: count3rd,
        totalReachable: nodes.length - 1
      }
    });
  } catch (error) {
    console.warn('[Network API] Error:', error.message);
    const rootCandidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];
    return NextResponse.json({
      root: rootCandidate,
      nodes: [
        { id: rootCandidate.id, name: rootCandidate.name, title: rootCandidate.title, distance: 0, isRoot: true }
      ],
      links: [],
      stats: { degree1: 0, degree2: 0, degree3: 0, totalReachable: 0 }
    });
  }
}
