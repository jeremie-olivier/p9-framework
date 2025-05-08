

"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import type { Centroid } from "@/lib/archetypeCentroids";

interface ArchetypeRadarProps {
  data: Centroid[];
  slug: string;
  name: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  withReferenceBands?: boolean;
  tickLabels?: boolean;
}

export default function ArchetypeRadar({
  data,
  slug,
  name,
  width = 300,
  height = 300,
  showTooltip = true,
  withReferenceBands = true,
  tickLabels = true,
}: ArchetypeRadarProps) {
  const chartData = data.map((d) => ({
    dimension: d.dimension,
    score: d[slug] as number,
  }));

  return (
    <RadarChart width={width} height={height} data={chartData} outerRadius={120}>
      <PolarGrid />
      <PolarAngleAxis dataKey="dimension" tick={tickLabels ? { fontSize: 12 } : false} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
      {withReferenceBands && (
        <>
          <Radar
            name="25th Percentile"
            dataKey={() => 25}
            stroke="#ddd"
            fill="#eee"
            fillOpacity={0.05}
            isAnimationActive={false}
          />
          <Radar
            name="50th Percentile"
            dataKey={() => 50}
            stroke="#ccc"
            fill="#ccc"
            fillOpacity={0.05}
            isAnimationActive={false}
          />
          <Radar
            name="75th Percentile"
            dataKey={() => 75}
            stroke="#ddd"
            fill="#eee"
            fillOpacity={0.05}
            isAnimationActive={false}
          />
        </>
      )}
      <Radar
        name={name}
        dataKey="score"
        stroke="#3a5fcd"
        fill="#3a5fcd"
        fillOpacity={0.8}
      />
      {showTooltip && <Tooltip />}
    </RadarChart>
  );
}