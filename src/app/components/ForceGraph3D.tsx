"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div>Loading graph...</div>
});

interface Node {
  id: number;
}

interface Link {
  source: number;
  target: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function DynamicGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GraphData>({ nodes: [{ id: 0 }], links: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new connected node every second
      setData(({ nodes, links }) => {
        const id = nodes.length;
        return {
          nodes: [...nodes, { id }],
          links: [...links, { source: id, target: Math.round(Math.random() * (id-1)) }]
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback((node: Node) => {
    const { nodes, links } = data;

    // Remove node on click
    const newLinks = links.filter(l => l.source !== node.id && l.target !== node.id); // Remove links attached to node
    const newNodes = nodes.slice();
    newNodes.splice(node.id, 1); // Remove node
    newNodes.forEach((n, idx) => { n.id = idx; }); // Reset node ids to array index

    setData({ nodes: newNodes, links: newLinks });
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ForceGraph3D
        enableNodeDrag={false}
        onNodeClick={handleClick}
        graphData={data}
        width={containerRef.current?.clientWidth}
        height={containerRef.current?.clientHeight}
        nodeColor={() => '#3b82f6'}
        nodeRelSize={40}
        nodeLabel="id"
        linkColor={() => 'rgba(59, 130, 246, 0.4)'}
        linkWidth={3}
        linkDirectionalParticles={3}
        linkDirectionalParticleSpeed={0.01}
        backgroundColor="#000000"
        nodeThreeObject={node => {
          const group = new THREE.Group();

          // Create the main sphere with emissive material
          const geometry = new THREE.SphereGeometry(4, 32, 32);
          const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 2,
            shininess: 150,
            transparent: true,
            opacity: 0.95
          });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // Add multiple point lights for better glow
          const light1 = new THREE.PointLight(0x3b82f6, 4, 20);
          light1.position.set(0, 0, 0);
          group.add(light1);

          const light2 = new THREE.PointLight(0x3b82f6, 2, 15);
          light2.position.set(2, 2, 2);
          group.add(light2);

          const light3 = new THREE.PointLight(0x3b82f6, 2, 15);
          light3.position.set(-2, -2, -2);
          group.add(light3);

          const light4 = new THREE.PointLight(0x3b82f6, 2, 15);
          light4.position.set(2, -2, 2);
          group.add(light4);

          const light5 = new THREE.PointLight(0x3b82f6, 2, 15);
          light5.position.set(-2, 2, -2);
          group.add(light5);

          return group;
        }}
        onEngineStop={() => {
          // Add ambient light to the scene
          const scene = document.querySelector('canvas')?.parentElement;
          if (scene) {
            const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.4);
            scene.add(ambientLight);
          }
        }}
      />
    </div>
  );
} 