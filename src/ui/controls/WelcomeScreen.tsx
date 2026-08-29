import { useState } from 'react';
import type { ScenarioId } from '../../data/types';

export function WelcomeScreen({ onStart, onOpenFallback, loadingProgress, isLoading }: { onStart: (s: ScenarioId) => void; onOpenFallback: () => void; loadingProgress: number; isLoading: boolean }) {
  const [sel, setSel] = useState<ScenarioId>('spring-defect-day');
  if (isLoading) return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0B1F33', zIndex: 100 }}>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#2CBAE8', letterSpacing: '2px', marginBottom: 32 }}>MVIS</div>
      <div style={{ width: 240, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ width: `${Math.min(loadingProgress * 100, 100)}%`, height: '100%', background: '#2CBAE8', borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#73797D' }}>
        {loadingProgress < 0.3 ? 'Preparing railway site…' : loadingProgress < 0.6 ? 'Loading inspection portal…' : loadingProgress < 0.9 ? 'Preparing train…' : 'Almost ready…'}
      </div>
    </div>
  );

  const scenarios: [ScenarioId, string][] = [['spring-defect-day', 'Spring defect · Day'], ['clean-day', 'Clean inspection · Day'], ['clean-night', 'Night inspection'], ['spring-defect-weather', 'Spring defect · Rain']];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0B1F33, #152D45, #0B1F33)', zIndex: 100 }}>
      <div style={{ maxWidth: 540, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#2CBAE8', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16 }}>Machine Vision Inspection System</div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 700, color: '#F2EFE6', margin: '0 0 12px', lineHeight: 1.2 }}>Trackside inspection, explained.</h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#73797D', lineHeight: 1.6, margin: '0 0 32px' }}>Experience how MVIS inspects a moving train and turns a detected defect into reviewable evidence.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {scenarios.map(([id, label]) => (
            <button key={id} onClick={() => setSel(id)} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, padding: '8px 14px', borderRadius: 8, border: sel === id ? '1px solid #2CBAE8' : '1px solid rgba(255,255,255,0.1)', background: sel === id ? 'rgba(44,186,232,0.15)' : 'rgba(255,255,255,0.03)', color: sel === id ? '#2CBAE8' : '#73797D', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
        <button onClick={() => onStart(sel)} style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 600, padding: '14px 40px', borderRadius: 10, border: 'none', background: '#2CBAE8', color: '#0B1F33', cursor: 'pointer', marginBottom: 16 }}>Begin inspection</button>
        <div><button onClick={onOpenFallback} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, background: 'none', border: 'none', color: '#73797D', cursor: 'pointer', textDecoration: 'underline', padding: 8 }}>View accessible walkthrough</button></div>
        <div style={{ marginTop: 48, fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(115,121,125,0.5)', letterSpacing: '0.5px' }}>Simulated demonstration · Not from live inspection</div>
      </div>
    </div>
  );
}
