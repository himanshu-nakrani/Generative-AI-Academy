import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { topics } from "@/data/topics";
import { useApp } from "@/context/AppContext";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

export default function Map() {
  const { completed } = useApp();
  const [, navigate] = useLocation();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const categories = ["Foundations", "Core Models", "Techniques", "Applications", "Advanced Research"];
  const centerX = 500;
  const centerY = 500;
  const radius = 300;

  // Calculate positions for categories in a pentagon
  const categoryNodes = categories.map((cat, i) => {
    const angle = (i * 2 * Math.PI) / categories.length - Math.PI / 2;
    return {
      name: cat,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle
    };
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.max(0.5, Math.min(3, scale - e.deltaY * 0.005));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Ensure svg ref handles wheel cleanly
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Concept Map</h1>
        <p className="text-lg text-muted-foreground">
          Explore the relationships between Generative AI concepts. Pan and zoom to navigate.
        </p>
      </div>

      <div className="relative bg-white border-2 border-border rounded-xl overflow-hidden" style={{ height: "600px" }}>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm border border-border">
          <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-2 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-2 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={resetView} className="p-2 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* SVG Map */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          viewBox="0 0 1000 1000"
        >
          <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`} style={{ transformOrigin: 'center' }}>
            
            {/* Draw lines between categories (Pentagon) */}
            <polygon 
              points={categoryNodes.map(n => `${n.x},${n.y}`).join(" ")}
              fill="none" 
              stroke="#d9c9a8" 
              strokeWidth="2" 
              strokeDasharray="8 8"
            />

            {/* Draw Category Hubs */}
            {categoryNodes.map((cat) => (
              <g key={cat.name} transform={`translate(${cat.x}, ${cat.y})`}>
                <circle r="40" fill="#f0e6d0" stroke="#c8882a" strokeWidth="3" />
                <text y="-55" textAnchor="middle" className="font-serif font-bold fill-[#2c1f0e] text-lg">
                  {cat.name}
                </text>
              </g>
            ))}

            {/* Draw Topic Nodes */}
            {categoryNodes.map((cat) => {
              const catTopics = topics.filter(t => t.category === cat.name);
              return catTopics.map((topic, j) => {
                // Distribute topics in an arc around the category hub
                const angleSpread = Math.PI / 1.5;
                const startAngle = cat.angle - angleSpread / 2;
                const step = catTopics.length > 1 ? angleSpread / (catTopics.length - 1) : 0;
                const nodeAngle = startAngle + j * step;
                const distance = 120 + (j % 2) * 40; // Stagger distances
                
                const x = cat.x + distance * Math.cos(nodeAngle);
                const y = cat.y + distance * Math.sin(nodeAngle);
                
                const isCompleted = completed.has(topic.slug);

                return (
                  <g key={topic.slug}>
                    {/* Line to hub */}
                    <line x1={cat.x} y1={cat.y} x2={x} y2={y} stroke="#e0d0b5" strokeWidth="2" />
                    
                    {/* Topic Node */}
                    <g 
                      transform={`translate(${x}, ${y})`} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/topic/${topic.slug}`)}
                    >
                      <circle 
                        r="20" 
                        fill={isCompleted ? "#bbf7d0" : "#fff"} 
                        stroke={isCompleted ? "#22c55e" : "#d9c9a8"} 
                        strokeWidth="3" 
                        className="transition-colors"
                      />
                      <text 
                        y="35" 
                        textAnchor="middle" 
                        className="font-sans text-xs font-semibold fill-[#4a3520] max-w-[100px]"
                      >
                        {topic.title.length > 18 ? topic.title.substring(0, 16) + "..." : topic.title}
                      </text>
                    </g>
                  </g>
                );
              });
            })}

          </g>
        </svg>
      </div>
    </div>
  );
}
