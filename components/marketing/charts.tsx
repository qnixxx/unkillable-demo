import { pillarDefinitions } from "@/lib/config";
import type { Pillar } from "@/types";

const scores: Record<Pillar, number> = {
  body: 88, mind: 76, discipline: 91, recovery: 68, relationships: 79, purpose: 87,
};

const points = [
  [160, 38], [266, 99], [266, 221], [160, 282], [54, 221], [54, 99],
];
const center: [number, number] = [160, 160];

function scaledPoint(point: number[], score: number) {
  const t = score / 100;
  return [center[0] + (point[0] - center[0]) * t, center[1] + (point[1] - center[1]) * t];
}

export function RadarChart() {
  const entries = Object.keys(scores) as Pillar[];
  const polygon = entries.map((pillar, index) => scaledPoint(points[index], scores[pillar]).join(",")).join(" ");
  return (
    <div className="radar" role="img" aria-label="Radar chart: Body 88, Mind 76, Discipline 91, Recovery 68, Relationships 79, Purpose 87">
      <svg viewBox="0 0 320 320" aria-hidden="true">
        {[1, .75, .5, .25].map((factor) => {
          const poly = points.map((point) => scaledPoint(point, factor * 100).join(",")).join(" ");
          return <polygon key={factor} points={poly} fill="none" stroke="rgba(244,241,232,.10)" />;
        })}
        {points.map((point, index) => <line key={index} x1="160" y1="160" x2={point[0]} y2={point[1]} stroke="rgba(244,241,232,.08)" />)}
        <polygon points={polygon} fill="rgba(200,255,54,.12)" stroke="#c8ff36" strokeWidth="2" />
        {entries.map((pillar, index) => {
          const [x, y] = points[index];
          const label = pillarDefinitions[pillar].label;
          return <text key={pillar} x={x} y={y + (y < 160 ? -12 : 16)} textAnchor={x === 160 ? "middle" : x < 160 ? "end" : "start"}>{label}</text>;
        })}
      </svg>
    </div>
  );
}

export function MarketingLineChart() {
  const values = [61,65,64,69,70,68,72,71,74,76,75,79,77,80,82,81,82];
  const width = 700; const height = 220;
  const path = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - 55) / 35) * height;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <div className="line-chart" role="img" aria-label="Resilience score trend increasing from the low 60s to 82 over 30 days">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="marketingArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8ff36" stopOpacity=".15"/><stop offset="1" stopColor="#c8ff36" stopOpacity="0"/></linearGradient></defs>
        <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#marketingArea)" />
        <path d={path} fill="none" stroke="#c8ff36" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
