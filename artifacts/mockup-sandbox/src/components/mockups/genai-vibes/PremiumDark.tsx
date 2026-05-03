export function PremiumDark() {
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

  const gold = "#d4af37";
  const emerald = "#50c878";
  const deepBg = "#0f1419";
  const surface = "#1a1f2e";
  const border = "#2a3a52";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: deepBg, minHeight: "100vh", color: "#e8e8ee" }}>
      {/* Nav */}
      <nav style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "0 56px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 4, background: gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: deepBg, fontSize: 20, fontWeight: 900 }}>◆</span>
          </div>
          <span style={{ color: gold, fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}>GenAI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["Topics", "Learning Paths", "Resources"].map(l => (
            <span key={l} style={{ color: l === "Resources" ? gold : "#c0c0c8", fontSize: 14, cursor: "pointer", padding: "8px 20px", borderRadius: 2, border: l === "Resources" ? `1px solid ${gold}` : "1px solid transparent", transition: "all 0.3s" }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 56px" }}>
        {/* Header */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ color: gold, fontSize: 28, fontWeight: 900 }}>•</span>
            <span style={{ color: gold, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Curated Library</span>
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, margin: "0 0 20px", color: "#fff", letterSpacing: "-0.02em" }}>
            Resources
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#b8b8c0", margin: 0, maxWidth: 640 }}>
            Rigorously selected foundational papers, authoritative textbooks, and cutting-edge frameworks. Each resource represents lasting intellectual value.
          </p>
        </div>

        {/* Papers */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <span style={{ width: 3, height: 24, background: gold }}></span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "0.01em" }}>Foundational Papers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {papers.map(p => (
              <div key={p.title} style={{ padding: "28px", borderRadius: 4, border: `1px solid ${border}`, background: surface, cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = surface; }}>
                <div style={{ fontSize: 12, color: emerald, marginBottom: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {p.author} · {p.year}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 13, color: "#a0a0a8", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <span style={{ width: 3, height: 24, background: emerald }}></span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "0.01em" }}>Courses & Books</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {courses.map(c => (
              <div key={c.title} style={{ padding: "28px", borderRadius: 4, border: `1px solid ${border}`, background: surface, cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = emerald; e.currentTarget.style.background = "rgba(80, 200, 120, 0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = surface; }}>
                <div style={{ fontSize: 12, color: gold, marginBottom: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {c.author}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, color: "#a0a0a8", lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
