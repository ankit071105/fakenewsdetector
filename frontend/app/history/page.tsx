'use client';
import { useState, useEffect } from 'react';

interface Record {
  id: number;
  label: 'REAL' | 'FAKE';
  confidence: number;
  confidence_pct: string;
  word_count: number;
  text_snippet: string;
  created_at: string;
}

interface Stats {
  total: number;
  real_count: number;
  fake_count: number;
  real_pct: number;
  fake_pct: number;
  avg_confidence: number;
}

function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function HistoryPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      const [histRes, statsRes] = await Promise.all([
        fetch('/api/history?limit=50'),
        fetch('/api/stats'),
      ]);
      if (!histRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');
      const hist = await histRes.json();
      const st = await statsRes.json();
      setRecords(hist);
      setStats(st);
    } catch {
      setError('Could not load history. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/predictions/${id}`, { method: 'DELETE' });
    setRecords(prev => prev.filter(r => r.id !== id));
    fetchData();
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '8px',
        }}>
          Analysis history
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Every article you've analysed, stored locally in SQLite.
        </p>
      </div>

      {/* Stats cards */}
      {stats && stats.total > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Total analysed', value: stats.total.toString(), color: 'var(--cyan-dark)' },
            { label: 'Identified real', value: `${stats.real_count} (${stats.real_pct}%)`, color: '#0d9488' },
            { label: 'Identified fake', value: `${stats.fake_count} (${stats.fake_pct}%)`, color: '#dc2626' },
            { label: 'Avg confidence', value: `${stats.avg_confidence}%`, color: 'var(--text-secondary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'white',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                {label}
              </p>
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: '1.15rem',
                color,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Loading history…
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '12px',
          padding: '20px',
          color: '#dc2626',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-subtle)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>No analyses yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Go to the home page and analyse your first article.
          </p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {records.map(record => (
            <div key={record.id} className="card" style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}>
              {/* Badge */}
              <div style={{
                flexShrink: 0,
                paddingTop: '2px',
              }}>
                <span className={record.label === 'REAL' ? 'badge-real' : 'badge-fake'}>
                  {record.label}
                </span>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  marginBottom: '6px',
                }}>
                  {record.text_snippet}
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {record.confidence_pct} confidence
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {record.word_count} words
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {timeAgo(record.created_at)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--border)', fontFamily: "'JetBrains Mono', monospace" }}>
                    #{record.id}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(record.id)}
                style={{
                  flexShrink: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--border)',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--border)')}
                aria-label="Delete"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
