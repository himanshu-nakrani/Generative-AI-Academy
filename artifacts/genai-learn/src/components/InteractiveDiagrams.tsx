"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/* ══════════════════════════════════════════════════════════════════════════
   SOFTMAX TEMPERATURE EXPLORER
   Shows how temperature affects probability distribution
══════════════════════════════════════════════════════════════════════════ */

function softmax(logits: number[], temperature: number): number[] {
  const scaled = logits.map((l) => l / temperature);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function SoftmaxTemperature() {
  const [temperature, setTemperature] = useState(1.0);
  const logits = [2.5, 1.8, 1.2, 0.5, 0.1, -0.3];
  const tokens = ["the", "a", "this", "that", "an", "some"];

  const probs = softmax(logits, temperature);
  const chartData = tokens.map((token, i) => ({
    token,
    probability: Math.round(probs[i] * 1000) / 10,
    logit: logits[i],
  }));

  const entropy = -probs.reduce(
    (sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0),
    0
  );

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Softmax Temperature Effect
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Temperature:</span>
            <span className="text-sm font-mono font-semibold text-primary w-12">
              {temperature.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <Slider
            value={[temperature]}
            onValueChange={(v) => setTemperature(v[0])}
            min={0.1}
            max={3.0}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0.1 (deterministic)</span>
            <span>1.0 (balanced)</span>
            <span>3.0 (random)</span>
          </div>
        </div>

        <ChartContainer
          config={{
            probability: { label: "Probability %", color: "hsl(var(--primary))" },
          }}
          className="h-[200px] w-full"
        >
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis
              type="category"
              dataKey="token"
              width={50}
              tick={{ fontSize: 12, fontFamily: "var(--app-font-mono)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Entropy:</span>
            <span className="ml-2 font-mono font-semibold">{entropy.toFixed(2)} bits</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Top token:</span>
            <span className="ml-2 font-mono font-semibold">
              {chartData[0].probability.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Lower temperature concentrates probability on the most likely token; higher
        temperature flattens the distribution toward uniform randomness.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GRADIENT DESCENT VISUALIZATION
   Animated optimization on a 2D loss surface
══════════════════════════════════════════════════════════════════════════ */

function rosenbrock(x: number, y: number): number {
  return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
}

function rosenbrockGrad(x: number, y: number): [number, number] {
  const dx = -2 * (1 - x) - 400 * x * (y - x * x);
  const dy = 200 * (y - x * x);
  return [dx, dy];
}

export function GradientDescentViz() {
  const [learningRate, setLearningRate] = useState(0.001);
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState<{ x: number; y: number; loss: number }[]>([
    { x: -1.5, y: 1.5, loss: rosenbrock(-1.5, 1.5) },
  ]);
  const animationRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    stepCountRef.current = 0;
    setPath([{ x: -1.5, y: 1.5, loss: rosenbrock(-1.5, 1.5) }]);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const step = () => {
      setPath((prev) => {
        const last = prev[prev.length - 1];
        const [dx, dy] = rosenbrockGrad(last.x, last.y);
        const newX = last.x - learningRate * dx;
        const newY = last.y - learningRate * dy;
        const newLoss = rosenbrock(newX, newY);

        // Stop if converged or diverged
        if (
          newLoss > 1e10 ||
          (Math.abs(newX - last.x) < 1e-6 && Math.abs(newY - last.y) < 1e-6) ||
          prev.length > 500
        ) {
          setIsRunning(false);
          return prev;
        }

        stepCountRef.current++;
        return [...prev, { x: newX, y: newY, loss: newLoss }];
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, learningRate]);

  const currentPoint = path[path.length - 1];
  const diverged = currentPoint.loss > 1e6;
  const converged = currentPoint.loss < 0.01;

  // Generate contour grid data for visualization
  const gridSize = 30;
  const contourData = useMemo(() => {
    const data: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = -2 + (i / (gridSize - 1)) * 4;
        const y = -1 + (j / (gridSize - 1)) * 4;
        data.push({ x, y, z: Math.log10(rosenbrock(x, y) + 1) });
      }
    }
    return data;
  }, []);

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Gradient Descent Optimization
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRunning(!isRunning)}
              disabled={diverged || converged}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Learning Rate:</span>
            <span className="text-sm font-mono font-semibold text-primary">
              {learningRate.toFixed(4)}
            </span>
          </div>
          <Slider
            value={[learningRate]}
            onValueChange={(v) => {
              setLearningRate(v[0]);
              reset();
            }}
            min={0.0001}
            max={0.01}
            step={0.0001}
            className="w-full"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0.0001 (slow)</span>
            <span>0.01 (fast/unstable)</span>
          </div>
        </div>

        <div className="relative h-[250px] bg-muted/30 rounded-lg overflow-hidden">
          <svg viewBox="-2 -1 4 4" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Contour background (simplified) */}
            <defs>
              <radialGradient id="contour-grad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="100%" stopColor="hsl(var(--muted))" />
              </radialGradient>
            </defs>
            <rect x="-2" y="-1" width="4" height="4" fill="url(#contour-grad)" />
            
            {/* Optimal point marker */}
            <circle cx="1" cy="1" r="0.08" fill="hsl(142, 42%, 38%)" opacity="0.8" />
            <text x="1" y="0.85" textAnchor="middle" fontSize="0.12" fill="hsl(142, 42%, 38%)">
              optimum
            </text>

            {/* Optimization path */}
            {path.length > 1 && (
              <polyline
                points={path.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.03"
                opacity="0.8"
              />
            )}

            {/* Path points */}
            {path.slice(-50).map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="0.04"
                fill="hsl(var(--primary))"
                opacity={0.3 + (i / 50) * 0.7}
              />
            ))}

            {/* Current point */}
            <circle
              cx={currentPoint.x}
              cy={currentPoint.y}
              r="0.08"
              fill={diverged ? "hsl(0, 60%, 50%)" : "hsl(var(--primary))"}
              stroke="white"
              strokeWidth="0.02"
            />
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Steps</div>
            <div className="font-mono font-semibold">{path.length - 1}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Loss</div>
            <div className="font-mono font-semibold">
              {currentPoint.loss < 1000
                ? currentPoint.loss.toFixed(2)
                : currentPoint.loss.toExponential(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <div
              className={`font-semibold ${
                converged
                  ? "text-green-600"
                  : diverged
                  ? "text-red-500"
                  : "text-primary"
              }`}
            >
              {converged ? "Converged" : diverged ? "Diverged" : "Running"}
            </div>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Visualizing gradient descent on the Rosenbrock function. Too high a learning
        rate causes divergence; too low is slow. The green dot marks the global minimum at (1, 1).
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TOKENIZER PLAYGROUND
   Live BPE tokenization demo
══════════════════════════════════════════════════════════════════════════ */

// Simplified BPE-style tokenization (demonstration only)
const VOCAB: Record<string, number> = {
  "the": 100, "ing": 101, "tion": 102, "er": 103, "ed": 104, "es": 105,
  "en": 106, "al": 107, "re": 108, "on": 109, "an": 110, "is": 111,
  "it": 112, "at": 113, "or": 114, "as": 115, "in": 116, "to": 117,
  "of": 118, "and": 119, " ": 120, ".": 121, ",": 122, "!": 123, "?": 124,
  "a": 125, "b": 126, "c": 127, "d": 128, "e": 129, "f": 130, "g": 131,
  "h": 132, "i": 133, "j": 134, "k": 135, "l": 136, "m": 137, "n": 138,
  "o": 139, "p": 140, "q": 141, "r": 142, "s": 143, "t": 144, "u": 145,
  "v": 146, "w": 147, "x": 148, "y": 149, "z": 150, "'": 151,
};

function simpleTokenize(text: string): { token: string; id: number }[] {
  const tokens: { token: string; id: number }[] = [];
  let i = 0;
  const lower = text.toLowerCase();

  while (i < lower.length) {
    let matched = false;
    // Try longest match first (up to 4 chars)
    for (let len = Math.min(4, lower.length - i); len >= 1; len--) {
      const substr = lower.slice(i, i + len);
      if (VOCAB[substr] !== undefined) {
        tokens.push({ token: text.slice(i, i + len), id: VOCAB[substr] });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Unknown character - use UNK token
      tokens.push({ token: text[i], id: 0 });
      i++;
    }
  }
  return tokens;
}

const TOKEN_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
];

export function TokenizerPlayground() {
  const [text, setText] = useState("The quick brown fox jumps!");
  const tokens = simpleTokenize(text);

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Tokenizer Playground
        </h3>

        <div className="mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text to tokenize..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            maxLength={100}
          />
        </div>

        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2">Tokens ({tokens.length}):</div>
          <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 rounded-lg bg-muted/30">
            {tokens.map((t, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                  TOKEN_COLORS[i % TOKEN_COLORS.length]
                }`}
              >
                <span>{t.token === " " ? "▁" : t.token}</span>
                <span className="opacity-60 text-[10px]">{t.id}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Characters:</span>
            <span className="ml-2 font-mono font-semibold">{text.length}</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">Compression:</span>
            <span className="ml-2 font-mono font-semibold">
              {tokens.length > 0 ? (text.length / tokens.length).toFixed(2) : "0"}x
            </span>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Simplified BPE tokenization demo. Real tokenizers like GPT use 50K+ subword tokens
        learned from training data. Common words stay whole; rare words split into pieces.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ATTENTION HEATMAP
   Visualize self-attention weights between tokens
══════════════════════════════════════════════════════════════════════════ */

// Pre-computed attention weights for demo sentence
const DEMO_SENTENCE = ["The", "cat", "sat", "on", "the", "mat"];
const DEMO_ATTENTION = [
  [0.5, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.2, 0.4, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.3, 0.3, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.2, 0.3, 0.2, 0.1],
  [0.3, 0.1, 0.1, 0.1, 0.3, 0.1],
  [0.1, 0.1, 0.1, 0.2, 0.2, 0.3],
];

export function AttentionHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number } | null>(null);
  const [selectedHead, setSelectedHead] = useState(0);

  // Simulate different attention heads
  const getAttention = (head: number) => {
    if (head === 0) return DEMO_ATTENTION;
    // Shift pattern for different heads
    return DEMO_ATTENTION.map((row, i) =>
      row.map((_, j) => {
        const shift = (i + j + head) % 6;
        return DEMO_ATTENTION[shift][j];
      })
    );
  };

  const attention = getAttention(selectedHead);
  const cellSize = 50;
  const padding = 60;

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Self-Attention Visualization
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Attention Head:</span>
            {[0, 1, 2].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHead(h)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                  selectedHead === h
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {h + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            width={DEMO_SENTENCE.length * cellSize + padding + 20}
            height={DEMO_SENTENCE.length * cellSize + padding + 20}
            className="mx-auto"
          >
            {/* Column labels (keys) */}
            {DEMO_SENTENCE.map((token, j) => (
              <text
                key={`col-${j}`}
                x={padding + j * cellSize + cellSize / 2}
                y={padding - 8}
                textAnchor="middle"
                fontSize="11"
                fill="hsl(var(--muted-foreground))"
                fontFamily="var(--app-font-mono)"
              >
                {token}
              </text>
            ))}

            {/* Row labels (queries) */}
            {DEMO_SENTENCE.map((token, i) => (
              <text
                key={`row-${i}`}
                x={padding - 8}
                y={padding + i * cellSize + cellSize / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="hsl(var(--muted-foreground))"
                fontFamily="var(--app-font-mono)"
              >
                {token}
              </text>
            ))}

            {/* Attention cells */}
            {attention.map((row, i) =>
              row.map((weight, j) => {
                const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={padding + j * cellSize}
                      y={padding + i * cellSize}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      rx={4}
                      fill={`hsl(var(--primary) / ${weight})`}
                      stroke={isHovered ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isHovered ? 2 : 1}
                      onMouseEnter={() => setHoveredCell({ i, j })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x={padding + j * cellSize + cellSize / 2 - 1}
                      y={padding + i * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fill={weight > 0.3 ? "white" : "hsl(var(--foreground))"}
                      fontFamily="var(--app-font-mono)"
                      pointerEvents="none"
                    >
                      {(weight * 100).toFixed(0)}
                    </text>
                  </g>
                );
              })
            )}

            {/* Axis labels */}
            <text
              x={padding + (DEMO_SENTENCE.length * cellSize) / 2}
              y={12}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              Keys (attending to)
            </text>
            <text
              x={10}
              y={padding + (DEMO_SENTENCE.length * cellSize) / 2}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              transform={`rotate(-90, 10, ${padding + (DEMO_SENTENCE.length * cellSize) / 2})`}
            >
              Queries (from)
            </text>
          </svg>
        </div>

        {hoveredCell && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-center">
            <span className="font-mono">"{DEMO_SENTENCE[hoveredCell.i]}"</span>
            <span className="text-muted-foreground mx-2">attends to</span>
            <span className="font-mono">"{DEMO_SENTENCE[hoveredCell.j]}"</span>
            <span className="text-muted-foreground mx-2">with weight</span>
            <span className="font-semibold text-primary">
              {(attention[hoveredCell.i][hoveredCell.j] * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Self-attention weights show how each token attends to others when computing its
        representation. Different attention heads learn different patterns (syntax, semantics, etc.).
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EMBEDDING SPACE VISUALIZATION
   2D projection of word embeddings
══════════════════════════════════════════════════════════════════════════ */

const EMBEDDING_DATA = [
  // Animals
  { word: "cat", x: 2.1, y: 3.2, category: "animal" },
  { word: "dog", x: 2.4, y: 3.5, category: "animal" },
  { word: "bird", x: 1.8, y: 3.8, category: "animal" },
  { word: "fish", x: 1.5, y: 2.9, category: "animal" },
  // Countries
  { word: "France", x: -2.1, y: 1.2, category: "country" },
  { word: "Germany", x: -1.8, y: 1.5, category: "country" },
  { word: "Japan", x: -2.5, y: 0.8, category: "country" },
  { word: "Brazil", x: -1.5, y: 0.5, category: "country" },
  // Professions
  { word: "doctor", x: 0.5, y: -2.1, category: "profession" },
  { word: "teacher", x: 0.8, y: -1.8, category: "profession" },
  { word: "engineer", x: 0.2, y: -2.4, category: "profession" },
  { word: "artist", x: 1.1, y: -1.5, category: "profession" },
  // Emotions
  { word: "happy", x: -0.5, y: -0.5, category: "emotion" },
  { word: "sad", x: -0.8, y: -0.8, category: "emotion" },
  { word: "angry", x: -0.3, y: -1.1, category: "emotion" },
];

const CATEGORY_COLORS: Record<string, string> = {
  animal: "hsl(198, 45%, 38%)",
  country: "hsl(142, 42%, 38%)",
  profession: "hsl(25, 70%, 50%)",
  emotion: "hsl(270, 38%, 52%)",
};

export function EmbeddingSpace() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(EMBEDDING_DATA.map((d) => d.category))];
  const filteredData = selectedCategory
    ? EMBEDDING_DATA.filter((d) => d.category === selectedCategory)
    : EMBEDDING_DATA;

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Word Embedding Space (2D Projection)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] bg-muted/20 rounded-lg relative">
          <svg viewBox="-4 -4 8 8" className="w-full h-full">
            {/* Grid lines */}
            <line x1="-4" y1="0" x2="4" y2="0" stroke="hsl(var(--border))" strokeWidth="0.02" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="hsl(var(--border))" strokeWidth="0.02" />

            {/* Data points */}
            {filteredData.map((point) => {
              const isHovered = hoveredWord === point.word;
              return (
                <g key={point.word}>
                  <circle
                    cx={point.x}
                    cy={-point.y}
                    r={isHovered ? 0.25 : 0.18}
                    fill={CATEGORY_COLORS[point.category]}
                    opacity={isHovered ? 1 : 0.8}
                    stroke={isHovered ? "white" : "none"}
                    strokeWidth="0.05"
                    onMouseEnter={() => setHoveredWord(point.word)}
                    onMouseLeave={() => setHoveredWord(null)}
                    style={{ cursor: "pointer", transition: "r 0.15s" }}
                  />
                  {(isHovered || filteredData.length <= 6) && (
                    <text
                      x={point.x}
                      y={-point.y - 0.35}
                      textAnchor="middle"
                      fontSize="0.25"
                      fill="hsl(var(--foreground))"
                      fontFamily="var(--app-font-mono)"
                    >
                      {point.word}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="capitalize text-muted-foreground">{cat}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Words with similar meanings cluster together in embedding space. This 2D projection
        (via t-SNE or PCA) reveals semantic relationships learned by the model.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DIFFUSION STEPS VISUALIZATION
   Step-through denoising process
══════════════════════════════════════════════════════════════════════════ */

export function DiffusionSteps() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSteps = 20;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const noiseLevel = 1 - step / totalSteps;
  const clarity = step / totalSteps;

  // Generate noise pattern based on step
  const noisePattern = useMemo(() => {
    const pattern: { x: number; y: number; size: number }[] = [];
    const numDots = Math.floor(200 * noiseLevel);
    for (let i = 0; i < numDots; i++) {
      pattern.push({
        x: Math.random() * 200,
        y: Math.random() * 200,
        size: Math.random() * 3 + 1,
      });
    }
    return pattern;
  }, [step]);

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Diffusion Denoising Process
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (step >= totalSteps) setStep(0);
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsPlaying(false);
                setStep(0);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Step: {step} / {totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">
              Noise: {(noiseLevel * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[step]}
            onValueChange={(v) => {
              setIsPlaying(false);
              setStep(v[0]);
            }}
            min={0}
            max={totalSteps}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Noise visualization */}
          <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {noisePattern.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.size}
                  fill="hsl(var(--muted-foreground))"
                  opacity={0.3}
                />
              ))}
            </svg>
            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Noise
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary" />
          </div>

          {/* Image emerging */}
          <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Simple shape emerging from noise */}
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="hsl(var(--primary))"
                opacity={clarity}
              />
              <circle
                cx="75"
                cy="85"
                r="10"
                fill="hsl(var(--background))"
                opacity={clarity}
              />
              <circle
                cx="125"
                cy="85"
                r="10"
                fill="hsl(var(--background))"
                opacity={clarity}
              />
              <path
                d="M 70 120 Q 100 145 130 120"
                stroke="hsl(var(--background))"
                strokeWidth="6"
                fill="none"
                opacity={clarity}
              />
              {/* Remaining noise */}
              {noisePattern.slice(0, Math.floor(noisePattern.length * noiseLevel)).map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.size * 0.7}
                  fill="hsl(var(--muted-foreground))"
                  opacity={0.2}
                />
              ))}
            </svg>
            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Image
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Timestep t</div>
            <div className="font-mono font-semibold">{totalSteps - step}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Noise Level</div>
            <div className="font-mono font-semibold">{(noiseLevel * 100).toFixed(0)}%</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">Signal</div>
            <div className="font-mono font-semibold">{(clarity * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Diffusion models generate images by iteratively removing noise. Starting from pure
        noise (t=T), each step predicts and subtracts noise until a clean image emerges (t=0).
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LOSS CURVES VISUALIZATION
   Training and validation loss over epochs
══════════════════════════════════════════════════════════════════════════ */

export function LossCurves() {
  const [showOverfitting, setShowOverfitting] = useState(false);

  const normalData = Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    train: 2.5 * Math.exp(-0.08 * i) + 0.15 + Math.random() * 0.05,
    val: 2.5 * Math.exp(-0.07 * i) + 0.2 + Math.random() * 0.08,
  }));

  const overfitData = Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    train: 2.5 * Math.exp(-0.12 * i) + 0.05 + Math.random() * 0.02,
    val:
      i < 20
        ? 2.5 * Math.exp(-0.08 * i) + 0.25 + Math.random() * 0.05
        : 0.6 + (i - 20) * 0.015 + Math.random() * 0.05,
  }));

  const data = showOverfitting ? overfitData : normalData;

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Training Loss Curves
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOverfitting(false)}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                !showOverfitting
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setShowOverfitting(true)}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                showOverfitting
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Overfitting
            </button>
          </div>
        </div>

        <ChartContainer
          config={{
            train: { label: "Training Loss", color: "hsl(var(--primary))" },
            val: { label: "Validation Loss", color: "hsl(25, 70%, 50%)" },
          }}
          className="h-[250px] w-full"
        >
          <LineChart data={data}>
            <XAxis
              dataKey="epoch"
              tickFormatter={(v) => (v % 10 === 0 ? v : "")}
              label={{ value: "Epoch", position: "bottom", offset: -5 }}
            />
            <YAxis
              domain={[0, 3]}
              tickFormatter={(v) => v.toFixed(1)}
              label={{ value: "Loss", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="train"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="val"
              stroke="hsl(25, 70%, 50%)"
              strokeWidth={2}
              dot={false}
            />
            {showOverfitting && (
              <ReferenceLine
                x={20}
                stroke="hsl(0, 60%, 50%)"
                strokeDasharray="4 4"
                label={{ value: "Overfit starts", position: "top", fontSize: 10 }}
              />
            )}
          </LineChart>
        </ChartContainer>

        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Training Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(25, 70%, 50%)" }} />
            <span className="text-muted-foreground">Validation Loss</span>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        {showOverfitting
          ? "Overfitting: training loss decreases but validation loss increases after epoch 20, indicating the model memorizes training data rather than learning generalizable patterns."
          : "Normal training: both losses decrease together, with validation slightly higher. The gap stays constant, indicating good generalization."}
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SCALING LAWS CHART
   Log-log plot of compute vs performance
══════════════════════════════════════════════════════════════════════════ */

const SCALING_DATA = [
  { name: "GPT-2", compute: 1e18, loss: 3.3, params: "1.5B" },
  { name: "GPT-3", compute: 3.6e23, loss: 2.0, params: "175B" },
  { name: "Chinchilla", compute: 5.8e23, loss: 1.9, params: "70B" },
  { name: "PaLM", compute: 2.5e24, loss: 1.7, params: "540B" },
  { name: "GPT-4", compute: 2e25, loss: 1.4, params: "~1.8T" },
  { name: "Claude 3", compute: 3e25, loss: 1.3, params: "~2T" },
];

export function ScalingLawsChart() {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  // Log scale transformation
  const logData = SCALING_DATA.map((d) => ({
    ...d,
    logCompute: Math.log10(d.compute),
  }));

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Neural Scaling Laws: Compute vs. Performance
        </h3>

        <ChartContainer
          config={{
            loss: { label: "Test Loss", color: "hsl(var(--primary))" },
          }}
          className="h-[280px] w-full"
        >
          <ScatterChart data={logData}>
            <XAxis
              dataKey="logCompute"
              type="number"
              domain={[17, 26]}
              tickFormatter={(v) => `10^${v.toFixed(0)}`}
              label={{ value: "Training Compute (FLOPs)", position: "bottom", offset: -5 }}
            />
            <YAxis
              dataKey="loss"
              type="number"
              domain={[1, 3.5]}
              tickFormatter={(v) => v.toFixed(1)}
              label={{ value: "Test Loss", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-muted-foreground">Params: {d.params}</div>
                    <div className="text-muted-foreground">
                      Compute: 10^{Math.log10(d.compute).toFixed(1)} FLOPs
                    </div>
                    <div className="text-primary">Loss: {d.loss.toFixed(2)}</div>
                  </div>
                );
              }}
            />
            <Scatter dataKey="loss" fill="hsl(var(--primary))">
              {logData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    hoveredModel === entry.name
                      ? "hsl(var(--primary))"
                      : "hsl(var(--primary) / 0.7)"
                  }
                  onMouseEnter={() => setHoveredModel(entry.name)}
                  onMouseLeave={() => setHoveredModel(null)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Scatter>
            {/* Trend line (approximate) */}
            <Line
              type="monotone"
              data={[
                { logCompute: 18, loss: 3.2 },
                { logCompute: 25.5, loss: 1.2 },
              ]}
              dataKey="loss"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
          </ScatterChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {SCALING_DATA.map((model) => (
            <div
              key={model.name}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                hoveredModel === model.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
              onMouseEnter={() => setHoveredModel(model.name)}
              onMouseLeave={() => setHoveredModel(null)}
            >
              {model.name}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Loss decreases as a power law with compute. The dashed line shows the approximate
        scaling trend: each 10x increase in compute yields ~0.2 reduction in loss.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MODEL PERPLEXITY COMPARISON
   Compare perplexity across different models
══════════════════════════════════════════════════════════════════════════ */

const MODEL_PERPLEXITY_DATA = [
  { model: "GPT-2", perplexity: 35.8, params: "1.5B", family: "GPT" },
  { model: "GPT-3", perplexity: 20.5, params: "175B", family: "GPT" },
  { model: "GPT-4", perplexity: 8.2, params: "~1.8T", family: "GPT" },
  { model: "Llama 2", perplexity: 14.3, params: "70B", family: "Llama" },
  { model: "Llama 3", perplexity: 9.8, params: "70B", family: "Llama" },
  { model: "Claude 3", perplexity: 7.5, params: "~2T", family: "Claude" },
  { model: "Mistral", perplexity: 12.1, params: "7B", family: "Mistral" },
  { model: "Gemini", perplexity: 8.9, params: "~1T", family: "Gemini" },
];

const FAMILY_COLORS: Record<string, string> = {
  GPT: "hsl(var(--primary))",
  Llama: "hsl(142, 42%, 38%)",
  Claude: "hsl(25, 70%, 50%)",
  Mistral: "hsl(270, 38%, 52%)",
  Gemini: "hsl(198, 45%, 38%)",
};

export function ModelPerplexityChart() {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const families = [...new Set(MODEL_PERPLEXITY_DATA.map((d) => d.family))];
  
  const filteredData = selectedFamily
    ? MODEL_PERPLEXITY_DATA.filter((d) => d.family === selectedFamily)
    : MODEL_PERPLEXITY_DATA;

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Model Perplexity Comparison (Lower is Better)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFamily(null)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedFamily === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              All
            </button>
            {families.map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedFamily === fam
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {fam}
              </button>
            ))}
          </div>
        </div>

        <ChartContainer
          config={{
            perplexity: { label: "Perplexity", color: "hsl(var(--primary))" },
          }}
          className="h-[280px] w-full"
        >
          <BarChart data={filteredData} layout="vertical">
            <XAxis type="number" domain={[0, 40]} />
            <YAxis
              type="category"
              dataKey="model"
              width={80}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                    <div className="font-semibold">{d.model}</div>
                    <div className="text-muted-foreground">Parameters: {d.params}</div>
                    <div className="text-primary">Perplexity: {d.perplexity}</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="perplexity" radius={[0, 4, 4, 0]}>
              {filteredData.map((entry, i) => (
                <Cell key={i} fill={FAMILY_COLORS[entry.family]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {families.map((fam) => (
            <div key={fam} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: FAMILY_COLORS[fam] }}
              />
              <span className="text-muted-foreground">{fam}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Perplexity measures how well a model predicts text. Lower perplexity indicates
        better language modeling capability. Values are approximate and benchmark-dependent.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   QUANTIZATION PERFORMANCE CHART
   Compare inference speed across quantization levels
══════════════════════════════════════════════════════════════════════════ */

const QUANT_DATA = [
  { quant: "FP32", memory: 280, tokensPerSec: 12, quality: 100 },
  { quant: "FP16", memory: 140, tokensPerSec: 25, quality: 99.9 },
  { quant: "INT8", memory: 70, tokensPerSec: 45, quality: 99.2 },
  { quant: "Q6_K", memory: 52, tokensPerSec: 55, quality: 98.5 },
  { quant: "Q5_K_M", memory: 44, tokensPerSec: 62, quality: 97.5 },
  { quant: "Q4_K_M", memory: 35, tokensPerSec: 78, quality: 95.0 },
  { quant: "Q3_K_M", memory: 26, tokensPerSec: 92, quality: 90.0 },
];

export function QuantizationChart() {
  const [metric, setMetric] = useState<"tokensPerSec" | "memory" | "quality">("tokensPerSec");

  const metricConfig = {
    tokensPerSec: { label: "Tokens/sec", color: "hsl(var(--primary))", domain: [0, 100] },
    memory: { label: "Memory (GB)", color: "hsl(25, 70%, 50%)", domain: [0, 300] },
    quality: { label: "Quality %", color: "hsl(142, 42%, 38%)", domain: [85, 100] },
  };

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Quantization Trade-offs (70B Model)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMetric("tokensPerSec")}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                metric === "tokensPerSec"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Speed
            </button>
            <button
              onClick={() => setMetric("memory")}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                metric === "memory"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Memory
            </button>
            <button
              onClick={() => setMetric("quality")}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                metric === "quality"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Quality
            </button>
          </div>
        </div>

        <ChartContainer
          config={{
            [metric]: { label: metricConfig[metric].label, color: metricConfig[metric].color },
          }}
          className="h-[250px] w-full"
        >
          <BarChart data={QUANT_DATA}>
            <XAxis dataKey="quant" tick={{ fontSize: 11 }} />
            <YAxis domain={metricConfig[metric].domain as [number, number]} />
            <ChartTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                    <div className="font-semibold">{d.quant}</div>
                    <div>Memory: {d.memory} GB</div>
                    <div>Speed: {d.tokensPerSec} tok/s</div>
                    <div>Quality: {d.quality}%</div>
                  </div>
                );
              }}
            />
            <Bar dataKey={metric} fill={metricConfig[metric].color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="p-2 rounded-lg bg-muted/50 text-center">
            <div className="text-muted-foreground">Best Quality</div>
            <div className="font-semibold">FP16</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 text-center">
            <div className="text-muted-foreground">Best Balance</div>
            <div className="font-semibold">Q4_K_M</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 text-center">
            <div className="text-muted-foreground">Fastest</div>
            <div className="font-semibold">Q3_K_M</div>
          </div>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Quantization reduces memory and increases speed at the cost of some quality.
        Q4_K_M offers an excellent trade-off for most applications.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ACTIVATION FUNCTIONS COMPARISON
   Interactive view of different activation functions
══════════════════════════════════════════════════════════════════════════ */

function relu(x: number) { return Math.max(0, x); }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
function tanh_(x: number) { return Math.tanh(x); }
function gelu(x: number) { return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3)))); }
function swish(x: number) { return x * sigmoid(x); }

const ACTIVATION_FUNCS: Record<string, (x: number) => number> = {
  ReLU: relu,
  Sigmoid: sigmoid,
  Tanh: tanh_,
  GELU: gelu,
  SiLU: swish,
};

const ACTIVATION_COLORS: Record<string, string> = {
  ReLU: "hsl(var(--primary))",
  Sigmoid: "hsl(25, 70%, 50%)",
  Tanh: "hsl(142, 42%, 38%)",
  GELU: "hsl(270, 38%, 52%)",
  SiLU: "hsl(198, 45%, 38%)",
};

export function ActivationFunctionsChart() {
  const [selected, setSelected] = useState<string[]>(["ReLU", "GELU"]);

  const data = useMemo(() => {
    const points: { x: number; [key: string]: number }[] = [];
    for (let x = -4; x <= 4; x += 0.1) {
      const point: { x: number; [key: string]: number } = { x: Math.round(x * 10) / 10 };
      Object.entries(ACTIVATION_FUNCS).forEach(([name, fn]) => {
        point[name] = Math.round(fn(x) * 1000) / 1000;
      });
      points.push(point);
    }
    return points;
  }, []);

  const toggleActivation = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <figure className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Activation Functions Comparison
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(ACTIVATION_FUNCS).map((name) => (
            <button
              key={name}
              onClick={() => toggleActivation(name)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                selected.includes(name)
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
              style={{
                backgroundColor: selected.includes(name)
                  ? ACTIVATION_COLORS[name]
                  : undefined,
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <ChartContainer
          config={Object.fromEntries(
            Object.keys(ACTIVATION_FUNCS).map((name) => [
              name,
              { label: name, color: ACTIVATION_COLORS[name] },
            ])
          )}
          className="h-[280px] w-full"
        >
          <LineChart data={data}>
            <XAxis
              dataKey="x"
              type="number"
              domain={[-4, 4]}
              tickFormatter={(v) => v.toString()}
            />
            <YAxis domain={[-1.5, 2]} />
            <ReferenceLine x={0} stroke="hsl(var(--border))" />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <ChartTooltip content={<ChartTooltipContent />} />
            {selected.map((name) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={ACTIVATION_COLORS[name]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>

        <div className="mt-4 text-xs text-muted-foreground">
          <p className="mb-2">
            <strong>Modern standard:</strong> GELU and SiLU (Swish) are now preferred over ReLU in
            transformers due to smoother gradients and slightly better performance.
          </p>
        </div>
      </div>
      <figcaption className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
        Activation functions introduce non-linearity. Click to toggle visibility and compare shapes.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   REGISTRY — Maps string keys to interactive components
══════════════════════════════════════════════════════════════════════════ */

export const interactiveRegistry: Record<string, React.ComponentType> = {
  // Standalone component keys
  "softmax-temperature": SoftmaxTemperature,
  "gradient-descent": GradientDescentViz,
  "tokenizer-playground": TokenizerPlayground,
  "attention-heatmap": AttentionHeatmap,
  "embedding-space": EmbeddingSpace,
  "diffusion-steps": DiffusionSteps,
  "loss-curves": LossCurves,
  "scaling-laws": ScalingLawsChart,
  "model-perplexity": ModelPerplexityChart,
  "quantization-chart": QuantizationChart,
  "activation-functions": ActivationFunctionsChart,
  
  // Topic:section mappings (slug:sectionIndex)
  "sampling-strategies:0": SoftmaxTemperature,       // Temperature sampling section
  "loss-functions-optimization:2": GradientDescentViz, // Gradient descent section
  "tokenization:1": TokenizerPlayground,             // BPE tokenization section
  "attention-mechanism:1": AttentionHeatmap,         // Self-attention section
  "embeddings:2": EmbeddingSpace,                    // Embedding space section
  "diffusion-models:1": DiffusionSteps,              // Denoising process section
  "neural-networks-basics:3": LossCurves,            // Training section
  "neural-networks-basics:1": ActivationFunctionsChart, // Activation functions section
  "scaling-laws:0": ScalingLawsChart,                // Scaling laws overview
  "transformers:2": AttentionHeatmap,                // Transformer attention section
  "large-language-models:0": ModelPerplexityChart,   // LLM overview with perplexity
  "large-language-models:1": TokenizerPlayground,    // Tokenization in LLMs
  "quantization:2": QuantizationChart,               // Quantization methods comparison
};

export function InteractiveDiagram({ id }: { id: string }) {
  const Component = interactiveRegistry[id];
  if (!Component) {
    return (
      <div className="my-8 p-4 rounded-xl border border-border bg-muted/50 text-center text-sm text-muted-foreground">
        Interactive diagram "{id}" not found
      </div>
    );
  }
  return <Component />;
}
