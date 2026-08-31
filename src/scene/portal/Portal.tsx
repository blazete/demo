import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EquipmentId } from '../../data/equipment/equipmentRegistry';
import type { PortalState } from '../../data/types';
import { createRailwayMaterialPalette, disposeRailwayMaterialPalette } from '../materials/railwayMaterials';
import { EquipmentMarker } from '../selection/EquipmentMarker';
import { BROAD_GAUGE, INSPECTION_LAYOUT, INSPECTION_LENGTH } from './inspectionLayout';
import { LineScanCameraAssembly } from './LineScanCameraAssembly';

interface PortalProps {
  portalState: PortalState;
  paused?: boolean;
  selectedEquipmentId?: EquipmentId | null;
  lightsEnabled?: boolean;
  coverageEnabled?: boolean;
  onEquipmentSelect?: (id: EquipmentId) => void;
}

export function Portal({ portalState, paused = false, selectedEquipmentId = null, lightsEnabled = true, coverageEnabled = false, onEquipmentSelect }: PortalProps) {
  const materials = useMemo(() => createRailwayMaterialPalette(), []);
  useEffect(() => () => disposeRailwayMaterialPalette(materials), [materials]);
  const active = portalState === 'active' || portalState === 'defect_detected';
  const defect = portalState === 'defect_detected';

  return (
    <group name="open-mvis-inspection-array">
      <InspectionBed active={active} defect={defect} lightsEnabled={lightsEnabled} selected={selectedEquipmentId === 'TRACK-LED-ARRAY'} onSelect={onEquipmentSelect} />
      {INSPECTION_LAYOUT.poles.map((pole) => <AdjustablePole key={pole.id} position={[...pole.position]} side={pole.side} materials={materials} />)}
      <SideLightingRails active={active} defect={defect} materials={materials} lightsEnabled={lightsEnabled} selectedEquipmentId={selectedEquipmentId} onSelect={onEquipmentSelect} />
      {INSPECTION_LAYOUT.cameras.map((camera) => <AreaScanCamera key={camera.id} camera={camera} active={active} defect={defect} materials={materials} selected={selectedEquipmentId === camera.id} onSelect={onEquipmentSelect} />)}
      <LineScanPit active={active} defect={defect} lightsEnabled={lightsEnabled} selected={selectedEquipmentId === 'CAM-5'} onSelect={onEquipmentSelect} />
      <CoverageVolumes active={active || coverageEnabled} defect={defect} paused={paused} />
      <ServiceEquipment materials={materials} selected={selectedEquipmentId === 'RELAY-CABINET'} onSelect={onEquipmentSelect} />
    </group>
  );
}

export const InspectionArray = Portal;
type Palette = ReturnType<typeof createRailwayMaterialPalette>;

