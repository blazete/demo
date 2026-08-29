import { useMemo, useState } from 'react';
import type { EvidenceAsset } from '../../data/types';

const LABELS: Record<EvidenceAsset['kind'], string> = {
  inspection_image: 'Inspection image',
  inspection_snapshot: 'Inspection snapshot',
  defect_snapshot: 'Defect snapshot',
  report: 'Inspection report',
};

export function EvidenceGallery({ evidence }: { evidence: EvidenceAsset[] }) {
  const [selectedId, setSelectedId] = useState(evidence[0]?.evidenceId ?? '');
  const selected = useMemo(() => evidence.find((item) => item.evidenceId === selectedId) ?? evidence[0], [evidence, selectedId]);
  if (!evidence.length) return <p style={{ color: '#73797D', fontSize: 12, margin: 0 }}>No evidence was generated for this inspection.</p>;
  return (
    <div aria-label="Inspection evidence">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {evidence.map((item) => <button key={item.evidenceId} type="button" onClick={() => setSelectedId(item.evidenceId)} aria-pressed={selected?.evidenceId === item.evidenceId}
          style={{ border: selected?.evidenceId === item.evidenceId ? '1px solid #2CBAE8' : '1px solid rgba(255,255,255,0.12)', borderRadius: 6, background: selected?.evidenceId === item.evidenceId ? 'rgba(44,186,232,0.15)' : 'transparent', color: '#F2EFE6', padding: '6px 8px', fontSize: 11, cursor: 'pointer' }}>
          {LABELS[item.kind]}
        </button>)}
      </div>
      {selected?.kind === 'report' ? (
        <div style={{ padding: 12, background: 'rgba(242,239,230,0.08)', borderRadius: 6, color: '#F2EFE6', fontSize: 12, lineHeight: 1.5 }}>
          Inspection report prepared for railway review. This is a simulated demonstration record.
        </div>
      ) : selected?.contentUrl || selected?.thumbnailUrl ? (
        <img src={selected.contentUrl ?? selected.thumbnailUrl} alt={selected.alt} style={{ width: '100%', display: 'block', borderRadius: 6, objectFit: 'cover' }} />
      ) : (
        <div role="status" style={{ padding: 20, border: '1px dashed rgba(242,239,230,0.2)', borderRadius: 6, color: '#73797D', fontSize: 12 }}>Evidence image will be available when connected media is provided.</div>
      )}
    </div>
  );
}
