// Maps topic slug → prerequisite slugs (ordered by importance)
export const prerequisites: Record<string, string[]> = {
  // ── Foundations ───────────────────────────────────────────
  "history-of-ai":              ["what-is-generative-ai"],
  "neural-networks-basics":     ["what-is-generative-ai", "probability-statistics"],
  "probability-statistics":     ["what-is-generative-ai"],
  "loss-functions-optimization":["neural-networks-basics", "probability-statistics"],
  "training-vs-inference":      ["neural-networks-basics", "loss-functions-optimization"],
  "tokenization":               ["what-is-generative-ai", "neural-networks-basics"],

  // ── Core Models ───────────────────────────────────────────
  "attention-mechanism":        ["neural-networks-basics"],
  "transformers":               ["neural-networks-basics", "attention-mechanism", "tokenization"],
  "positional-encoding":        ["transformers", "attention-mechanism"],
  "large-language-models":      ["transformers", "tokenization"],
  "vaes":                       ["neural-networks-basics", "probability-statistics"],
  "gans":                       ["neural-networks-basics", "probability-statistics", "vaes"],
  "diffusion-models":           ["vaes", "probability-statistics"],
  "vector-quantization":        ["vaes", "embeddings"],
  "multimodal-models":          ["large-language-models", "diffusion-models"],

  // ── Techniques ────────────────────────────────────────────
  "embeddings":                 ["neural-networks-basics", "tokenization"],
  "prompt-engineering":         ["large-language-models"],
  "fine-tuning":                ["large-language-models", "training-vs-inference"],
  "lora":                       ["fine-tuning", "transformers"],
  "rag":                        ["large-language-models", "embeddings"],
  "rlhf":                       ["large-language-models", "fine-tuning"],
  "sampling-strategies":        ["large-language-models", "probability-statistics"],
  "quantization":               ["training-vs-inference", "large-language-models"],
  "speculative-decoding":       ["large-language-models", "sampling-strategies"],
  "long-context":               ["transformers", "attention-mechanism", "large-language-models"],
  "moe":                        ["transformers", "large-language-models"],

  // ── Applications ──────────────────────────────────────────
  "image-generation":           ["diffusion-models", "gans"],
  "classifier-free-guidance":   ["diffusion-models"],
  "code-generation":            ["large-language-models", "prompt-engineering"],
  "speech-audio":               ["transformers", "multimodal-models"],
  "video-generation":           ["diffusion-models", "image-generation"],
  "ai-agents":                  ["large-language-models", "rag", "prompt-engineering"],

  // ── Advanced Research ─────────────────────────────────────
  "scaling-laws":               ["large-language-models", "training-vs-inference"],
  "mechanistic-interpretability":["transformers", "attention-mechanism"],
  "model-evaluation":           ["large-language-models"],
  "constitutional-ai":          ["rlhf", "large-language-models"],
  "prompt-injection":           ["prompt-engineering", "ai-agents"],
  "ai-safety":                  ["constitutional-ai", "rlhf", "mechanistic-interpretability"],
  "world-models":               ["diffusion-models", "ai-agents", "large-language-models"],
};

export function getPrerequisites(slug: string): string[] {
  return prerequisites[slug] ?? [];
}
