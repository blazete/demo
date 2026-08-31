import { useMemo, useState } from 'react';
import { EQUIPMENT_REGISTRY } from '../../data/equipment/equipmentRegistry';
import type { EquipmentCategory, EquipmentId } from '../../data/equipment/equipmentRegistry';

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  cameras: 'Inspection Cameras', lighting: 'Lighting', detection: 'Detection', control: 'Control Equipment',
};

export function EquipmentMenu({ open, selectedId, onClose, onSelect }: { open: boolean; selectedId: EquipmentId | null; onClose: () => void; onSelect: (id: EquipmentId) => void }) {
  const [query, setQuery] = useState('');
  const grouped = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = EQUIPMENT_REGISTRY.filter(item => !normalized || `${item.id} ${item.name} ${item.purpose}`.toLowerCase().includes(normalized));
    return (Object.keys(CATEGORY_LABELS) as EquipmentCategory[]).map(category => ({ category, items: filtered.filter(item => item.category === category) })).filter(group => group.items.length);
  }, [query]);
  if (!open) return null;

  return (
    <aside className="mvis-equipment-menu" aria-label="Site equipment menu">
      <div className="mvis-operator-heading"><div><span>MVIS DIGITAL TWIN</span><h2>Site Equipment</h2></div><button onClick={onClose} aria-label="Close equipment menu">×</button></div>
      <input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search site equipment" placeholder="Search camera, light or sensor…" />
      <div className="mvis-equipment-scroll">
        {grouped.map(group => <section key={group.category}><h3>{CATEGORY_LABELS[group.category]}</h3>{group.items.map(item => (
          <button key={item.id} className={selectedId === item.id ? 'selected' : ''} onClick={() => onSelect(item.id)}>
            <span className={`mvis-equipment-dot ${item.kind}`} /><span><strong>{item.shortName}</strong><small>{item.name.replace(`${item.shortName} `, '')}</small></span><em>{item.proposed ? 'PROPOSED' : 'READY'}</em>
          </button>
        ))}</section>)}
      </div>
    </aside>
  );
}
