import type { Scenario } from '../../data/types';

export function AccessibleWalkthrough({ scenario, onClose, onReplay }: { scenario: Scenario; onClose: () => void; onReplay: () => void }) {
  const defect = scenario.defects[0];
  return (
    <main role="main" aria-labelledby="walkthrough-title" style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: '#0B1F33', color: '#F2EFE6', padding: 'clamp(24px, 6vw, 80px)', zIndex: 120 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ color: '#2CBAE8', letterSpacing: 2, fontSize: 12, textTransform: 'uppercase' }}>Accessible inspection walkthrough</p>
        <h1 id="walkthrough-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)', margin: '12px 0' }}>Trackside inspection, explained.</h1>
        <p style={{ color: '#CBD3D8', lineHeight: 1.7 }}>This 2D walkthrough describes the same simulated MVIS inspection without requiring a 3D renderer.</p>
        <ol style={{ paddingLeft: 22, lineHeight: 1.8 }}>
          <li><strong>Standby:</strong> The open trackside inspection array is ready and the track is clear.</li>
          <li><strong>Approach:</strong> Train {scenario.trainRun.trainId} approaches the camera and lighting zone.</li>
          <li><strong>Activation:</strong> Warning indicators and inspection lights activate.</li>
          <li><strong>Inspection:</strong> Wheels, springs, brakes, and bogies are reviewed coach by coach.</li>
          <li><strong>Result:</strong> {defect ? `A ${defect.defectType} was identified on coach ${defect.location.coachId}.` : 'No defects were identified.'}</li>
        </ol>
        {defect && <section aria-labelledby="walkthrough-result" style={{ marginTop: 28, padding: 20, border: '1px solid rgba(44,186,232,0.35)', borderRadius: 8 }}>
          <h2 id="walkthrough-result" style={{ marginTop: 0 }}>Review required</h2>
          <p>{defect.defectType} · Coach {defect.location.coachId} · Severity: {defect.severity}</p>
          <p>Evidence: {defect.evidenceIds.length} items. Alert prepared for railway review.</p>
        </section>}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
          <button type="button" onClick={onClose} style={{ padding: '12px 18px', background: '#2CBAE8', color: '#0B1F33', border: 0, borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Return to 3D view</button>
          <button type="button" onClick={onReplay} style={{ padding: '12px 18px', background: 'transparent', color: '#F2EFE6', border: '1px solid rgba(242,239,230,0.3)', borderRadius: 6, cursor: 'pointer' }}>Replay walkthrough</button>
        </div>
        <p style={{ marginTop: 40, color: '#F2B544', fontSize: 12 }}>Simulated demonstration — not from live inspection.</p>
      </div>
    </main>
  );
}
