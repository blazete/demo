import type { Defect, EvidenceAsset, Scenario } from '../../data/types';
import { EvidenceGallery } from './EvidenceGallery';

export function EvidenceCard({ defect, evidence, scenario, onClose, isVisible }: {
  defect: Defect | null; evidence: EvidenceAsset[]; scenario: Scenario | null;
  onClose: () => void; isVisible: boolean;
}) {
  if (!isVisible || !defect) return null;
  return (
    <div style={{ position: 'absolute', right: 20, top: 60, width: 380, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', background: 'rgba(11,31,51,0.92)', backdropFilter: 'blur(12px)', borderRadius: 12, border: '1px solid rgba(44,186,232,0.2)', pointerEvents: 'auto', zIndex: 20 }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#D94B3D', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginBottom: 4 }}>⚠ Potential defect identified</div>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: '#F2EFE6', fontWeight: 600, margin: 0 }}>{defect.defectType}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#73797D', cursor: 'pointer', padding: 4, fontSize: 18 }} aria-label="Close">✕</button>
      </div>
      <div style={{ padding: '12px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          {([['Coach', defect.location.coachId], ['Location', `${defect.location.bogiePosition ? defect.location.bogiePosition[0].toUpperCase() + defect.location.bogiePosition.slice(1) + ' bogie' : ''} · ${defect.location.side ? defect.location.side[0].toUpperCase() + defect.location.side.slice(1) + ' side' : ''}`],
          ['Component', defect.location.positionLabel || defect.location.componentType], ['Severity', defect.severity === 'review_required' ? '🟡 Review required' : defect.severity],
          ['Time', (() => { try { const d = new Date(defect.detectedAt); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')} IST`; } catch { return defect.detectedAt; } })()],
          ['Evidence', `${evidence.length} items`], ['Review', defect.reviewStatus === 'prepared' ? 'Alert prepared' : defect.reviewStatus]
          ] as [string, string][]).map(([l, v]) => (
            <tr key={l}><td style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#73797D', padding: '4px 0', width: 90 }}>{l}</td><td style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#F2EFE6', padding: '4px 0' }}>{v}</td></tr>
          ))}
        </tbody></table>
      </div>
      {scenario?.mode === 'simulated' && <div style={{ margin: '0 20px', padding: '8px 12px', background: 'rgba(242,181,68,0.1)', borderRadius: 6, border: '1px solid rgba(242,181,68,0.2)' }}><span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#F2B544' }}>Simulated demonstration — not from live inspection</span></div>}
      <div style={{ padding: '12px 20px' }}><EvidenceGallery evidence={evidence} /></div>
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CBAE8" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#2CBAE8' }}>Alert prepared for railway review</span>
      </div>
    </div>
  );
}
