import type { PortalState, InspectionProgress } from '../../data/types';

export function HUD({ portalState, progress, isGuided, scenarioId }: {
  portalState: PortalState; progress: InspectionProgress; isGuided: boolean; scenarioId: string;
}) {
  const statusColor = portalState === 'active' ? '#2CBAE8' : portalState === 'preparing' ? '#F2B544' : portalState === 'defect_detected' ? '#D94B3D' : '#73797D';
  const statusLabel = portalState === 'active' ? 'Portal active' : portalState === 'preparing' ? 'Preparing inspection' : portalState === 'defect_detected' ? 'Review required' : 'Portal standby';
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 10 }}>
      <div className="mvis-hud-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(11,31,51,0.85)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#F2EFE6', letterSpacing: '0.5px' }}>MVIS</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#F2EFE6', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
            {statusLabel}
          </span>
        </div>
        <div className="mvis-scenario-id" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#73797D' }}>{scenarioId.replace(/-/g, ' ').toUpperCase()}</div>
      </div>
      {isGuided && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(11,31,51,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '10px 16px', minWidth: 180 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#73797D', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Coach {progress.currentCoach} · {progress.coachesInspected}/{progress.totalCoaches}
            </div>
            <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(progress.coachesInspected / Math.max(progress.totalCoaches, 1)) * 100}%`, height: '100%', background: '#2CBAE8', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ background: 'rgba(11,31,51,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#73797D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inspecting</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#2CBAE8', fontWeight: 500, marginTop: 2 }}>{progress.activeComponent || '—'}</div>
          </div>
          {progress.defectsFound > 0 && (
            <div style={{ background: 'rgba(217,75,61,0.9)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EFE6" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#F2EFE6', fontWeight: 500 }}>{progress.defectsFound} review item{progress.defectsFound > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
