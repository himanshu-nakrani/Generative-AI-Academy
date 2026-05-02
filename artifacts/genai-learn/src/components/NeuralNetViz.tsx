import { useEffect, useRef } from "react";

export function NeuralNetViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const layers = [4, 6, 6, 4, 2];
    const nodeRadius = 6;
    const colX = (i: number) => W * 0.1 + (i / (layers.length - 1)) * W * 0.8;

    type Node = { x: number; y: number; phase: number; layer: number };
    const nodes: Node[] = [];
    layers.forEach((count, li) => {
      for (let ni = 0; ni < count; ni++) {
        const y = H / 2 + (ni - (count - 1) / 2) * (H / (count + 1));
        nodes.push({ x: colX(li), y, phase: Math.random() * Math.PI * 2, layer: li });
      }
    });

    let t = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Edges
      layers.forEach((_, li) => {
        if (li >= layers.length - 1) return;
        const layerNodes = nodes.filter(n => n.layer === li);
        const nextNodes = nodes.filter(n => n.layer === li + 1);
        layerNodes.forEach(a => {
          nextNodes.forEach(b => {
            const signal = (Math.sin(t * 0.8 + a.phase + b.phase) + 1) / 2;
            const alpha = 0.06 + signal * 0.14;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(139,92,246,${alpha})`);
            grad.addColorStop(1, `rgba(14,165,233,${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          });
        });
      });

      // Nodes
      nodes.forEach(n => {
        const pulse = (Math.sin(t + n.phase) + 1) / 2;
        const glow = 8 + pulse * 8;

        // Outer glow
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
        gradient.addColorStop(0, `rgba(139,92,246,${0.3 + pulse * 0.3})`);
        gradient.addColorStop(1, "rgba(139,92,246,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
        const coreGrad = ctx.createRadialGradient(n.x - 2, n.y - 2, 0, n.x, n.y, nodeRadius);
        coreGrad.addColorStop(0, `hsl(262,83%,${72 + pulse * 15}%)`);
        coreGrad.addColorStop(1, `hsl(262,83%,50%)`);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      });

      // Travelling signal dots
      const signalCount = 8;
      for (let s = 0; s < signalCount; s++) {
        const layerIdx = Math.floor(s / 2) % (layers.length - 1);
        const layerNodes = nodes.filter(n => n.layer === layerIdx);
        const nextNodes = nodes.filter(n => n.layer === layerIdx + 1);
        if (!layerNodes.length || !nextNodes.length) continue;
        const a = layerNodes[s % layerNodes.length];
        const b = nextNodes[(s * 3) % nextNodes.length];
        const progress = ((t * 0.4 + s * 1.3) % 3) / 3;
        if (progress > 1) continue;
        const sx = a.x + (b.x - a.x) * progress;
        const sy = a.y + (b.y - a.y) * progress;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,165,233,${0.8 - progress * 0.6})`;
        ctx.fill();
      }

      t += 0.03;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
