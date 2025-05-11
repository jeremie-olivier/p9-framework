"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';

interface ForceGraph3DInstance {
  cameraPosition: (pos: { x?: number; y?: number; z?: number }) => void;
}

interface ForceGraph3DProps {
  ref?: React.RefCallback<ForceGraph3DInstance>;
  enableNodeDrag?: boolean;
  graphData: GraphData;
  width: number;
  height: number;
  nodeColor: () => string;
  nodeRelSize: number;
  nodeLabel: string;
  linkColor: () => string;
  linkWidth: number;
  backgroundColor: string;
  onEngineStop?: () => void;
  showNavInfo?: boolean;
}

// @ts-expect-error ssr
const ForceGraph3D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph3D), {
  ssr: false
}) as React.ComponentType<ForceGraph3DProps>;

interface Node {
  id: string;
  label: string;
}

interface Link {
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface Atom {
  label: string;
  __typename: string;
}

interface Claim {
  subject: Atom;
  predicate: Atom;
  object: Atom;
  __typename: string;
}

interface DynamicGraphProps {
  width: number;
  height: number;
}

const CLAIMS_SUBSCRIPTION = gql`
  subscription Subscription_root($where: claims_bool_exp) {
    claims(where: $where) {
      subject {
        label
        __typename
      }
      predicate {
        label
        __typename
      }
      object {
        label
        __typename
      }
      __typename
    }
  }
`;

export default function DynamicGraph({ width, height }: DynamicGraphProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraph3DInstance | null>(null);
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const nodeMapRef = useRef<Map<string, Node>>(new Map());
  const [isGraphLoaded, setIsGraphLoaded] = useState(false);

  const distance = 600;

  useEffect(() => {
    if (!fgRef.current) return;

    fgRef.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    const intervalId = setInterval(() => {
      if (!fgRef.current) return;
      fgRef.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      });
      angle += Math.PI / 1500;
    }, 10);

    return () => clearInterval(intervalId);
  }, [isGraphLoaded]);

  const { data: subscriptionData, loading, error } = useSubscription(CLAIMS_SUBSCRIPTION, {
    variables: {
      where: {
        account_id: {
          _eq: "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"
        }
      }
    }
  });

  useEffect(() => {
    if (subscriptionData?.claims) {
      const claims = subscriptionData.claims as Claim[];

      // Reset the node map and data for a fresh start
      nodeMapRef.current.clear();
      const newNodes: Node[] = [];
      const newLinks: Link[] = [];

      // First pass: create all nodes
      claims.forEach(claim => {
        // Add subject node
        if (!nodeMapRef.current.has(claim.subject.label)) {
          const subjectNode = { id: claim.subject.label, label: claim.subject.label };
          newNodes.push(subjectNode);
          nodeMapRef.current.set(claim.subject.label, subjectNode);
        }

        // Add object node
        if (!nodeMapRef.current.has(claim.object.label)) {
          const objectNode = { id: claim.object.label, label: claim.object.label };
          newNodes.push(objectNode);
          nodeMapRef.current.set(claim.object.label, objectNode);
        }
      });

      // Second pass: create all links
      claims.forEach(claim => {
        const link = {
          source: claim.subject.label,
          target: claim.object.label,
          label: claim.predicate.label
        };
        newLinks.push(link);
      });

      console.log('Final graph data:', {
        nodes: newNodes,
        links: newLinks,
        nodeCount: newNodes.length,
        linkCount: newLinks.length
      });

      setData({ nodes: newNodes, links: newLinks });
    }
  }, [subscriptionData]);

  if (loading) return <div>Loading subscription...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000000'
      }}
    >
      {data.nodes.length > 0 ? (
        <ForceGraph3D
          ref={(el: ForceGraph3DInstance | null) => {
            fgRef.current = el;
            if (el) setIsGraphLoaded(true);
          }}
          enableNodeDrag={false}
          graphData={data}
          width={width}
          height={height}
          nodeColor={() => '#3b82f6'}
          nodeRelSize={6}
          nodeLabel="label"
          linkColor={() => 'rgba(59, 130, 246, 0.4)'}
          linkWidth={1}
          backgroundColor="#000000"
          onEngineStop={() => console.log('Engine stopped')}
          showNavInfo={false}
        />
      ) : (
        <div style={{ color: 'white', padding: '20px' }}>
          No data available (Nodes: {data.nodes.length}, Links: {data.links.length})
          <pre style={{ color: 'gray', fontSize: '12px', marginTop: '10px' }}>
            {JSON.stringify(subscriptionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 