import { NextResponse } from 'next/server';
import { executeQuery, isDbConfigured, toNative } from '@/lib/db';
import { GET_GRAPH_DATA } from '@/lib/queries';
import { getMockGraphData } from '@/lib/mockData';

export async function GET(request) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(getMockGraphData());
    }

    const records = await executeQuery(GET_GRAPH_DATA);
    
    if (records.length === 0) {
      return NextResponse.json(getMockGraphData());
    }

    const rawNodes = toNative(records[0].get('nodes')) || [];
    const rawLinks = toNative(records[0].get('links')) || [];

    const typeColors = {
      'Candidate': '#3b82f6',
      'Skill': '#10b981',
      'Company': '#f59e0b',
      'Role': '#a855f7',
      'Project': '#f43f5e'
    };

    const typeSizes = {
      'Candidate': 8,
      'Skill': 6,
      'Company': 7,
      'Role': 6,
      'Project': 5
    };

    const nodes = rawNodes
      .filter(node => node && node.id)
      .map(node => {
        let type = 'Unknown';
        if (node.labels && node.labels.length > 0) {
          type = node.labels[0];
        } else if (node.category) {
          type = 'Skill';
        } else if (node.title) {
          type = 'Candidate';
        } else if (node.department) {
          type = 'Role';
        }

        return {
          id: node.id,
          name: node.name || node.title || node.id,
          title: node.title || '',
          category: node.category || '',
          department: node.department || '',
          location: node.location || '',
          experience: node.experience || 0,
          type: type,
          color: typeColors[type] || '#6b7280',
          size: typeSizes[type] || 5
        };
      });

    // Create a Set of existing node IDs for link validation
    const nodeIds = new Set(nodes.map(n => n.id));

    const links = rawLinks
      .filter(link => link && link.source && link.target && nodeIds.has(link.source) && nodeIds.has(link.target))
      .map(link => ({
        source: link.source,
        target: link.target,
        type: link.type || 'CONNECTED_TO'
      }));

    return NextResponse.json({ nodes, links });
  } catch (error) {
    console.warn('[Graph API] Fallback due to error:', error.message);
    return NextResponse.json(getMockGraphData());
  }
}
