import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EquipmentId } from '../../data/equipment/equipmentRegistry';
import { EquipmentMarker } from '../selection/EquipmentMarker';

interface Props {
  visible: boolean;
  pulse: number;
  selectedEquipmentId: EquipmentId | null;
  onEquipmentSelect: (id: EquipmentId) => void;
}

const SENSOR_POSITIONS = [
  { id: 'SENSOR-ENTRY' as const, z: 7, label: 'ENTRY SENSOR' },
  { id: 'SENSOR-EXIT' as const, z: -7, label: 'EXIT SENSOR' },
];

export function TriggerSensorSystem({ visible, pulse, selectedEquipmentId, onEquipmentSelect }: Props) {
  const beamMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const signalMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const pulseStarted = useRef(-Infinity);
  useEffect(() => { if (pulse > 0) pulseStarted.current = performance.now(); }, [pulse]);
  useFrame(({ clock }) => {
    const pulsing = performance.now() - pulseStarted.current < 1900;
    if (!beamMaterial.current) return;
    beamMaterial.current.opacity = pulsing ? 0.55 + Math.sin(clock.elapsedTime * 14) * 0.25 : 0.16;
    signalMaterials.current.forEach(material => { material.emissiveIntensity = pulsing ? 3.2 : 0.35; });
  });
  if (!visible) return null;

  return (
    <group name="proposed-trigger-sensor-system">
      {SENSOR_POSITIONS.map(sensor => (
        <group
          key={sensor.id}
          name={sensor.id}
          position={[0, 0, sensor.z]}
          onClick={(event) => { event.stopPropagation(); onEquipmentSelect(sensor.id); }}
          onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          {[-0.838, 0.838].map(x => (
            <group key={x} position={[x, 0.22, 0]}>
              <mesh castShadow><boxGeometry args={[0.2, 0.12, 0.34]} /><meshStandardMaterial color="#d4a72c" roughness={0.42} metalness={0.55} /></mesh>
              <mesh position={[0, 0.075, 0]}><boxGeometry args={[0.12, 0.018, 0.18]} /><meshStandardMaterial ref={(material) => { if (material && !signalMaterials.current.includes(material)) signalMaterials.current.push(material); }} color="#ffdd62" emissive="#f2b544" emissiveIntensity={0.35} toneMapped={false} /></mesh>
            </group>
          ))}
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[1.68, 0.018, 0.035]} />
            <meshBasicMaterial ref={beamMaterial} color="#f2b544" transparent opacity={0.16} depthWrite={false} toneMapped={false} />
          </mesh>
          {selectedEquipmentId === sensor.id && <EquipmentMarker label={sensor.label} position={[0, 0.55, 0]} />}
        </group>
      ))}
      <group position={[3.15, 0, 0.72]} name="RELAY-CABINET-SIGNAL">
        <mesh position={[0, 1.15, 0.26]}><sphereGeometry args={[0.055, 14, 14]} /><meshStandardMaterial color="#70f0b0" emissive="#39c985" emissiveIntensity={0.7} toneMapped={false} /></mesh>
        {selectedEquipmentId === 'RELAY-CABINET' && <EquipmentMarker label="RELAY CABINET" position={[0, 1.55, 0]} />}
      </group>
    </group>
  );
}