function InspectionBed({ active, defect, lightsEnabled, selected, onSelect }: { active: boolean; defect: boolean; lightsEnabled: boolean; selected: boolean; onSelect?: (id: EquipmentId) => void }) {
  return (
    <group>
      <mesh position={[0, -0.055, 0]} receiveShadow><boxGeometry args={[BROAD_GAUGE + 1.05, 0.12, INSPECTION_LENGTH + 0.5]} /><meshStandardMaterial color="#8f8b82" roughness={0.94} /></mesh>
      <group name="TRACK-LED-ARRAY" onClick={(event) => { event.stopPropagation(); onSelect?.('TRACK-LED-ARRAY'); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
        {INSPECTION_LAYOUT.railStrips.map((strip) => (
          <mesh key={strip.id} position={[...strip.position]}><boxGeometry args={[0.085, 0.035, INSPECTION_LENGTH]} /><meshStandardMaterial color={defect ? '#ef5b45' : '#ffe06a'} emissive={defect ? '#ef3d2f' : '#ffd84c'} emissiveIntensity={lightsEnabled ? (active ? 2.6 : 0.42) : 0.02} roughness={0.3} toneMapped={false} /></mesh>
        ))}
        {selected && <EquipmentMarker label="TRACK LED ARRAY" position={[0, 0.72, 0]} />}
      </group>
      {[-1, 1].map((side) => <group key={side} position={[side * (BROAD_GAUGE / 2 + 0.62), 0.015, 0]}>{[-1.3, -0.65, 0, 0.65, 1.3].map((z, index) => <mesh key={z} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[0.32, 0.58, 0.018]} /><meshStandardMaterial color={index % 2 ? '#171a19' : '#e4b626'} roughness={0.75} /></mesh>)}</group>)}
    </group>
  );
}

function AdjustablePole({ position, side, materials }: { position: [number, number, number]; side: -1 | 1; materials: Palette }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.34, 0.4, 0.16, 8]} /><primitive object={materials.concrete} attach="material" /></mesh>
      <mesh position={[0, 1.55, 0]} castShadow><cylinderGeometry args={[0.105, 0.14, 3, 12]} /><primitive object={materials.galvanizedSteel} attach="material" /></mesh>
      <mesh position={[-side * 0.38, 2.82, 0]} rotation={[0, 0, side * Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.75, 10]} /><primitive object={materials.galvanizedSteel} attach="material" /></mesh>
      <mesh position={[-side * 0.72, 2.82, 0]} castShadow><boxGeometry args={[0.64, 0.16, 0.42]} /><primitive object={materials.safetyYellow} attach="material" /></mesh>
      {[-0.2, -0.065, 0.065, 0.2].map((z) => <mesh key={z} position={[-side * 0.72, 2.73, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.025, 12]} /><primitive object={materials.led} attach="material" /></mesh>)}
    </group>
  );
}

function SideLightingRails({ materials, active, defect, lightsEnabled, selectedEquipmentId, onSelect }: { materials: Palette; active: boolean; defect: boolean; lightsEnabled: boolean; selectedEquipmentId: EquipmentId | null; onSelect?: (id: EquipmentId) => void }) {
  return <group>{[-1, 1].map((side) => <group key={side}>
    <mesh position={[side * 2.2, 2.16, 0]} castShadow><boxGeometry args={[0.1, 0.1, INSPECTION_LENGTH]} /><primitive object={materials.galvanizedSteel} attach="material" /></mesh>
    {INSPECTION_LAYOUT.sideLamps.filter((lamp) => Math.sign(lamp.position[0]) === side).map((lamp) => <group key={lamp.id} name={lamp.id} position={[lamp.position[0], 2.16, lamp.position[2]]} rotation={[0, side * -0.2, side * -0.12]} onClick={(event) => { event.stopPropagation(); onSelect?.(lamp.id as EquipmentId); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
      <mesh castShadow><boxGeometry args={[0.44, 0.24, 0.16]} /><primitive object={materials.safetyYellow} attach="material" /></mesh>
      <mesh position={[-side * 0.015, -0.02, -side * 0.09]}><boxGeometry args={[0.34, 0.13, 0.018]} /><meshStandardMaterial color={defect ? '#ff6454' : '#fff0a1'} emissive={defect ? '#ef3d2f' : '#ffd95a'} emissiveIntensity={lightsEnabled ? (active ? 2.2 : 0.38) : 0.02} toneMapped={false} /></mesh>
      {selectedEquipmentId === lamp.id && <EquipmentMarker label={lamp.id} position={[0, 0.58, 0]} />}
    </group>)}
  </group>)}</group>;
}

function AreaScanCamera({ camera, active, defect, materials, selected, onSelect }: { camera: typeof INSPECTION_LAYOUT.cameras[number]; active: boolean; defect: boolean; materials: Palette; selected: boolean; onSelect?: (id: EquipmentId) => void }) {
  const side = Math.sign(camera.position[0]);
  return <group name={camera.id} position={[...camera.position]} rotation={[...camera.rotation]} onClick={(event) => { event.stopPropagation(); onSelect?.(camera.id as EquipmentId); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}>
    <mesh castShadow><boxGeometry args={[0.52, camera.kind === 'upper' ? 0.42 : 0.35, 0.52]} /><primitive object={materials.paintedSteel} attach="material" /></mesh>
    <mesh position={[-side * 0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.13, 0.16, 0.12, 18]} /><primitive object={materials.rubber} attach="material" /></mesh>
    <mesh position={[-side * 0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.035, 20]} /><primitive object={materials.lens} attach="material" /></mesh>
    <mesh position={[side * 0.18, 0.15, 0.27]}><sphereGeometry args={[0.032, 10, 10]} /><meshStandardMaterial color={defect ? '#ff4f3e' : '#56d5ff'} emissive={defect ? '#ff301f' : '#2cbae8'} emissiveIntensity={active ? 3 : 0.15} toneMapped={false} /></mesh>
    <Cable side={side} materials={materials} />
    {selected && <EquipmentMarker label={camera.id} position={[0, 0.72, 0]} />}
  </group>;
}

function Cable({ side, materials }: { side: number; materials: Palette }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(side * 0.2, -0.16, 0.16), new THREE.Vector3(side * 0.42, -0.28, 0.18), new THREE.Vector3(side * 0.5, -0.52, 0.08)]), 12, 0.025, 6, false), [side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}><primitive object={materials.rubber} attach="material" /></mesh>;
}

