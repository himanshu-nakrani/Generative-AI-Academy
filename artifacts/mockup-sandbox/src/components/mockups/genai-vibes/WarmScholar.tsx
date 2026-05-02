export function WarmScholar() {
  const papers = [
    { title: "Attention Is All You Need", author: "Vaswani et al.", year: 2017, desc: "The transformer architecture that started it all." },
    { title: "Auto-Encoding Variational Bayes", author: "Kingma & Welling", year: 2013, desc: "The original VAE paper." },
    { title: "Generative Adversarial Nets", author: "Goodfellow et al.", year: 2014, desc: "The original GAN paper." },
    { title: "Denoising Diffusion Probabilistic Models", author: "Ho et al.", year: 2020, desc: "The DDPM paper that popularized diffusion models." },
    { title: "Training Language Models with RLHF", author: "Ouyang et al.", year: 2022, desc: "InstructGPT and the RLHF recipe." },
    { title: "Chinchilla: Compute-Optimal Training", author: "Hoffmann et al.", year: 2022, desc: "Scaling laws for compute-optimal LLMs." },
  ];
  const courses = [
    { title: "Deep Learning (Goodfellow et al.)", desc: "The textbook for deep learning fundamentals. Free online." },
    { title: "fast.ai Practical Deep Learning", desc: "Hands-on, top-down approach to deep learning." },
    { title: "Andrej Karpathy's Neural Networks Series", desc: "Incredible from-scratch implementations and explanations." },
    { title: "Hugging Face NLP Course", desc: "Practical transformer-based NLP with HuggingFace." },
  ];
  const tools = [
    { title: "PyTorch", desc: "The primary framework for AI research and production." },
    { title: "Hugging Face Transformers", desc: "The standard library for working with transformer models." },
    { title: "LangChain", desc: "Framework for building LLM-powered applications." },
    { title: "Diffusers", desc: "Library for working with diffusion models." },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#faf7f2", minHeight: "100vh", color: "#2c1f0e" }}>
      {/* Nav */}
      <nav style={{ background: "#2c1f0e", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#c8882a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16 }}>⬡</span>
          </div>
          <span style={{ color: "#f5e6c8", fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}>
            GenAI <span style={{ color: "#c8882a" }}>Learn</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Topics", "Learning Paths", "Resources"].map(l => (
            <span key={l} style={{ color: l === "Resources" ? "#c8882a" : "#c8b08a", fontSize: 14, cursor: "pointer", fontFamily: "sans-serif" }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Page */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, borderBottom: "2px solid #d9c9a8", paddingBottom: 32 }}>
          <div style={{ display: "inline-block", background: "#c8882a", color: "#fff", padding: "4px 14px", borderRadius: 4, fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            CURATED LIBRARY
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px", color: "#2c1f0e" }}>Resources</h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#6b4c2a", maxWidth: 600, margin: 0 }}>
            A carefully curated collection of foundational papers, textbooks, courses, and tools. Each entry is hand-picked for lasting educational value.
          </p>
        </div>

        {/* Section: Papers */}
        <Section title="Foundational Papers" accent="#c8882a">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {papers.map(p => (
              <PaperCard key={p.title} {...p} />
            ))}
          </div>
        </Section>

        {/* Section: Courses */}
        <Section title="Courses & Books" accent="#c8882a">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {courses.map(c => (
              <CourseCard key={c.title} {...c} />
            ))}
          </div>
        </Section>

        {/* Section: Tools */}
        <Section title="Tools & Frameworks" accent="#c8882a">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {tools.map(t => (
              <CourseCard key={t.title} {...t} />
            ))}
          </div>
        </Section>

        {/* Tips box */}
        <div style={{ background: "#f0e6d0", border: "1px solid #d9c9a8", borderLeft: "4px solid #c8882a", borderRadius: 8, padding: 28, marginTop: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#2c1f0e" }}>Scholar's Notes</h3>
          {["Build on the Beginner Path before diving into research papers.", "Every paper is easier with a code implementation alongside.", "Karpathy's build-from-scratch series is non-negotiable.", "HuggingFace will become your daily driver — learn it early."].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ color: "#c8882a", fontWeight: 700, fontFamily: "sans-serif", minWidth: 20 }}>{i + 1}.</span>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "#4a3520", fontFamily: "sans-serif" }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ width: 3, height: 22, background: accent, borderRadius: 2, display: "inline-block" }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2c1f0e", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PaperCard({ title, author, year, desc }: { title: string; author: string; year: number; desc: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0d0b5", borderRadius: 8, padding: 20, cursor: "pointer", transition: "box-shadow .15s" }}>
      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a7a50", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em" }}>
        {author} · {year}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#2c1f0e", marginBottom: 8, lineHeight: 1.4 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#6b5030", lineHeight: 1.55, fontFamily: "sans-serif" }}>{desc}</div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#c8882a", fontFamily: "sans-serif", fontWeight: 600 }}>Read paper →</div>
    </div>
  );
}

function CourseCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0d0b5", borderRadius: 8, padding: 20, cursor: "pointer" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#2c1f0e", marginBottom: 8, lineHeight: 1.4, fontFamily: "Georgia, serif" }}>{title}</div>
      <div style={{ fontSize: 13, color: "#6b5030", lineHeight: 1.55, fontFamily: "sans-serif" }}>{desc}</div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#c8882a", fontFamily: "sans-serif", fontWeight: 600 }}>Open →</div>
    </div>
  );
}
