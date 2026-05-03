export function ZenMinimalist() {
  const papers = [
    { title: "Attention Is All You Need", author: "Vaswani et al.", year: 2017 },
    { title: "Auto-Encoding Variational Bayes", author: "Kingma & Welling", year: 2013 },
    { title: "Generative Adversarial Nets", author: "Goodfellow et al.", year: 2014 },
    { title: "Denoising Diffusion Probabilistic Models", author: "Ho et al.", year: 2020 },
  ];
  const courses = [
    { title: "Deep Learning", author: "Goodfellow et al." },
    { title: "fast.ai Practical Deep Learning", author: "Howard & Gugger" },
    { title: "Neural Networks: Zero to Hero", author: "Karpathy" },
    { title: "HuggingFace NLP Course", author: "HuggingFace Team" },
  ];

  const cream = "#f9f8f5";
  const sage = "#8b9d83";
  const taupe = "#a89f94";
  const softBg = "#fcfbf8";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: cream, minHeight: "100vh", color: "#3a3a34" }}>
      {/* Nav */}
      <nav style={{ background: softBg, borderBottom: "1px solid #e8e4dd", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: sage, opacity: 0.7 }}></div>
          <span style={{ color: sage, fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}>Learn</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Topics", "Learning Paths", "Resources"].map(l => (
            <span key={l} style={{ color: l === "Resources" ? sage : taupe, fontSize: 14, cursor: "pointer", transition: "color 0.3s" }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: 80, textAlign: "center" }}>
          <h1 style={{ fontSize: 48, fontWeight: 300, lineHeight: 1.2, margin: "0 0 24px", color: "#3a3a34", letterSpacing: "0.02em" }}>
            Resources
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: taupe, margin: 0, maxWidth: 500, marginLeft: "auto", marginRight: "auto", fontWeight: 300 }}>
            A curated selection of knowledge, thoughtfully chosen. Take your time.
          </p>
        </div>

        {/* Papers */}
        <div style={{ marginBottom: 100 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: sage, marginBottom: 40, letterSpacing: "0.06em", textTransform: "uppercase" }}>Papers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            {papers.map(p => (
              <div key={p.title} style={{ paddingBottom: 40, borderBottom: "1px solid #e8e4dd" }}>
                <div style={{ fontSize: 12, color: taupe, marginBottom: 8, letterSpacing: "0.04em" }}>
                  {p.author} — {p.year}
                </div>
                <div style={{ fontSize: 17, fontWeight: 500, color: "#3a3a34", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: sage, marginBottom: 40, letterSpacing: "0.06em", textTransform: "uppercase" }}>Courses</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            {courses.map(c => (
              <div key={c.title} style={{ paddingBottom: 40, borderBottom: "1px solid #e8e4dd" }}>
                <div style={{ fontSize: 12, color: taupe, marginBottom: 8, letterSpacing: "0.04em" }}>
                  {c.author}
                </div>
                <div style={{ fontSize: 17, fontWeight: 500, color: "#3a3a34", lineHeight: 1.4 }}>
                  {c.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
