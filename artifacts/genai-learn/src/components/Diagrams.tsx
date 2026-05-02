import { useId } from "react";
import type { ReactNode } from "react";

/* ── Shared color tokens (CSS-var-aware, dark-mode safe) ─────────────────── */
const C = {
  fg:      "hsl(var(--foreground))",
  mFg:     "hsl(var(--muted-foreground))",
  bg:      "hsl(var(--card))",
  muted:   "hsl(var(--muted))",
  border:  "hsl(var(--border))",
  primary: "hsl(var(--primary))",
  pBg:     "hsl(var(--primary) / 0.12)",
  pBd:     "hsl(var(--primary) / 0.4)",
  teal:    "hsl(200 75% 48%)",
  tBg:     "hsl(200 75% 48% / 0.12)",
  tBd:     "hsl(200 75% 48% / 0.4)",
  green:   "#10b981", gBg: "rgba(16,185,129,.12)", gBd: "rgba(16,185,129,.4)",
  orange:  "#f59e0b", oBg: "rgba(245,158,11,.12)",
  red:     "#ef4444", rBg: "rgba(239,68,68,.12)",  rBd: "rgba(239,68,68,.4)",
  sans:    "var(--app-font-sans)",
  mono:    "var(--app-font-mono)",
};

/* ── Frame wrapper ────────────────────────────────────────────────────────── */
function Frame({ children, vb, caption, h = 190 }: {
  children: ReactNode; vb: string; caption: string; h?: number;
}) {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div style={{ height: h }} className="px-4 pt-4">
        <svg viewBox={vb} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {children}
        </svg>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function T({ x, y, size = 11, fill = C.fg, bold = false, anchor = "middle", mono = false, children }: {
  x: number; y: number; size?: number; fill?: string; bold?: boolean;
  anchor?: "middle" | "start" | "end"; mono?: boolean; children: ReactNode;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
      fontSize={size} style={{ fill, fontFamily: mono ? C.mono : C.sans, fontWeight: bold ? 600 : 400 }}>
      {children}
    </text>
  );
}

function Rect({ x, y, w, h, fill, stroke, rx = 5 }: {
  x: number; y: number; w: number; h: number;
  fill?: string; stroke?: string; rx?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={rx}
    style={{ fill: fill ?? C.muted, stroke: stroke ?? C.border }} strokeWidth={1} />;
}

function Box({ x, y, w, h, label, sub, fill, stroke, labelSize = 11, subSize = 9 }: {
  x: number; y: number; w: number; h: number; label: string; sub?: string;
  fill?: string; stroke?: string; labelSize?: number; subSize?: number;
}) {
  const cy = sub ? y + h / 2 - 7 : y + h / 2;
  return (
    <g>
      <Rect x={x} y={y} w={w} h={h} fill={fill} stroke={stroke} />
      <T x={x + w / 2} y={cy} fill={fill === C.pBg ? C.primary : fill === C.tBg ? C.teal : fill === C.gBg ? C.green : C.fg} size={labelSize}>{label}</T>
      {sub && <T x={x + w / 2} y={y + h / 2 + 8} fill={C.mFg} size={subSize}>{sub}</T>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, id, color = C.mFg, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; id: string;
  color?: string; dashed?: boolean;
}) {
  return (
    <>
      <defs>
        <marker id={id} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L6,2.5 L0,5 Z" style={{ fill: color }} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "4,3" : undefined} markerEnd={`url(#${id})`} />
    </>
  );
}

function Path({ d, id, color = C.mFg }: { d: string; id: string; color?: string }) {
  return (
    <>
      <defs>
        <marker id={id} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L6,2.5 L0,5 Z" style={{ fill: color }} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} markerEnd={`url(#${id})`} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. NEURAL NETWORK
═══════════════════════════════════════════════════════════════════════════ */
export function NeuralNetDiagram() {
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const cols = [70, 250, 430];
  const rows = {
    input:  [30, 80, 130, 180],
    hidden: [18, 60, 105, 148, 192],
    output: [60, 105, 150],
  };
  const r = 17;

  const nodeStyle = (type: "input" | "hidden" | "output") => ({
    fill:   type === "input" ? C.muted : type === "hidden" ? C.pBg : C.tBg,
    stroke: type === "input" ? C.border : type === "hidden" ? C.pBd : C.tBd,
  });
  const labelColor = (type: "input" | "hidden" | "output") =>
    type === "input" ? C.fg : type === "hidden" ? C.primary : C.teal;

  return (
    <Frame vb="0 0 500 215" caption="Multilayer perceptron: dense connections between layers propagate and transform information." h={195}>
      {/* Connection lines */}
      {rows.input.flatMap((y1, i) => rows.hidden.map((y2, j) => (
        <line key={`ih${i}${j}`} x1={cols[0] + r} y1={y1} x2={cols[1] - r} y2={y2}
          stroke={C.border} strokeWidth={0.7} />
      )))}
      {rows.hidden.flatMap((y1, i) => rows.output.map((y2, j) => (
        <line key={`ho${i}${j}`} x1={cols[1] + r} y1={y1} x2={cols[2] - r} y2={y2}
          stroke={C.border} strokeWidth={0.7} />
      )))}
      {/* Nodes */}
      {(["input", "hidden", "output"] as const).map(type =>
        rows[type].map((y, i) => (
          <g key={`${type}${i}`}>
            <circle cx={cols[type === "input" ? 0 : type === "hidden" ? 1 : 2]} cy={y}
              r={r} style={nodeStyle(type)} strokeWidth={1.5} />
            <T x={cols[type === "input" ? 0 : type === "hidden" ? 1 : 2]} y={y}
              fill={labelColor(type)} size={10} mono>
              {type === "input" ? `x${i + 1}` : type === "hidden" ? `h${i + 1}` : `y${i + 1}`}
            </T>
          </g>
        ))
      )}
      {/* Layer labels */}
      {[["Input", cols[0]], ["Hidden (×5)", cols[1]], ["Output", cols[2]]].map(([lbl, x]) => (
        <T key={String(lbl)} x={Number(x)} y={207} fill={C.mFg} size={10}>{String(lbl)}</T>
      ))}
      {/* Weights label */}
      <T x={160} y={100} fill={C.mFg} size={9}>weights W</T>
      <T x={340} y={100} fill={C.mFg} size={9}>weights W</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. TRANSFORMER ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════ */
export function TransformerDiagram() {
  return (
    <Frame vb="0 0 480 290" caption="Decoder-only transformer (GPT-style): tokens embed → repeated attention + FFN blocks → next-token probabilities." h={270}>
      {/* Input tokens */}
      {["<s>", "The", "cat", "sat"].map((t, i) => (
        <g key={t}>
          <Rect x={30 + i * 60} y={255} w={50} h={22} rx={4} fill={C.muted} stroke={C.border} />
          <T x={55 + i * 60} y={266} size={10} mono>{t}</T>
        </g>
      ))}
      <T x={285} y={266} fill={C.mFg} size={9}>Input tokens</T>

      {/* Arrow up */}
      <Arrow x1={155} y1={253} x2={155} y2={226} id="t1" />

      {/* Token + Positional Embedding */}
      <Box x={30} y={205} w={320} h={22} label="Token Embedding  +  Positional Encoding" fill={C.muted} labelSize={10} />

      <Arrow x1={190} y1={205} x2={190} y2={178} id="t2" />

      {/* Repeated block */}
      <rect x={20} y={80} width={340} height={120} rx={8}
        style={{ fill: "none", stroke: C.pBd }} strokeWidth={1.5} strokeDasharray="5,3" />
      <T x={370} y={110} fill={C.primary} size={9} anchor="start">N×</T>

      {/* Masked Self-Attention */}
      <Box x={30} y={155} w={320} h={26} label="Masked Multi-Head Self-Attention" fill={C.pBg} stroke={C.pBd} labelSize={11} />
      <Arrow x1={190} y1={154} x2={190} y2={134} id="t3" />

      {/* Add & Norm */}
      <Box x={30} y={110} w={320} h={20} label="Add & Layer Norm" fill={C.muted} labelSize={10} />
      <Arrow x1={190} y1={109} x2={190} y2={89} id="t4" />

      {/* FFN */}
      <Box x={30} y={84} w={320} h={22} label="Feed-Forward Network  (Linear → ReLU → Linear)" fill={C.tBg} stroke={C.tBd} labelSize={10} />
      <Arrow x1={190} y1={83} x2={190} y2={63} id="t5" />

      {/* Add & Norm 2 */}
      <Box x={30} y={42} w={320} h={20} label="Add & Layer Norm" fill={C.muted} labelSize={10} />
      <Arrow x1={190} y1={41} x2={190} y2={22} id="t6" />

      {/* Output */}
      <Box x={30} y={5} w={320} h={15} label="Linear  →  Softmax  →  Next-token probabilities" fill={C.gBg} stroke={C.gBd} labelSize={9} />

      {/* Residual arrows */}
      <path d="M360,181 Q378,181 378,144 Q378,108 360,108" fill="none" stroke={C.mFg} strokeWidth={1} strokeDasharray="3,2" />
      <T x={385} y={144} fill={C.mFg} size={8} anchor="start">residual</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. ATTENTION MECHANISM
═══════════════════════════════════════════════════════════════════════════ */
export function AttentionDiagram() {
  return (
    <Frame vb="0 0 500 220" caption="Scaled dot-product attention: queries and keys compute compatibility scores; values are retrieved proportionally." h={200}>
      {/* Inputs */}
      {[["Q", 60, C.pBg, C.pBd, C.primary], ["K", 60, C.tBg, C.tBd, C.teal], ["V", 60, C.gBg, C.gBd, C.green]].map(([label, w, bg, bd, fg], i) => (
        <g key={String(label)}>
          <Rect x={20} y={40 + i * 55} w={Number(w)} h={38} fill={String(bg)} stroke={String(bd)} />
          <T x={50} y={59 + i * 55} fill={String(fg)} bold size={14} mono>{String(label)}</T>
        </g>
      ))}

      {/* Q, K → MatMul */}
      <Arrow x1={80} y1={60} x2={128} y2={60} id="a1" color={C.primary} />
      <Arrow x1={80} y1={115} x2={128} y2={75} id="a2" color={C.teal} />
      <Box x={130} y={48} w={80} h={38} label="MatMul" sub="Q · Kᵀ" fill={C.muted} labelSize={10} subSize={8} />

      {/* → Scale */}
      <Arrow x1={210} y1={67} x2={238} y2={67} id="a3" />
      <Box x={240} y={48} w={65} h={38} label="Scale" sub="÷ √d_k" fill={C.muted} labelSize={10} subSize={8} />

      {/* → Softmax */}
      <Arrow x1={305} y1={67} x2={333} y2={67} id="a4" />
      <Box x={335} y={48} w={70} h={38} label="Softmax" fill={C.oBg} stroke={C.orange} labelSize={10} />

      {/* V → MatMul2 */}
      <Arrow x1={405} y1={67} x2={430} y2={100} id="a5" color={C.orange} />
      <Arrow x1={80} y1={170} x2={428} y2={120} id="a6" color={C.green} />
      <Box x={430} y={100} w={55} h={38} label="MatMul" fill={C.muted} labelSize={9} />

      {/* Output */}
      <Arrow x1={457} y1={138} x2={457} y2={160} id="a7" color={C.primary} />
      <Box x={420} y={162} w={65} h={30} label="Output" fill={C.pBg} stroke={C.pBd} labelSize={10} />

      {/* Formula */}
      <rect x={20} y={195} width={460} height={18} rx={3} style={{ fill: C.muted, stroke: C.border }} strokeWidth={0.5} />
      <T x={250} y={204} fill={C.mFg} size={10} mono>Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. DIFFUSION MODEL
═══════════════════════════════════════════════════════════════════════════ */
export function DiffusionDiagram() {
  const steps = [
    { label: "x₀", noise: 0,   name: "Clean" },
    { label: "x_t/4", noise: 25,  name: "" },
    { label: "x_t/2", noise: 55,  name: "" },
    { label: "x_3t/4", noise: 80, name: "" },
    { label: "x_T", noise: 100, name: "Noise" },
  ];
  const bw = 68, bh = 68, gap = 22;

  return (
    <Frame vb="0 0 500 195" caption="Forward process (q) adds Gaussian noise step-by-step. The model learns the reverse process (p_θ) to denoise." h={175}>
      {steps.map((s, i) => {
        const x = 10 + i * (bw + gap);
        const noiseLevel = s.noise / 100;
        return (
          <g key={i}>
            {/* Box with noise overlay */}
            <Rect x={x} y={30} w={bw} h={bh} fill={C.tBg} stroke={C.tBd} rx={6} />
            {/* Simulate noise with opacity overlay */}
            <rect x={x} y={30} width={bw} height={bh} rx={6}
              style={{ fill: C.muted }} opacity={noiseLevel * 0.85} />
            {/* Noise label inside */}
            {i === 0 && (
              <>
                <rect x={x + 12} y={44} width={10} height={10} rx={2} style={{ fill: C.teal }} opacity={0.7} />
                <rect x={x + 28} y={52} width={12} height={8} rx={2} style={{ fill: C.teal }} opacity={0.6} />
                <rect x={x + 44} y={42} width={9} height={14} rx={2} style={{ fill: C.teal }} opacity={0.7} />
              </>
            )}
            {i === 4 && (
              <T x={x + bw / 2} y={64} fill={C.mFg} size={10}>pure noise</T>
            )}
            <T x={x + bw / 2} y={108} fill={C.mFg} size={9} mono>{s.label}</T>
            {s.name && <T x={x + bw / 2} y={122} fill={C.mFg} size={8}>{s.name}</T>}
          </g>
        );
      })}

      {/* Forward arrows (top) */}
      {[0,1,2,3].map(i => (
        <Arrow key={`fa${i}`}
          x1={10 + i * (bw + gap) + bw + 3} y1={44}
          x2={10 + (i+1) * (bw + gap) - 3}  y2={44}
          id={`df${i}`} color={C.teal} />
      ))}

      {/* Reverse arrows (bottom) */}
      {[3,2,1,0].map(i => (
        <Arrow key={`ra${i}`}
          x1={10 + (i+1) * (bw + gap) - 3} y1={82}
          x2={10 + i * (bw + gap) + bw + 3}  y2={82}
          id={`dr${i}`} color={C.primary} />
      ))}

      {/* Labels for arrows */}
      <T x={250} y={35} fill={C.teal} size={9}>{"q(x_t | x_{t-1}) — add Gaussian noise"}</T>
      <T x={250} y={95} fill={C.primary} size={9}>{"p_θ(x_{t-1} | x_t) — learned denoising"}</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. GAN
═══════════════════════════════════════════════════════════════════════════ */
export function GANDiagram() {
  return (
    <Frame vb="0 0 500 190" caption="GANs: Generator creates fakes to fool the Discriminator; Discriminator learns to detect fakes, pushing both to improve." h={170}>
      {/* Noise input */}
      <Rect x={10} y={55} w={55} h={40} fill={C.muted} />
      <T x={37} y={70} fill={C.mFg} size={9}>Latent</T>
      <T x={37} y={82} fill={C.mFg} size={9} mono>z ~ N(0,I)</T>
      <Arrow x1={65} y1={75} x2={95} y2={75} id="g1" />

      {/* Generator */}
      <Box x={95} y={52} w={90} h={45} label="Generator" sub="G(z)" fill={C.pBg} stroke={C.pBd} />
      <Arrow x1={185} y1={75} x2={215} y2={75} id="g2" color={C.primary} />

      {/* Fake samples */}
      <Rect x={215} y={58} w={55} h={34} fill={C.oBg} stroke={C.orange} rx={4} />
      <T x={242} y={72} fill={C.orange} size={9}>Fake</T>
      <T x={242} y={84} fill={C.orange} size={8}>samples</T>
      <Arrow x1={270} y1={75} x2={300} y2={75} id="g3" color={C.orange} />

      {/* Real samples */}
      <Rect x={215} y={110} w={55} h={34} fill={C.gBg} stroke={C.gBd} rx={4} />
      <T x={242} y={124} fill={C.green} size={9}>Real</T>
      <T x={242} y={136} fill={C.green} size={8}>samples</T>
      <Arrow x1={270} y1={127} x2={300} y2={107} id="g4" color={C.green} />

      {/* Discriminator */}
      <Box x={300} y={60} w={90} h={56} label="Discriminator" sub="D(x)" fill={C.tBg} stroke={C.tBd} />

      {/* Output */}
      <Arrow x1={390} y1={88} x2={420} y2={88} id="g5" color={C.teal} />
      <Rect x={420} y={70} w={65} h={36} fill={C.muted} />
      <T x={452} y={82} fill={C.fg} size={9} bold>Real?</T>
      <T x={452} y={96} fill={C.mFg} size={9}>[0,1]</T>

      {/* Gradient feedback */}
      <path d="M 452,107 Q 452,158 345,158 Q 140,158 140,97" fill="none" stroke={C.primary}
        strokeWidth={1.2} strokeDasharray="4,3" />
      <T x={290} y={170} fill={C.primary} size={9}>∇ update G to maximize D(G(z))</T>
      <path d="M 452,107 Q 452,168 345,168" fill="none" stroke={C.teal}
        strokeWidth={1.2} strokeDasharray="4,3" />
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. VAE
═══════════════════════════════════════════════════════════════════════════ */
export function VAEDiagram() {
  return (
    <Frame vb="0 0 500 185" caption="VAE: Encoder outputs a distribution q(z|x); a sample z is drawn via reparameterization and decoded to reconstruct x." h={165}>
      {/* Input */}
      <Rect x={10} y={50} w={50} h={60} fill={C.muted} />
      <T x={35} y={77} fill={C.mFg} size={10} bold>x</T>
      <T x={35} y={93} fill={C.mFg} size={8}>input</T>
      <Arrow x1={60} y1={80} x2={88} y2={80} id="v1" />

      {/* Encoder */}
      <Box x={90} y={50} w={85} h={60} label="Encoder" sub="q_φ(z|x)" fill={C.pBg} stroke={C.pBd} />
      <Arrow x1={175} y1={68} x2={215} y2={55} id="v2" color={C.primary} />
      <Arrow x1={175} y1={92} x2={215} y2={105} id="v3" color={C.primary} />

      {/* μ, σ */}
      <Rect x={215} y={40} w={55} h={28} fill={C.pBg} stroke={C.pBd} />
      <T x={242} y={54} fill={C.primary} size={11} mono>μ</T>
      <Rect x={215} y={92} w={55} h={28} fill={C.pBg} stroke={C.pBd} />
      <T x={242} y={106} fill={C.primary} size={11} mono>σ</T>

      {/* Reparameterization */}
      <Arrow x1={270} y1={54} x2={300} y2={72} id="v4" color={C.orange} />
      <Arrow x1={270} y1={106} x2={300} y2={92} id="v5" color={C.orange} />
      <Rect x={300} y={60} w={72} h={40} fill={C.oBg} stroke={C.orange} />
      <T x={336} y={76} fill={C.orange} size={9}>z = μ + σε</T>
      <T x={336} y={90} fill={C.orange} size={8}>ε ~ N(0,I)</T>

      <Arrow x1={372} y1={80} x2={400} y2={80} id="v6" color={C.orange} />

      {/* Decoder */}
      <Box x={400} y={50} w={80} h={60} label="Decoder" sub="p_θ(x|z)" fill={C.tBg} stroke={C.tBd} />

      {/* Output */}
      <Arrow x1={480} y1={80} x2={490} y2={80} id="v7" color={C.teal} />

      {/* ELBO label */}
      <rect x={10} y={130} width={475} height={20} rx={4} style={{ fill: C.muted, stroke: C.border }} strokeWidth={0.5} />
      <T x={250} y={140} fill={C.mFg} size={9.5} mono>
        ELBO = 𝔼[log p_θ(x|z)] − KL(q_φ(z|x) ‖ p(z))
      </T>
      <T x={170} y={155} fill={C.green} size={8.5}>↑ reconstruction accuracy</T>
      <T x={370} y={155} fill={C.red} size={8.5}>↑ stay close to prior</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. RLHF PIPELINE
═══════════════════════════════════════════════════════════════════════════ */
export function RLHFDiagram() {
  return (
    <Frame vb="0 0 500 215" caption="RLHF trains in three stages: supervised fine-tuning → reward model from human preferences → PPO reinforcement learning." h={195}>
      {/* Phase labels */}
      {[["Phase 1", 55], ["Phase 2", 205], ["Phase 3", 355]].map(([lbl, x]) => (
        <T key={String(lbl)} x={Number(x)} y={12} fill={C.mFg} size={9}>{String(lbl)}</T>
      ))}

      {/* Phase 1: SFT */}
      <Box x={10} y={22} w={90} h={34} label="Pretrained" sub="Language Model" fill={C.muted} labelSize={9} subSize={8} />
      <T x={55} y={72} fill={C.mFg} size={8}>human demos</T>
      <Arrow x1={55} y1={57} x2={55} y2={82} id="r1" />
      <Box x={10} y={84} w={90} h={34} label="SFT Model" fill={C.pBg} stroke={C.pBd} labelSize={10} />

      {/* Separator */}
      <line x1={112} y1={18} x2={112} y2={165} stroke={C.border} strokeWidth={0.7} strokeDasharray="3,3" />

      {/* Phase 2: Reward Model */}
      <Box x={120} y={22} w={90} h={34} label="SFT Model" fill={C.pBg} stroke={C.pBd} labelSize={9} />
      <Arrow x1={165} y1={57} x2={165} y2={67} id="r2" />
      <Rect x={125} y={68} w={80} h={20} fill={C.oBg} stroke={C.orange} rx={3} />
      <T x={165} y={78} fill={C.orange} size={8}>rank responses (human)</T>
      <Arrow x1={165} y1={89} x2={165} y2={97} id="r3" />
      <Box x={120} y={98} w={90} h={34} label="Reward Model" fill={C.oBg} stroke={C.orange} labelSize={9} />

      {/* Separator */}
      <line x1={222} y1={18} x2={222} y2={165} stroke={C.border} strokeWidth={0.7} strokeDasharray="3,3" />

      {/* Phase 3: PPO */}
      <Box x={232} y={22} w={90} h={34} label="SFT Model" sub="initial policy" fill={C.pBg} stroke={C.pBd} labelSize={9} subSize={8} />
      <Box x={232} y={65} w={90} h={34} label="Reward Model" sub="R(prompt, output)" fill={C.oBg} stroke={C.orange} labelSize={9} subSize={8} />
      <Arrow x1={277} y1={57} x2={277} y2={64} id="r4" />
      <Arrow x1={277} y1={100} x2={277} y2={108} id="r5" />

      {/* PPO box */}
      <rect x={232} y={109} width={90} height={24} rx={4}
        style={{ fill: C.rBg, stroke: C.rBd }} strokeWidth={1} />
      <T x={277} y={121} fill={C.red} size={9}>PPO update</T>
      <Arrow x1={277} y1={133} x2={277} y2={141} id="r6" />
      <Box x={232} y={142} w={90} h={28} label="RLHF Policy" fill={C.gBg} stroke={C.gBd} labelSize={10} />

      {/* KL penalty note */}
      <rect x={335} y={85} width={155} height={55} rx={6}
        style={{ fill: C.muted, stroke: C.border }} strokeWidth={0.7} />
      <T x={412} y={100} fill={C.mFg} size={8.5} bold>PPO objective:</T>
      <T x={412} y={114} fill={C.mFg} size={8} mono>max E[R(x,y)]</T>
      <T x={412} y={128} fill={C.mFg} size={8} mono>  − β KL(π_RL ‖ π_SFT)</T>

      {/* Overall flow arrow */}
      <T x={250} y={185} fill={C.mFg} size={9}>Human feedback shapes reward signal → RL aligns model with human preferences</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. RAG PIPELINE
═══════════════════════════════════════════════════════════════════════════ */
export function RAGDiagram() {
  const steps = [
    { label: "User Query",    sub: '"What is LoRA?"',   fill: C.muted,    bd: C.border,  w: 80 },
    { label: "Embed",         sub: "text → vector",    fill: C.pBg,      bd: C.pBd,     w: 65 },
    { label: "Vector Store",  sub: "ANN search",       fill: C.tBg,      bd: C.tBd,     w: 80 },
    { label: "Top-K Chunks",  sub: "retrieved docs",   fill: C.oBg,      bd: C.orange,  w: 80 },
    { label: "LLM",           sub: "query + context",  fill: C.pBg,      bd: C.pBd,     w: 65 },
    { label: "Response",      sub: "grounded answer",  fill: C.gBg,      bd: C.gBd,     w: 80 },
  ];

  let x = 5;
  const positions: number[] = [];
  steps.forEach(s => { positions.push(x); x += s.w + 18; });

  return (
    <Frame vb="0 0 520 140" caption="RAG retrieves relevant passages from an external knowledge base and injects them into the LLM context before generation." h={120}>
      {steps.map((s, i) => (
        <g key={i}>
          <Box x={positions[i]} y={25} w={s.w} h={55} label={s.label} sub={s.sub}
            fill={s.fill} stroke={s.bd} labelSize={9.5} subSize={8} />
          {i < steps.length - 1 && (
            <Arrow
              x1={positions[i] + s.w + 1} y1={52}
              x2={positions[i + 1] - 1}    y2={52}
              id={`rag${i}`} color={C.mFg} />
          )}
        </g>
      ))}
      {/* Highlight the "augmentation" step */}
      <rect x={positions[3] - 2} y={23} width={steps[3].w + 4} height={59} rx={6}
        style={{ fill: "none", stroke: C.orange }} strokeWidth={1.5} strokeDasharray="4,2" />
      <T x={250} y={105} fill={C.mFg} size={8.5}>
        Knowledge source stays external — no retraining needed when facts change
      </T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. LoRA DIAGRAM
═══════════════════════════════════════════════════════════════════════════ */
export function LoRADiagram() {
  return (
    <Frame vb="0 0 500 200" caption="LoRA: freeze the full weight matrix W₀; inject trainable low-rank matrices A (r×d) and B (d×r) alongside it. r ≪ d." h={180}>
      {/* Input */}
      <Rect x={10} y={80} w={45} h={40} fill={C.muted} />
      <T x={32} y={100} fill={C.fg} mono bold size={13}>x</T>
      <Arrow x1={55} y1={90} x2={80} y2={70} id="l1" />
      <Arrow x1={55} y1={110} x2={80} y2={130} id="l2" />

      {/* Frozen W₀ path (top) */}
      <rect x={82} y={48} width={140} height={44} rx={5}
        style={{ fill: C.muted, stroke: C.border }} strokeWidth={1} />
      <T x={152} y={62} fill={C.mFg} size={10} bold>W₀  (frozen)</T>
      <T x={152} y={78} fill={C.mFg} size={9}>{`d × d   (millions of params)`}</T>
      {/* Lock icon */}
      <T x={198} y={56} fill={C.mFg} size={13}>🔒</T>

      <Arrow x1={222} y1={70} x2={305} y2={90} id="l3" color={C.mFg} />

      {/* LoRA path (bottom) */}
      {/* A matrix */}
      <rect x={82} y={108} width={60} height={44} rx={5}
        style={{ fill: C.pBg, stroke: C.pBd }} strokeWidth={1.5} />
      <T x={112} y={124} fill={C.primary} size={10} bold mono>A</T>
      <T x={112} y={138} fill={C.primary} size={8.5}>r × d</T>

      <Arrow x1={142} y1={130} x2={162} y2={130} id="l4" color={C.primary} />

      {/* B matrix */}
      <rect x={162} y={108} width={60} height={44} rx={5}
        style={{ fill: C.pBg, stroke: C.pBd }} strokeWidth={1.5} />
      <T x={192} y={124} fill={C.primary} size={10} bold mono>B</T>
      <T x={192} y={138} fill={C.primary} size={8.5}>d × r</T>
      <T x={227} y={157} fill={C.primary} size={8}>r ≪ d  (e.g. r=8)</T>

      <Arrow x1={222} y1={130} x2={305} y2={110} id="l5" color={C.primary} />

      {/* Add */}
      <circle cx={315} cy={100} r={16} style={{ fill: C.muted, stroke: C.border }} strokeWidth={1.5} />
      <T x={315} y={100} fill={C.fg} size={16} bold>+</T>
      <Arrow x1={331} y1={100} x2={358} y2={100} id="l6" />

      {/* Output */}
      <Rect x={358} y={80} w={60} h={40} fill={C.gBg} stroke={C.gBd} />
      <T x={388} y={96} fill={C.green} size={10} bold mono>h</T>
      <T x={388} y={110} fill={C.green} size={8}>output</T>

      {/* Formula */}
      <rect x={10} y={165} width={475} height={18} rx={3} style={{ fill: C.muted, stroke: C.border }} strokeWidth={0.5} />
      <T x={250} y={174} fill={C.mFg} size={9.5} mono>h = W₀x  +  (α/r) · BAx   — only A and B are trained</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. SAMPLING TEMPERATURE
═══════════════════════════════════════════════════════════════════════════ */
export function TemperatureDiagram() {
  // logits for tokens ["the", "a", "an", "cat"]
  const logits = [5, 2.5, 1.5, 0.5];
  const temps = [0.1, 1.0, 2.0];
  const tokens = ["the", "a", "an", "cat"];
  const colors = [C.primary, C.teal, C.green, C.orange];

  function softmax(logits: number[], T: number) {
    const scaled = logits.map(l => l / T);
    const max = Math.max(...scaled);
    const exp = scaled.map(l => Math.exp(l - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(e => e / sum);
  }

  const maxBarH = 110;

  return (
    <Frame vb="0 0 500 205" caption="Temperature τ controls output randomness: low τ concentrates probability on top tokens (conservative), high τ spreads it (creative)." h={185}>
      {temps.map((τ, gi) => {
        const probs = softmax(logits, τ);
        const gx = 20 + gi * 160;
        const bw = 26, bgap = 6;
        return (
          <g key={gi}>
            <T x={gx + 52} y={12} fill={C.fg} size={10} bold>τ = {τ}</T>
            {probs.map((p, bi) => {
              const barH = Math.max(p * maxBarH * (τ === 0.1 ? 1 : τ === 1 ? 1 : 1), 2);
              const bx = gx + bi * (bw + bgap);
              const by = 130 - barH;
              return (
                <g key={bi}>
                  <rect x={bx} y={by} width={bw} height={barH} rx={2}
                    style={{ fill: colors[bi] }} opacity={0.75} />
                  <T x={bx + bw / 2} y={145} fill={C.mFg} size={8} mono>{tokens[bi]}</T>
                  {barH > 18 && (
                    <T x={bx + bw / 2} y={by + 10} fill={C.bg} size={7.5} mono>
                      {(p * 100).toFixed(0)}%
                    </T>
                  )}
                </g>
              );
            })}
            {/* Baseline */}
            <line x1={gx - 3} y1={130} x2={gx + 130} y2={130} stroke={C.border} strokeWidth={0.8} />
          </g>
        );
      })}
      <T x={250} y={175} fill={C.mFg} size={9}>Token probabilities for the same logits at three temperature values</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. TOKENIZATION
═══════════════════════════════════════════════════════════════════════════ */
export function TokenizationDiagram() {
  const tokens = [
    { text: "Chat", id: 15339, color: C.primary,  bg: C.pBg, bd: C.pBd  },
    { text: "G",    id: 38,    color: C.teal,     bg: C.tBg, bd: C.tBd  },
    { text: "PT",   id: 2898,  color: C.teal,     bg: C.tBg, bd: C.tBd  },
    { text: " is",  id: 318,   color: C.green,    bg: C.gBg, bd: C.gBd  },
    { text: " gen", id: 2217,  color: C.orange,   bg: C.oBg, bd: C.orange },
    { text: "ius",  id: 3754,  color: C.orange,   bg: C.oBg, bd: C.orange },
    { text: "!",    id: 0,     color: C.mFg,      bg: C.muted, bd: C.border },
  ];

  let x = 15;
  const positions: number[] = [];
  const widths: number[] = [];
  tokens.forEach(t => {
    const w = Math.max(t.text.length * 11 + 14, 26);
    positions.push(x);
    widths.push(w);
    x += w + 5;
  });

  return (
    <Frame vb="0 0 500 145" caption="BPE tokenization splits text into subword pieces. Note: 'ChatGPT' becomes 3 tokens; spaces are part of the following token." h={125}>
      {/* Raw text */}
      <T x={250} y={18} fill={C.fg} size={11} mono anchor="middle">"ChatGPT is genius!"</T>
      <line x1={20} y1={28} x2={480} y2={28} stroke={C.border} strokeWidth={0.7} />

      {/* Token boxes */}
      {tokens.map((t, i) => (
        <g key={i}>
          <rect x={positions[i]} y={38} width={widths[i]} height={34} rx={4}
            style={{ fill: t.bg, stroke: t.bd }} strokeWidth={1.5} />
          <T x={positions[i] + widths[i] / 2} y={55} fill={t.color} size={10} mono>{t.text}</T>
          <T x={positions[i] + widths[i] / 2} y={88} fill={C.mFg} size={8.5} mono>{t.id}</T>
        </g>
      ))}
      <T x={250} y={105} fill={C.mFg} size={8.5}>Token IDs (vocabulary indices)</T>
      <T x={250} y={118} fill={C.mFg} size={8.5}>Same color = merged into same word by BPE</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. SCALING LAWS
═══════════════════════════════════════════════════════════════════════════ */
export function ScalingDiagram() {
  // Chart area: x 50-450, y 20-160
  const cx = { l: 55, r: 450, t: 15, b: 155 };
  const W = cx.r - cx.l, H = cx.b - cx.t;

  // Power-law loss curve: loss ≈ C^{-0.05} in log space → linear
  // Map log(compute) x in [0,1] to y (loss)
  function lossY(t: number) { return cx.t + H * (1 - Math.pow(t, 0.45) * 0.95); }
  function svgX(t: number) { return cx.l + W * t; }

  const pts = Array.from({ length: 20 }, (_, i) => {
    const t = (i + 0.5) / 20;
    return `${svgX(t)},${lossY(t)}`;
  });

  const milestones = [
    { t: 0.18, label: "GPT-2\n(1.5B)", name: "GPT-2" },
    { t: 0.42, label: "GPT-3\n(175B)", name: "GPT-3" },
    { t: 0.60, label: "Chinchilla\n(70B)", name: "Chinchilla" },
    { t: 0.80, label: "GPT-4\n(~1T)", name: "GPT-4" },
  ];

  return (
    <Frame vb="0 0 500 195" caption="Neural scaling laws (Kaplan et al., Hoffmann et al.): test loss decreases predictably as a power law of compute, parameters, and data." h={175}>
      {/* Axes */}
      <line x1={cx.l} y1={cx.t} x2={cx.l} y2={cx.b} stroke={C.border} strokeWidth={1.2} />
      <line x1={cx.l} y1={cx.b} x2={cx.r} y2={cx.b} stroke={C.border} strokeWidth={1.2} />

      {/* Axis labels */}
      <T x={cx.l + W / 2} y={cx.b + 14} fill={C.mFg} size={9}>Training Compute (log scale, FLOPs →)</T>
      <text x={cx.l - 12} y={cx.t + H / 2} textAnchor="middle" fontSize={9}
        style={{ fill: C.mFg, fontFamily: C.sans }}
        transform={`rotate(-90, ${cx.l - 12}, ${cx.t + H / 2})`}>
        ← Test Loss
      </text>

      {/* Loss curve */}
      <polyline points={pts.join(" ")} fill="none" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round" />

      {/* Shaded area under curve */}
      <polyline
        points={`${svgX(0)},${cx.b} ${pts.join(" ")} ${svgX(1)},${cx.b}`}
        style={{ fill: C.pBg }} />

      {/* Milestone points */}
      {milestones.map((m, i) => {
        const px = svgX(m.t), py = lossY(m.t);
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={5} style={{ fill: C.bg, stroke: C.primary }} strokeWidth={2} />
            <line x1={px} y1={py - 6} x2={px} y2={py - 30} stroke={C.border} strokeWidth={0.8} strokeDasharray="2,2" />
            <T x={px} y={py - 36} fill={C.fg} size={8.5} bold>{m.name}</T>
          </g>
        );
      })}

      {/* Power law annotation */}
      <T x={390} y={50} fill={C.primary} size={9} bold anchor="end">Loss ∝ C^{"{-0.050}"}</T>
      <T x={390} y={63} fill={C.mFg} size={8.5} anchor="end">(Kaplan et al., 2020)</T>

      {/* Chinchilla annotation */}
      <rect x={300} y={75} width={145} height={35} rx={4}
        style={{ fill: C.oBg, stroke: C.orange }} strokeWidth={0.8} />
      <T x={372} y={87} fill={C.orange} size={8.5} bold>Chinchilla law</T>
      <T x={372} y={100} fill={C.orange} size={8}>N_opt ≈ 20× tokens/param</T>
    </Frame>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Registry: maps "slug:sectionIndex" → diagram element
═══════════════════════════════════════════════════════════════════════════ */
export const diagramRegistry: Record<string, ReactNode> = {
  "neural-networks-basics:0":  <NeuralNetDiagram />,
  "transformers:0":             <TransformerDiagram />,
  "attention-mechanism:0":      <AttentionDiagram />,
  "diffusion-models:0":         <DiffusionDiagram />,
  "gans:0":                     <GANDiagram />,
  "vaes:0":                     <VAEDiagram />,
  "rlhf:0":                     <RLHFDiagram />,
  "rag:0":                      <RAGDiagram />,
  "lora:0":                     <LoRADiagram />,
  "sampling-strategies:0":      <TemperatureDiagram />,
  "tokenization:0":             <TokenizationDiagram />,
  "scaling-laws:0":             <ScalingDiagram />,
};
