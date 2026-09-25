"use client";

import { useId } from "react";

export function LineChart({ values, labels, ariaLabel }: { values: number[]; labels?: string[]; ariaLabel: string }) {
  const gradientId = useId().replace(/:/g, "");
  const width = 760; const height = 250; const padding = 12;
  const min = Math.min(0, ...values) === Math.max(...values) ? 0 : Math.max(0, Math.min(...values) - 15);
  const max = Math.max(100, Math.max(...values));
  const points = values.map((value,index) => {
    const x = padding + (index / Math.max(1,values.length-1)) * (width-padding*2);
    const y = height-padding-((value-min)/Math.max(1,max-min))*(height-padding*2);
    return [x,y] as const;
  });
  const line = points.map(([x,y],i) => `${i===0?"M":"L"}${x},${y}`).join(" ");
  const area = `${line} L${points.at(-1)?.[0] ?? width},${height-padding} L${points[0]?.[0] ?? padding},${height-padding} Z`;
  return <div className="chart-wrap" role="img" aria-label={ariaLabel}>
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8ff36" stopOpacity=".16"/><stop offset="1" stopColor="#c8ff36" stopOpacity="0"/></linearGradient></defs>
      {[.25,.5,.75].map((ratio) => <line key={ratio} className="chart-grid-line" x1={padding} x2={width-padding} y1={height*ratio} y2={height*ratio}/>) }
      <path d={area} fill={`url(#${gradientId})`}/><path d={line} className="chart-line"/>
      {points.length <= 31 && points.map(([x,y],i) => <circle key={i} className="chart-point" cx={x} cy={y} r="2"/>)}
      {labels && labels.length > 1 && <><text className="chart-label" x={padding} y={height-1}>{labels[0]}</text><text className="chart-label" x={width-padding} y={height-1} textAnchor="end">{labels[labels.length-1]}</text></>}
    </svg>
  </div>;
}
