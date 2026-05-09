'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Result {
  id: number;
  label: 'REAL' | 'FAKE';
  confidence: number;
  confidence_pct: string;
  word_count: number;
  verdict: string;
  created_at: string;
}

const EXAMPLE_FAKE = `BREAKING: Scientists discover that drinking coffee made from moon rocks can cure any disease. NASA has confirmed that astronauts who consumed lunar soil extract showed 100% immunity to all known viruses. The government has been hiding this secret for 50 years and pharmaceutical companies are paying millions to suppress this information.`;

const EXAMPLE_REAL = `Researchers at Stanford University have published a new study in the journal Nature showing that regular aerobic exercise can reduce the risk of cardiovascular disease by up to 35%. The study followed 12,000 participants over 10 years and was peer-reviewed by independent scientists. Participants who exercised at least 150 minutes per week showed significantly improved heart health markers.`;

export default function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    if (text.trim().length < 20) {
      setError('Please enter at least a few sentences of text.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Something went wrong.');
      }

      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not connect to the server. Make sure the backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText('');
    setResult(null);
    setError('');
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* Hero */}
      <section className="grid-bg noise" style={{
        position: 'relative',
        padding: '72px 24px 64px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {/* Glow blob */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border)',
            borderRadius: '99px',
            padding: '4px 14px',
            marginBottom: '24px',
            fontSize: '0.78rem',
            color: 'var(--cyan-dark)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan-mid)', display: 'inline-block' }} />
            NLP-Powered Analysis
          </div>

          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Is this news{' '}
            <span style={{
              color: 'var(--cyan-dark)',
              position: 'relative',
            }}>
              real or fake?
            </span>
          </h1>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1.05rem',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Paste any news article or paragraph below. Our machine learning model analyses
            the language patterns and tells you if it looks credible.
          </p>
        </div>
      </section>

      {/* Main analyser */}
      <section style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Text area card */}
        <div className="card" style={{ padding: '28px', marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <label style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Article text
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste or type a news article here…"
            rows={10}
            style={{
              width: '100%',
              resize: 'vertical',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '0.95rem',
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--text-primary)',
              background: 'var(--bg-subtle)',
              outline: 'none',
              lineHeight: 1.7,
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan-mid)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          {/* Example buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try an example:</span>
            <button
              onClick={() => { setText(EXAMPLE_FAKE); setResult(null); setError(''); }}
              style={{
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '99px',
                border: '1px solid #fca5a5',
                background: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Fake article sample
            </button>
            <button
              onClick={() => { setText(EXAMPLE_REAL); setResult(null); setError(''); }}
              style={{
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '99px',
                border: '1px solid #99f6e4',
                background: '#f0fdfa',
                color: '#0d9488',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Real article sample
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading || text.trim().length < 10}
            style={{
              flex: 1,
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: text.trim().length < 10 ? '#e0f2fe' : 'linear-gradient(135deg, #22d3ee, #0891b2)',
              color: text.trim().length < 10 ? '#94a3b8' : 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: text.trim().length < 10 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.15s ease',
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Analysing…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analyse Article
              </>
            )}
          </button>

          {(text || result) && (
            <button
              onClick={handleReset}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                background: 'white',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#dc2626',
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-slide-up" style={{
            background: result.label === 'REAL' ? '#f0fdfa' : '#fef2f2',
            border: `1.5px solid ${result.label === 'REAL' ? '#99f6e4' : '#fca5a5'}`,
            borderRadius: '16px',
            padding: '28px',
            animation: 'slideUp 0.4s ease-out',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: result.label === 'REAL' ? '#ccfbf1' : '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {result.label === 'REAL' ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h2 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: result.label === 'REAL' ? '#0d9488' : '#dc2626',
                    letterSpacing: '-0.02em',
                  }}>
                    {result.label === 'REAL' ? 'Likely Real' : 'Likely Fake'}
                  </h2>
                  <span className={result.label === 'REAL' ? 'badge-real' : 'badge-fake'}>
                    {result.label}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {result.verdict}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '16px',
            }}>
              {[
                { label: 'Confidence', value: result.confidence_pct },
                { label: 'Words analysed', value: result.word_count.toString() },
                { label: 'Prediction ID', value: `#${result.id}` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Confidence bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model confidence</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{result.confidence_pct}</span>
              </div>
              <div className="confidence-bar">
                <div
                  className="confidence-bar-fill"
                  style={{
                    width: result.confidence_pct,
                    background: result.label === 'REAL'
                      ? 'linear-gradient(90deg, #2dd4bf, #0d9488)'
                      : 'linear-gradient(90deg, #f87171, #dc2626)',
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              This is a machine learning prediction based on language patterns. Always cross-check with trusted sources.
            </p>
          </div>
        )}

        {/* How it works teaser */}
        {!result && !loading && (
          <div style={{
            marginTop: '40px',
            padding: '20px 24px',
            background: 'var(--bg-subtle)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px' }}>
                Curious how this works?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Learn about the NLP pipeline and ML model behind the scenes.
              </p>
            </div>
            <Link href="/how-it-works" style={{
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              color: 'var(--cyan-dark)',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              See the flow →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
