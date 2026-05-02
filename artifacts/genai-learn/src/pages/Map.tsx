import { useRef, useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ZoomIn, ZoomOut, Maximize2, Info } from "lucide-react";
import { topics, categories, categoryColors, type Category } from "@/data/topics";
import { useApp } from "@/context/AppContext";

/* ── Layout constants ─────────────────────────────────────── */
const CX = 540, CY = 320;
const HUB_R   = 205;   // distance from center to category hub
const TOPIC_R = 95;    // distance from hub to topic nodes
const NODE_R  = 14;    // topic node circle radius
const HUB_RAD = 26;    // category hub circle radius

const CAT_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  "Foundations":       { fill: "hsl(200 75% 48% / 0.15)", stroke: "hsl(200 75% 48%)", text: "hsl(200 75% 40%)" },
  "Core Models":       { fill: "hsl(255 60% 56% / 0.15)", stroke: "hsl(255 60% 56%)", text: "hsl(255 60% 50%)" },
  "Techniques":        { fill: "hsl(142 70% 40% / 0.15)", stroke: "hsl(142 70% 40%)", text: "hsl(142 70% 32%)" },
  "Applications":      { fill: "hsl(30 85% 52% / 0.15)",  stroke: "hsl(30 85% 52%)",  text: "hsl(30 85% 42%)"  },
  "Advanced Research": { fill: "hsl(0 70% 56% / 0.15)",   stroke: "hsl(0 70% 56%)",   text: "hsl(0 70% 48%)"   },
};

/* ── Position computation ─────────────────────────────────── */
// Pentagon angles in SVG coordinate space (y-down), clockwise from top
const HUB_ANGLES_DEG = [270, 342, 54, 126, 198];

function toRad(deg: number) { return deg * Math.PI / 180; }

interface NodePos { x: number; y: number }

function computeLayout() {
  const hubs: Record<string, NodePos & { angle: number }> = {};
  const nodes: Record<string, NodePos> = {};

  (categories as Category[]).forEach((cat, i) => {
    const a = toRad(HUB_ANGLES_DEG[i]);
    hubs[cat] = { x: CX + HUB_R * Math.cos(a), y: CY + HUB_R * Math.sin(a), angle: a };
  });

  (categories as Category[]).forEach((cat) => {
    const hub = hubs[cat];
    const catTopics = topics.filter(t => t.category === cat);
    const n = catTopics.length;
    const spread = Math.min(Math.PI * 0.85, n * 0.21);
    const startAngle = hub.angle - spread / 2;

    catTopics.forEach((t, i) => {
      const a = n > 1 ? startAngle + (spread * i) / (n - 1) : hub.angle;
      nodes[t.slug] = {
        x: hub.x + TOPIC_R * Math.cos(a),
        y: hub.y + TOPIC_R * Math.sin(a),
      };
    });
  });

  return { hubs, nodes };
}

const LAYOUT = computeLayout();

