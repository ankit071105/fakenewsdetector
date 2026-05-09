import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'TruthLens — Fake News Detector',
  description: 'AI-powered fake news detection using Natural Language Processing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main>{children}</main>
        <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
            TruthLens uses NLP + Machine Learning. Results are indicative, not definitive. Always verify from primary sources.
          </p>
          <p style={{ color: 'var(--border)', fontSize: '0.75rem', marginTop: '8px' }}>
            Built with Next.js · FastAPI · SQLite · scikit-learn
          </p>
        </footer>
      </body>
    </html>
  );
}
