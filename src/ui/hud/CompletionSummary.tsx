import type { Scenario, Defect } from '../../data/types';

export function CompletionSummary({ scenario, defects, coachCount, isVisible, onExplore, onReviewEvidence, onReplay }: {
  scenario: Scenario; defects: Defect[]; coachCount: number; isVisible: boolean;
  onExplore: () => void; onReviewEvidence: () => void; onReplay: () => void;
}) {
  if (!isVisible) return null;
  const evCount = defects.reduce((a, d) => a + d.evidenceIds.length, 0);
  return (
    <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 340, background: 'rgba(11,31,51,0.92)', backdropFilter: 'blur(12px)', borderRadius: 12, border: '1px solid rgba(44,186,232,0.2)', zIndex: 20, pointerEvents: 'auto' }}>
      <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#2CBAE8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginBottom: 6 }}>✓ Inspection complete</div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, color: '#F2EFE6', fontWeight: 600, margin: 0 }}>Summary</h2>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          {([['Train', scenario.trainRun.trainId], ['Coaches', `${coachCount}`], ['Components', 'Wheels, Springs, Brakes, Bogies'], ['Defects', `${defects.length}`], ['Evidence', `${evCount} items`], ['Alert', defects.length > 0 ? 'Alert prepared' : 'No defects']] as [string, string][]).map(([l, v]) => (
            <tr key={l}><td style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#73797D', padding: '6px 0', width: 100 }}>{l}</td><td style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: l === 'Defects' && defects.length > 0 ? '#D94B3D' : '#F2EFE6', fontWeight: l === 'Defects' && defects.length > 0 ? 600 : 400, padding: '6px 0' }}>{v}</td></tr>
          ))}
        </tbody></table>
      </div>
      <div style={{ padding: '12px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={onExplore} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 16px', borderRadius: 8, border: 'none', background: '#2CBAE8', color: '#0B1F33', cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>Explore the site</button>
        {defects.length > 0 && <button onClick={onReviewEvidence} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#F2EFE6', cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}>Review evidence</button>}
        <button onClick={onReplay} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, padding: '10px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: '#73797D', cursor: 'pointer', fontWeight: 500, textAlign: 'left' }}>Replay another scenario</button>
      </div>
    </div>
  );
}