/* ── Component ────────────────────────────────────────────── */
export default function Map() {
  const { isComplete, completedCount } = useApp();
  const [, navigate] = useLocation();

  // Pan + zoom
  const [tx, setTx]     = useState(0);
  const [ty, setTy]     = useState(0);
  const [scale, setScale] = useState(0.85);
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Hover state
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredTopic = hovered ? topics.find(t => t.slug === hovered) : null;

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.09;
    setScale(s => Math.max(0.4, Math.min(2.5, s * factor)));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    setTx(t => t + e.clientX - lastMouse.current.x);
    setTy(t => t + e.clientY - lastMouse.current.y);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const resetView = () => { setTx(0); setTy(0); setScale(0.85); };

  // Edges for related topics
  const edges = topics.flatMap(t =>
    t.relatedSlugs
      .filter(r => r > t.slug) // avoid duplicate edges
      .map(r => ({ from: t.slug, to: r }))
  ).filter(e => LAYOUT.nodes[e.from] && LAYOUT.nodes[e.to]);

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div>
          <h1 className="text-sm font-semibold">Concept Map</h1>
          <p className="text-xs text-muted-foreground">{completedCount}/{topics.length} topics completed — click any node to open</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.min(2.5, s * 1.15))} className="p-1.5 rounded border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setScale(s => Math.max(0.4, s * 0.87))} className="p-1.5 rounded border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetView} className="p-1.5 rounded border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden" style={{ cursor: dragging.current ? "grabbing" : "grab" }}>
        <svg
          width="100%" height="100%"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ userSelect: "none" }}
        >
          <g transform={`translate(${tx},${ty}) scale(${scale})`}
             style={{ transformOrigin: "center" }}>

            {/* ── Edges (related topics) ── */}
            {edges.map(e => {
              const a = LAYOUT.nodes[e.from], b = LAYOUT.nodes[e.to];
              const isHov = hovered === e.from || hovered === e.to;
              return (
                <line key={`${e.from}-${e.to}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="hsl(var(--border))"
                  strokeWidth={isHov ? 1.5 : 0.7}
                  opacity={isHov ? 0.8 : 0.35}
                />
              );
            })}

            {/* ── Category hub backgrounds (convex hulls approximated with circles) ── */}
            {(categories as Category[]).map(cat => {
              const hub = LAYOUT.hubs[cat];
              const col = CAT_COLORS[cat];
              return (
                <g key={cat}>
                  <circle cx={hub.x} cy={hub.y} r={TOPIC_R + NODE_R + 12}
                    style={{ fill: col.fill }} opacity={0.5} />
                </g>
              );
            })}

            {/* ── Category hub labels ── */}
            {(categories as Category[]).map(cat => {
              const hub = LAYOUT.hubs[cat];
              const col = CAT_COLORS[cat];
              return (
                <g key={`hub-${cat}`}>
                  <circle cx={hub.x} cy={hub.y} r={HUB_RAD}
                    style={{ fill: col.fill, stroke: col.stroke }} strokeWidth={1.5} />
                  <text x={hub.x} y={hub.y} textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fontWeight={700}
                    style={{ fill: col.text, fontFamily: "var(--app-font-sans)", pointerEvents: "none" }}>
                    {cat.split(" ").map((w, i) => (
                      <tspan key={i} x={hub.x} dy={i === 0 ? (cat.includes(" ") ? -5 : 0) : 10}>{w}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* ── Topic nodes ── */}
            {topics.map(t => {
              const pos = LAYOUT.nodes[t.slug];
              if (!pos) return null;
              const done = isComplete(t.slug);
              const isHov = hovered === t.slug;
              const col = CAT_COLORS[t.category];
              return (
                <g key={t.slug}
                  onMouseEnter={() => setHovered(t.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => navigate(`/topic/${t.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Hover ring */}
                  {isHov && (
                    <circle cx={pos.x} cy={pos.y} r={NODE_R + 5}
                      style={{ fill: col.fill, stroke: col.stroke }} strokeWidth={1.5} opacity={0.6} />
                  )}
                  {/* Node */}
                  <circle cx={pos.x} cy={pos.y} r={NODE_R}
                    style={{
                      fill: done ? col.stroke : "hsl(var(--card))",
                      stroke: col.stroke,
                    }}
                    strokeWidth={done ? 0 : 1.5}
                  />
                  {/* Checkmark for done */}
                  {done && (
                    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                      fontSize={10} style={{ fill: "white", pointerEvents: "none" }}>✓</text>
                  )}
                  {/* Label */}
                  <text
                    x={pos.x} y={pos.y + NODE_R + 10}
                    textAnchor="middle" fontSize={8.5} fontWeight={isHov ? 600 : 400}
                    style={{ fill: isHov ? col.text : "hsl(var(--muted-foreground))", fontFamily: "var(--app-font-sans)", pointerEvents: "none" }}
                  >
                    {t.title.length > 18 ? t.title.slice(0, 16) + "…" : t.title}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredTopic && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-background shadow-lg">
              <div>
                <p className="text-sm font-semibold">{hoveredTopic.title}</p>
                <p className="text-xs text-muted-foreground">{hoveredTopic.category} · {hoveredTopic.difficulty} · {hoveredTopic.readTime}m</p>
              </div>
              {isComplete(hoveredTopic.slug) && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-5 left-5 p-3 rounded-lg border border-border bg-card/90 backdrop-blur-sm">
          <p className="text-xs font-semibold mb-2 text-muted-foreground">Categories</p>
          <div className="space-y-1">
            {(categories as Category[]).map(cat => (
              <div key={cat} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: CAT_COLORS[cat].stroke }} />
                <span className="text-xs text-muted-foreground">{cat}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-border space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted border border-border" />
              <span className="text-xs text-muted-foreground">Not read</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <Info className="w-3 h-3" />
          Scroll to zoom · drag to pan · click to open
        </div>
      </div>
    </div>
  );
}
