export function Resources() {
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 border-b-2 border-[#d9c9a8] pb-8">
        <div className="ws-badge mb-4">CURATED LIBRARY</div>
        <h1 className="text-5xl font-bold font-serif text-foreground mb-4">Resources</h1>
        <p className="text-lg text-[#6b4c2a] max-w-2xl leading-relaxed">
          A carefully curated collection of foundational papers, textbooks, courses, and tools. Each entry is hand-picked for lasting educational value.
        </p>
      </div>

      <Section title="Foundational Papers">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {papers.map(p => (
            <PaperCard key={p.title} {...p} />
          ))}
        </div>
      </Section>

      <Section title="Courses & Books">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map(c => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </Section>

      <Section title="Tools & Frameworks">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map(t => (
            <CourseCard key={t.title} {...t} />
          ))}
        </div>
      </Section>

      <div className="ws-callout mt-8">
        <h3 className="text-lg font-bold font-serif mb-4 text-foreground">Scholar's Notes</h3>
        <div className="space-y-3">
          {[
            "Build on the Beginner Path before diving into research papers.",
            "Every paper is easier with a code implementation alongside.",
            "Karpathy's build-from-scratch series is non-negotiable.",
            "HuggingFace will become your daily driver — learn it early."
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span className="text-foreground text-sm leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="ws-section-heading text-2xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function PaperCard({ title, author, year, desc }: { title: string; author: string; year: number; desc: string }) {
  return (
    <div className="ws-card p-5 cursor-pointer flex flex-col h-full">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {author} · {year}
      </div>
      <div className="text-base font-bold font-serif text-foreground mb-2 leading-snug">{title}</div>
      <div className="text-sm text-[#6b5030] leading-relaxed flex-1">{desc}</div>
      <div className="mt-3 text-xs font-semibold text-primary pt-3 border-t border-border">Read paper →</div>
    </div>
  );
}

function CourseCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="ws-card p-5 cursor-pointer flex flex-col h-full">
      <div className="text-base font-bold font-serif text-foreground mb-2 leading-snug">{title}</div>
      <div className="text-sm text-[#6b5030] leading-relaxed flex-1">{desc}</div>
      <div className="mt-3 text-xs font-semibold text-primary pt-3 border-t border-border">Open →</div>
    </div>
  );
}

export default Resources;