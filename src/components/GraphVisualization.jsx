'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <LoadingSpinner message="Initializing Graph Physics Engine..." />
});

export default function GraphVisualization({ 
  graphData, 
  onNodeClick, 
  width, 
  height = 650,
  className = '',
  highlightedNodeId = null
}) {
  const fgRef = useRef();
  const [containerDimensions, setContainerDimensions] = useState({ width: width || 800, height });
  const [hoveredNode, setHoveredNode] = useState(null);
  const containerRef = useRef(null);

  // Resize observer to make the canvas responsive
  useEffect(() => {
    if (width) return;
    
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width: newWidth, height: newHeight } = entries[0].contentRect;
        setContainerDimensions({ 
          width: newWidth || 800, 
          height: newHeight > 200 ? newHeight : height 
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, [width, height]);

  // Color mapping based on node type
  const getNodeColor = useCallback((node) => {
    if (node.color) return node.color;
    switch (node.type?.toLowerCase()) {
      case 'candidate': return '#3B82F6'; // Blue
      case 'skill': return '#10B981'; // Emerald
      case 'company': return '#F59E0B'; // Amber
      case 'role': return '#A855F7'; // Purple
      case 'project': return '#F43F5E'; // Rose
      default: return '#64748B'; // Slate
    }
  }, []);

  const getNodeSize = useCallback((node) => {
    if (node.size) return node.size;
    if (node.isRoot) return 12;
    if (node.type?.toLowerCase() === 'candidate') return 8;
    if (node.type?.toLowerCase() === 'company') return 7;
    return 5;
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (onNodeClick) onNodeClick(node);
    
    // Zoom and center on selected node
    if (fgRef.current && node.x !== undefined && node.y !== undefined) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(2.5, 800);
    }
  }, [onNodeClick]);

  const handleZoomIn = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() * 1.3, 400);
  };

  const handleZoomOut = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() * 0.7, 400);
  };

  const handleZoomReset = () => {
    if (fgRef.current) fgRef.current.zoomToFit(600, 40);
  };

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className={`card flex items-center justify-center min-h-[${height}px] ${className}`}>
        <p className="text-slate-500 text-sm">No graph entities available to display.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 ${className}`}>
      <ForceGraph2D
        ref={fgRef}
        width={containerDimensions.width}
        height={containerDimensions.height}
        graphData={graphData}
        nodeLabel={(node) => `${node.name || node.title} (${node.type || 'Entity'})`}
        nodeColor={getNodeColor}
        nodeVal={getNodeSize}
        linkColor={() => 'rgba(100, 116, 139, 0.25)'}
        linkWidth={1}
        linkDirectionalParticles={1}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleColor={() => 'rgba(129, 140, 248, 0.6)'}
        backgroundColor="#020617"
        onNodeClick={handleNodeClick}
        onNodeHover={(node) => setHoveredNode(node)}
        cooldownTicks={120}
        onEngineStop={() => {
          if (fgRef.current) {
            fgRef.current.zoomToFit(500, 50);
          }
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name || node.title || node.id;
          const fontSize = Math.max(10 / globalScale, 3);
          const color = getNodeColor(node);
          const size = getNodeSize(node);
          const isSelected = highlightedNodeId === node.id || (hoveredNode && hoveredNode.id === node.id);

          // Outer Glow / Ring for hovered or selected node
          if (isSelected) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 4 / globalScale, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
            ctx.fill();
            ctx.strokeStyle = '#818CF8';
            ctx.lineWidth = 1.5 / globalScale;
            ctx.stroke();
          }

          // Node core circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 1 / globalScale;
          ctx.stroke();

          // Text label
          if (globalScale > 0.9 || size >= 7 || isSelected) {
            ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Background pill for label legibility
            const textWidth = ctx.measureText(label).width;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(
              node.x - textWidth / 2 - 2,
              node.y + size + 2,
              textWidth + 4,
              fontSize + 2
            );

            ctx.fillStyle = isSelected ? '#FFFFFF' : '#E2E8F0';
            ctx.fillText(label, node.x, node.y + size + fontSize / 2 + 3);
          }
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl z-20">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleZoomReset}
          title="Reset Zoom"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
