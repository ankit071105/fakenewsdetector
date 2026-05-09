'use client';

const steps = [
  {
    num: '01',
    title: 'You paste an article',
    body: "You copy any news article, headline, or paragraph and paste it into TruthLens. It could be something you saw on social media, in an email, or on a website you're not sure about.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Text is cleaned',
    body: "The computer first strips out noise — URLs, punctuation, numbers, and common words like \"the\" or \"and\" that don't carry meaning. This leaves only the important words.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'TF-IDF converts words to numbers',
    body: "Computers can't read English, so we turn every word into a number using TF-IDF. Words that appear often in fake news (like \"secret\", \"shocking\", \"they don't want you to know\") get flagged as important signals.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'ML model makes a decision',
    body: 'A trained machine learning model (Passive Aggressive Classifier) looks at those numbers and compares them to patterns it learned from 40,000+ real and fake articles. It votes: REAL or FAKE.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'You see the result',
    body: 'You get a clear verdict — Likely Real or Likely Fake — along with a confidence score. The result and your article are saved to a local database so you can review your history.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const whyPoints = [
  {
    title: 'Why TF-IDF?',
    body: "TF-IDF stands for Term Frequency–Inverse Document Frequency. It's a clever way to find words that are unusually common in fake news but rare in real news. These \"signal words\" are the key to detection.",
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
  },
  {
    title: 'Why Passive Aggressive Classifier?',
    body: 'PAC is a machine learning algorithm that is very good at text classification. It learns from mistakes — when it predicts wrong, it "aggressively" corrects itself. It reaches 94–96% accuracy on news data.',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
  },
  {
    title: 'Why store in SQLite?',
    body: 'SQLite is a lightweight database that stores all your past analyses in a single file on your computer. No cloud required. You can review every article you have ever checked.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    title: 'What are the limitations?',
    body: "No AI model is 100% accurate. This tool is trained on English-language news datasets. It's best used as a first filter — always verify important claims from primary sources.",
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        padding: '64px 24px 48px',
        textAlign: 'center',
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border)',
            borderRadius: '99px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--cyan-dark)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            Plain English explanation
          </div>
          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '14px',
            lineHeight: 1.15,
          }}>
            How does TruthLens work?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
            No jargon. Here is exactly what happens the moment you paste an article — from your browser all the way to the result.
          </p>
        </div>
      </section>

      {/* Flow Diagram — SVG */}
      <section style={{ padding: '56px 24px 40px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          The full flow at a glance
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px' }}>
          From your browser to the database — every step in order
        </p>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox="0 0 860 320"
            width="100%"
            style={{ display: 'block', maxWidth: '860px', margin: '0 auto' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M1,1 L7,4 L1,7" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* Node 1: User */}
            <g className="flow-node">
              <rect x="20" y="100" width="120" height="60" rx="12" fill="#ecfeff" stroke="#a5f3fc" strokeWidth="1.5"/>
              <text x="80" y="124" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#155e75">YOU</text>
              <text x="80" y="140" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#0891b2">Paste article</text>
              <text x="80" y="152" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#0891b2">in browser</text>
            </g>

            {/* Arrow 1→2 */}
            <line x1="142" y1="130" x2="178" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="160" y="122" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">HTTP POST</text>

            {/* Node 2: Next.js */}
            <g className="flow-node">
              <rect x="180" y="100" width="120" height="60" rx="12" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5"/>
              <text x="240" y="124" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#5b21b6">NEXT.JS</text>
              <text x="240" y="140" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#7c3aed">Frontend UI</text>
              <text x="240" y="152" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#7c3aed">Sends request</text>
            </g>

            {/* Arrow 2→3 */}
            <line x1="302" y1="130" x2="338" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="320" y="122" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">JSON API</text>

            {/* Node 3: FastAPI */}
            <g className="flow-node">
              <rect x="340" y="88" width="130" height="84" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
              <text x="405" y="112" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#1e3a8a">FASTAPI</text>
              <text x="405" y="128" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#2563eb">Receives text</text>
              <text x="405" y="142" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#2563eb">Cleans it</text>
              <text x="405" y="156" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#2563eb">Runs ML model</text>
            </g>

            {/* Arrow 3→4 (NLP) going down */}
            <line x1="405" y1="174" x2="405" y2="208" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="430" y="194" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">TF-IDF</text>

            {/* Node 4: NLP Pipeline */}
            <g className="flow-node">
              <rect x="330" y="210" width="150" height="60" rx="12" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5"/>
              <text x="405" y="234" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#92400e">NLP PIPELINE</text>
              <text x="405" y="250" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#b45309">Vectorize → Classify</text>
              <text x="405" y="262" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#b45309">REAL or FAKE</text>
            </g>

            {/* Arrow 3→5 SQLite going right from FastAPI */}
            <line x1="470" y1="130" x2="518" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="494" y="122" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Save result</text>

            {/* Node 5: SQLite */}
            <g className="flow-node">
              <rect x="520" y="100" width="120" height="60" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
              <text x="580" y="124" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#14532d">SQLITE</text>
              <text x="580" y="140" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#15803d">Stores: text,</text>
              <text x="580" y="152" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#15803d">label, score, date</text>
            </g>

            {/* Arrow 5→6 Result going right */}
            <line x1="642" y1="130" x2="680" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="661" y="122" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Response</text>

            {/* Node 6: Result */}
            <g className="flow-node">
              <rect x="682" y="100" width="130" height="60" rx="12" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1.5"/>
              <text x="747" y="122" textAnchor="middle" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="11" fill="#134e4a">RESULT</text>
              <text x="747" y="138" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#0d9488">REAL or FAKE</text>
              <text x="747" y="150" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#0d9488">+ Confidence %</text>
              <text x="747" y="162" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#0d9488">shown to you</text>
            </g>

            {/* model.pkl note below NLP */}
            <rect x="330" y="285" width="150" height="28" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1"/>
            <text x="405" y="297" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#dc2626">model.pkl loaded at startup</text>
            <text x="405" y="308" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#dc2626">Trained on 40k+ articles</text>

            {/* Labels */}
            <text x="80" y="195" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Browser</text>
            <text x="240" y="195" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Frontend</text>
            <text x="405" y="78" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Backend</text>
            <text x="580" y="195" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Database</text>
            <text x="747" y="195" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#94a3b8">Output</text>
          </svg>
        </div>
      </section>

      {/* Step by step */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '16px 24px 56px' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}>
          Step by step
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '36px' }}>
          What actually happens inside the system
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
              {/* Left timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '44px', flexShrink: 0 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--bg-muted)',
                  border: '1.5px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-dark)',
                  flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '24px',
                    background: 'var(--border-subtle)',
                    margin: '4px 0',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: i < steps.length - 1 ? '28px' : '0', paddingTop: '10px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'var(--border)',
                    letterSpacing: '0.05em',
                  }}>
                    {step.num}
                  </span>
                  <h3 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  maxWidth: '560px',
                }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section style={{
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '56px 24px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}>
            Why these choices?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px' }}>
            The reasoning behind every technology in the stack
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '14px',
          }}>
            {whyPoints.map(point => (
              <div key={point.title} style={{
                background: point.bg,
                border: `1px solid ${point.border}`,
                borderRadius: '14px',
                padding: '20px 22px',
              }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: point.color,
                  marginBottom: '8px',
                }}>
                  {point.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                }}>
                  {point.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '56px 24px', maxWidth: '760px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '6px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          The tech stack
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px' }}>
          Every tool used and what role it plays
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { layer: 'Frontend', tech: 'Next.js 14 + TypeScript', role: 'The website you see and interact with. Sends your article to the backend.', color: '#5b21b6', bg: '#f5f3ff', border: '#ddd6fe' },
            { layer: 'Styling', tech: 'Tailwind CSS + Custom CSS', role: 'Makes the website look clean and respond properly on all screen sizes.', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
            { layer: 'Backend', tech: 'FastAPI (Python)', role: 'The brain that receives articles, runs the ML model, and returns the result. Very fast.', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
            { layer: 'NLP', tech: 'scikit-learn TF-IDF', role: 'Converts article text into numbers that the ML model can understand.', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
            { layer: 'ML Model', tech: 'Passive Aggressive Classifier', role: 'Trained on 40k+ articles. Classifies text as REAL or FAKE with ~95% accuracy.', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
            { layer: 'Database', tech: 'SQLite + SQLAlchemy', role: 'A lightweight local database file that stores every analysis you run for later review.', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
          ].map(row => (
            <div key={row.layer} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px 18px',
              background: row.bg,
              border: `1px solid ${row.border}`,
              borderRadius: '12px',
            }}>
              <div style={{
                minWidth: '90px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: row.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingTop: '2px',
              }}>
                {row.layer}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '3px',
                }}>
                  {row.tech}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {row.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}