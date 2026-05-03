export function NeonPulse() {
  const papers = [
    { title: "Attention Is All You Need", author: "Vaswani et al.", year: 2017, desc: "The transformer architecture that started it all." },
    { title: "Auto-Encoding Variational Bayes", author: "Kingma & Welling", year: 2013, desc: "The original VAE paper." },
    { title: "Generative Adversarial Nets", author: "Goodfellow et al.", year: 2014, desc: "The original GAN paper." },
    { title: "Denoising Diffusion Probabilistic Models", author: "Ho et al.", year: 2020, desc: "The DDPM paper that popularized diffusion models." },
  ];
  const courses = [
    { title: "Deep Learning", author: "Goodfellow et al.", desc: "The canonical DL textbook. Free online." },
    { title: "fast.ai Practical Deep Learning", author: "Howard & Gugger", desc: "Top-down, code-first approach." },
    { title: "Neural Networks: Zero to Hero", author: "Karpathy", desc: "Build everything from scratch." },
    { title: "HuggingFace NLP Course", author: "HuggingFace Team", desc: "Transformers in production." },
  ];

  const cyan = "#00f0ff";
  const magenta = "#ff00ff";
  const purple = "#b000ff";
  const bg = "#0a0a1a";
  const surface = "#1a1a3a";
  const border = "#2a2a5a";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: bg, minHeight: "100vh", color: "#e8e8ff" }}>
      {/* Nav */}
      <nav style={{ background: surface, borderBottom: `2px solid ${magenta}`, padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: `linear-gradient(135deg, ${cyan}, ${magenta})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${magenta}` }}>
            <span style={{ color: "#000", fontSize: 18, fontWeight: 900 }}>⚡</span>
          </div>
          <span style={{ background: `linear-gradient(135deg, ${cyan}, ${magenta})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
            GenAI Learn
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Topics", "Learning Paths", "Resources"].map(l => (
            <span key={l} style={{ color: l === "Resources" ? cyan : "#a8a8d8", fontSize: 14, cursor: "pointer", padding: "8px 16px", borderRadius: 4, border: l === "Resources" ? `1px solid ${cyan}` : "1px solid transparent", background: l === "Resources" ? `rgba(0, 240, 255, 0.1)` : "transparent", transition: "all 0.3s" }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, border: `1px solid ${cyan}`, color: cyan, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24, boxShadow: `0 0 15px ${cyan}33` }}>
            Knowledge Base v2.0
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px", background: `linear-gradient(135deg, ${cyan}, ${magenta})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Resources
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#c8c8d8", maxWidth: 600, margin: 0 }}>
            Foundational papers, cutting-edge frameworks, and hands-on courses. Everything you need to master generative AI.
          </p>
        </div>

        {/* Papers */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: magenta, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 2, height: 20, background: magenta }}></span> Foundational Papers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {papers.map(p => (
              <div key={p.title} style={{ padding: "20px", borderRadius: 8, border: `1px solid ${border}`, background: surface, cursor: "pointer", transition: "all 0.3s", backdropFilter: "blur(5px)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cyan; e.currentTarget.style.boxShadow = `0 0 20px ${cyan}33`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 11, color: cyan, marginBottom: 8, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {p.author} · {p.year}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e8ff", marginBottom: 8, lineHeight: 1.3 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 13, color: "#a8a8c8", lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: cyan, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 2, height: 20, background: cyan }}></span> Courses & Books
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {courses.map(c => (
              <div key={c.title} style={{ padding: "20px", borderRadius: 8, border: `1px solid ${border}`, background: surface, cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = magenta; e.currentTarget.style.boxShadow = `0 0 20px ${magenta}33`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 11, color: magenta, marginBottom: 6, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {c.author}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e8ff", marginBottom: 8 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, color: "#a8a8c8", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
