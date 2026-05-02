export function CleanEditorial() {
  const papers = [
    { title: "Attention Is All You Need", author: "Vaswani et al.", year: "2017", desc: "The transformer architecture that started it all." },
    { title: "Auto-Encoding Variational Bayes", author: "Kingma & Welling", year: "2013", desc: "The original VAE paper." },
    { title: "Generative Adversarial Nets", author: "Goodfellow et al.", year: "2014", desc: "The original GAN paper." },
    { title: "Denoising Diffusion Probabilistic Models", author: "Ho et al.", year: "2020", desc: "The DDPM paper that popularized diffusion models." },
    { title: "Training Language Models with RLHF", author: "Ouyang et al.", year: "2022", desc: "InstructGPT and the RLHF recipe." },
    { title: "Chinchilla: Compute-Optimal Training", author: "Hoffmann et al.", year: "2022", desc: "Scaling laws for compute-optimal LLMs." },
  ];
  const courses = [
    { title: "Deep Learning", meta: "Goodfellow, Bengio, Courville", desc: "The canonical textbook. Free online." },
    { title: "fast.ai Practical Deep Learning", meta: "Howard & Gugger", desc: "Top-down, code-first approach." },
    { title: "Neural Networks: Zero to Hero", meta: "Andrej Karpathy", desc: "Build every concept from scratch." },
    { title: "HuggingFace NLP Course", meta: "HuggingFace Team", desc: "Practical transformers with modern tooling." },
  ];
  const tools = [
    { title: "PyTorch", tag: "Framework", desc: "Primary framework for research and production." },
    { title: "Transformers", tag: "Library", desc: "Standard library for working with transformer models." },
    { title: "LangChain", tag: "Application", desc: "Framework for building LLM-powered applications." },
    { title: "Diffusers", tag: "Library", desc: "Diffusion model pipeline library." },
    { title: "vLLM", tag: "Infrastructure", desc: "High-throughput LLM serving engine." },
  ];

  const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <div style={{ fontFamily: sans, background: "#f4f4f4", minHeight: "100vh", color: "#111" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #e8e8e8", padding: "0 56px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, background: "#f4f4f4", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#111" }} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em", color: "#111" }}>
            GenAI Learn
          </span>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {["Topics", "Learning Paths", "Resources"].map(l => (
            <span key={l} style={{
              fontSize: 13,
              fontWeight: l === "Resources" ? 700 : 400,
              color: l === "Resources" ? "#111" : "#888",
              cursor: "pointer",
              borderBottom: l === "Resources" ? "2px solid #111" : "none",
              paddingBottom: 2,
            }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 56px" }}>
        {/* Header */}
        <div style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #111", paddingBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", marginBottom: 16 }}>
              Reference Library
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0, color: "#111" }}>
              Resources
            </h1>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "#555", maxWidth: 340, margin: 0, textAlign: "right" }}>
            Curated papers, textbooks, courses, and tools — selected for depth and lasting relevance.
          </p>
        </div>

        {/* Papers */}
        <EditSection label="01" title="Foundational Papers">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1px solid #e8e8e8" }}>
            {papers.map((p, i) => (
              <div key={p.title} style={{
                padding: "24px 28px",
                borderRight: i % 2 === 0 ? "1px solid #e8e8e8" : undefined,
                borderBottom: i < papers.length - 2 ? "1px solid #e8e8e8" : undefined,
                cursor: "pointer",
                background: "#fff",
              }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 8, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {p.author} · {p.year}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 8, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{p.desc}</div>
                <div style={{ marginTop: 14, fontSize: 12, color: "#111", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  Read paper <span>↗</span>
                </div>
              </div>
            ))}
          </div>
        </EditSection>

        {/* Courses */}
        <EditSection label="02" title="Courses & Books">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {courses.map(c => (
              <div key={c.title} style={{ padding: "24px 0", borderTop: "1px solid #e8e8e8", cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {c.meta}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{c.desc}</div>
                <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: 4 }}>
                  Open ↗
                </div>
              </div>
            ))}
          </div>
        </EditSection>

        {/* Tools */}
        <EditSection label="03" title="Tools & Frameworks">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {tools.map((t, i) => (
              <div key={t.title} style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "18px 0",
                borderBottom: i < tools.length - 1 ? "1px solid #e8e8e8" : undefined,
                cursor: "pointer",
              }}>
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>{t.title}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#666" }}>{t.desc}</div>
                </div>
                <div style={{ background: "#f0f0f0", color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>
                  {t.tag}
                </div>
                <span style={{ fontSize: 14, color: "#888" }}>↗</span>
              </div>
            ))}
          </div>
        </EditSection>

        {/* Tips */}
        <div style={{ background: "#f8f8f8", borderRadius: 12, padding: 36, marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", textTransform: "uppercase", marginBottom: 20 }}>
            Learning Notes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
            {["Build foundations before papers.", "Every paper pairs with code.", "Karpathy from-scratch: watch it all.", "HuggingFace: learn on day one.", "Build a project with every concept."].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, color: "#bbb", fontWeight: 700, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditSection({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em" }}>{label}</span>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.03em", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