function LineScanPit({ active, defect, lightsEnabled, selected, onSelect }: { active: boolean; defect: boolean; lightsEnabled: boolean; selected: boolean; onSelect?: (id: EquipmentId) => void }) {
  return <group>
    <LineScanCameraAssembly active={active} defect={defect} lightsEnabled={lightsEnabled} selected={selected} onSelect={onSelect} />
  </group>;
}

function CoverageVolumes({ active, defect, paused }: { active: boolean; defect: boolean; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (!group.current || paused) return; group.current.children.forEach((child, index) => { child.scale.y = 0.96 + Math.sin(clock.elapsedTime * 2.3 + index) * 0.04; }); });
  if (!active) return null;
  return <group ref={group}>
    {INSPECTION_LAYOUT.cameras.map((camera) => { const side = Math.sign(camera.position[0]); return <mesh key={camera.id} position={[camera.position[0] - side * 0.75, camera.kind === 'upper' ? 1.65 : 0.42, camera.position[2]]} rotation={[0, 0, side * Math.PI / 2]}><coneGeometry args={[camera.kind === 'upper' ? 0.62 : 0.42, 1.45, 16, 1, true]} /><meshBasicMaterial color={defect ? '#ef4938' : '#2cbae8'} transparent opacity={0.065} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
    <mesh position={[0, 0.48, 0]}><boxGeometry args={[1.45, 0.02, INSPECTION_LENGTH]} /><meshBasicMaterial color={defect ? '#ef4938' : '#2cbae8'} transparent opacity={0.07} depthWrite={false} /></mesh>
  </group>;
}

function ServiceEquipment({ materials, selected, onSelect }: { materials: Palette; selected: boolean; onSelect?: (id: EquipmentId) => void }) {
  return <group>{[-1, 1].map((side) => <group key={side} position={[side * 3.15, 0, 0.72]}>
    <mesh name={side === 1 ? 'RELAY-CABINET' : 'EDGE-CABINET'} position={[0, 0.62, 0]} castShadow onClick={(event) => { if (side !== 1) return; event.stopPropagation(); onSelect?.('RELAY-CABINET'); }} onPointerOver={(event) => { if (side !== 1) return; event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'default'; }}><boxGeometry args={[0.62, 1.24, 0.5]} /><meshStandardMaterial color="#adb1ad" roughness={0.6} metalness={0.38} /></mesh>
    <mesh position={[-side * 0.316, 0.67, 0]}><boxGeometry args={[0.018, 0.92, 0.38]} /><meshStandardMaterial color="#707572" roughness={0.62} metalness={0.55} /></mesh>
    <mesh position={[-side * 0.33, 0.86, 0.12]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.025, 8]} /><primitive object={materials.rubber} attach="material" /></mesh>
    {side === 1 && selected && <EquipmentMarker label="RELAY CABINET" position={[0, 1.55, 0]} />}
  </group>)}</group>;
}
