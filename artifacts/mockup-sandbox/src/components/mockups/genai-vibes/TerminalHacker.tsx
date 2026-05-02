export function TerminalHacker() {
  const papers = [
    { title: "Attention Is All You Need", author: "vaswani_et_al", year: 2017, desc: "The transformer architecture that started it all." },
    { title: "Auto-Encoding Variational Bayes", author: "kingma_welling", year: 2013, desc: "The original VAE paper." },
    { title: "Generative Adversarial Nets", author: "goodfellow_et_al", year: 2014, desc: "The original GAN paper." },
    { title: "Denoising Diffusion Probabilistic Models", author: "ho_et_al", year: 2020, desc: "DDPM — diffusion models made practical." },
    { title: "Training Language Models with RLHF", author: "ouyang_et_al", year: 2022, desc: "InstructGPT and the RLHF recipe." },
    { title: "Chinchilla: Compute-Optimal Training", author: "hoffmann_et_al", year: 2022, desc: "Scaling laws for compute-optimal LLMs." },
  ];
  const courses = [
    { title: "Deep Learning", author: "goodfellow_et_al", desc: "The canonical DL textbook. Free online." },
    { title: "fast.ai Practical Deep Learning", author: "howard_gugger", desc: "Top-down, code-first approach." },
    { title: "Neural Networks: Zero to Hero", author: "karpathy_a", desc: "Build everything from scratch. Essential." },
    { title: "HuggingFace NLP Course", author: "huggingface_team", desc: "Transformers in production. Practical." },
  ];
  const tools = [
    { title: "PyTorch", author: "meta_ai", desc: "Primary framework for research + production." },
    { title: "transformers", author: "huggingface", desc: "Standard library for transformer models." },
    { title: "langchain", author: "harrison_chase", desc: "LLM application orchestration." },
    { title: "diffusers", author: "huggingface", desc: "Diffusion model pipelines." },
    { title: "vllm", author: "various", desc: "High-throughput LLM serving engine." },
  ];

  const mono = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
  const green = "#00e676";
  const dimGreen = "#00c853";
  const bg = "#0a0f0a";
  const surface = "#0f1a0f";
  const border = "#1a3a1a";
  const muted = "#4a7a4a";

  return (
    <div style={{ fontFamily: mono, background: bg, minHeight: "100vh", color: green }}>
      {/* Nav */}
      <nav style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: muted, fontSize: 13 }}>~/</span>
          <span style={{ color: green, fontSize: 14, fontWeight: 700 }}>genai-learn</span>
          <span style={{ color: muted, fontSize: 13 }}> $</span>
          <span style={{ color: "#fff", fontSize: 13, marginLeft: 4 }}>_</span>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {["topics", "paths", "resources"].map((l, i) => (
            <span key={l} style={{
              color: l === "resources" ? green : muted,
              fontSize: 12,
              cursor: "pointer",
              padding: "6px 16px",
              borderLeft: i === 0 ? `1px solid ${border}` : undefined,
              borderRight: `1px solid ${border}`,
              borderTop: `1px solid ${border}`,
              borderBottom: l === "resources" ? `2px solid ${green}` : `1px solid ${border}`,
              background: l === "resources" ? "rgba(0,230,118,0.05)" : "transparent"
            }}>./{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px" }}>
        {/* Prompt-style header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ color: muted, fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: dimGreen }}>user@genai</span>
            <span style={{ color: muted }}>:</span>
            <span style={{ color: "#4a9eff" }}>~/resources</span>
            <span style={{ color: "#fff" }}> $ cat README.md</span>
          </div>
          <div style={{ borderLeft: `2px solid ${border}`, paddingLeft: 20, marginTop: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: green, marginBottom: 8 }}>
              # resources
            </div>
            <div style={{ fontSize: 14, color: muted, lineHeight: 1.7 }}>
              ## curated knowledge base<br />
              Foundational papers, textbooks, tools, and courses.<br />
              Each entry is hand-verified for technical depth.
            </div>
          </div>
        </div>

        {/* Papers */}
        <TermSection title="foundational_papers" icon="📄" green={green} muted={muted} border={border} surface={surface}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {papers.map(p => (
              <TermCard key={p.title} green={green} muted={muted} border={border} surface={surface}>
                <div style={{ fontSize: 10, color: muted, marginBottom: 4 }}>
                  [{p.author}] [{p.year}]
                </div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>{p.desc}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: green }}>→ arxiv.org</div>
              </TermCard>
            ))}
          </div>
        </TermSection>

        {/* Courses */}
        <TermSection title="courses_and_books" icon="📚" green={green} muted={muted} border={border} surface={surface}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {courses.map(c => (
              <TermCard key={c.title} green={green} muted={muted} border={border} surface={surface}>
                <div style={{ fontSize: 10, color: muted, marginBottom: 4 }}>[{c.author}]</div>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>{c.desc}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: green }}>→ open</div>
              </TermCard>
            ))}
          </div>
        </TermSection>

        {/* Tools */}
        <TermSection title="tools_and_frameworks" icon="⚙" green={green} muted={muted} border={border} surface={surface}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tools.map(t => (
              <div key={t.title} style={{ display: "flex", alignItems: "center", gap: 16, background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "10px 16px" }}>
                <div style={{ color: green, fontSize: 12, minWidth: 140 }}>pip install <span style={{ color: "#fff" }}>{t.title}</span></div>
                <div style={{ fontSize: 11, color: muted, flex: 1 }}># {t.desc}</div>
                <div style={{ fontSize: 10, color: dimGreen }}>★ install</div>
              </div>
            ))}
          </div>
        </TermSection>

        {/* Tips */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: 24, marginTop: 8 }}>
          <div style={{ color: muted, fontSize: 11, marginBottom: 16 }}>
            <span style={{ color: dimGreen }}>$</span> cat learning_tips.txt
          </div>
          {["Start with beginner path → solid foundations before papers.", "Every paper pairs with a code impl. Find it on GitHub.", "Karpathy from-scratch videos: required reading. No skipping.", "HuggingFace ecosystem = daily driver. Learn it on day 1.", "Build something. RAG is best understood by building RAG."].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 12, lineHeight: 1.6 }}>
              <span style={{ color: dimGreen, minWidth: 20 }}>{String(i).padStart(2, "0")}</span>
              <span style={{ color: "#c8e6c9" }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TermSection({ title, icon, children, green, muted, border, surface }: any) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, borderBottom: `1px solid #1a3a1a`, paddingBottom: 10 }}>
        <span style={{ fontSize: 12, color: muted }}>##</span>
        <span style={{ fontSize: 14, color: green, fontWeight: 700 }}>{title}/</span>
      </div>
      {children}
    </div>
  );
}

function TermCard({ children, green, muted, border, surface }: any) {
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: 16, cursor: "pointer" }}>
      {children}
    </div>
  );
}
