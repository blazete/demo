import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PortalState } from '../../data/types';
import { createRailwayMaterialPalette, disposeRailwayMaterialPalette } from '../materials/railwayMaterials';
import { BROAD_GAUGE, INSPECTION_LAYOUT, INSPECTION_LENGTH } from './inspectionLayout';

export function Portal({ portalState, paused = false }: { portalState: PortalState; paused?: boolean }) {
  const materials = useMemo(() => createRailwayMaterialPalette(), []);
  useEffect(() => () => disposeRailwayMaterialPalette(materials), [materials]);
  const active = portalState === 'active' || portalState === 'defect_detected';
  const defect = portalState === 'defect_detected';

  return (
    <group name="open-mvis-inspection-array">
      <InspectionBed active={active} defect={defect} />
      {INSPECTION_LAYOUT.poles.map((pole) => <AdjustablePole key={pole.id} position={[...pole.position]} side={pole.side} materials={materials} />)}
      <SideLightingRails active={active} defect={defect} materials={materials} />
      {INSPECTION_LAYOUT.cameras.map((camera) => <AreaScanCamera key={camera.id} camera={camera} active={active} defect={defect} materials={materials} />)}
      <LineScanPit active={active} defect={defect} materials={materials} />
      <CoverageVolumes active={active} defect={defect} paused={paused} />
      <ServiceEquipment materials={materials} />
    </group>
  );
}

export const InspectionArray = Portal;
type Palette = ReturnType<typeof createRailwayMaterialPalette>;

function InspectionBed({ active, defect }: { active: boolean; defect: boolean }) {
  return (
    <group>
      <mesh position={[0, -0.055, 0]} receiveShadow><boxGeometry args={[BROAD_GAUGE + 1.05, 0.12, INSPECTION_LENGTH + 0.5]} /><meshStandardMaterial color="#8f8b82" roughness={0.94} /></mesh>
      {INSPECTION_LAYOUT.railStrips.map((strip) => (
        <mesh key={strip.id} position={[...strip.position]}><boxGeometry args={[0.085, 0.035, INSPECTION_LENGTH]} /><meshStandardMaterial color={defect ? '#ef5b45' : '#ffe06a'} emissive={defect ? '#ef3d2f' : '#ffd84c'} emissiveIntensity={active ? 2.6 : 0.16} roughness={0.3} toneMapped={false} /></mesh>
      ))}
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

function SideLightingRails({ materials, active, defect }: { materials: Palette; active: boolean; defect: boolean }) {
  return <group>{[-1, 1].map((side) => <group key={side}>
    <mesh position={[side * 2.2, 2.16, 0]} castShadow><boxGeometry args={[0.1, 0.1, INSPECTION_LENGTH]} /><primitive object={materials.galvanizedSteel} attach="material" /></mesh>
    {INSPECTION_LAYOUT.sideLamps.filter((lamp) => Math.sign(lamp.position[0]) === side).map((lamp) => <group key={lamp.id} position={[lamp.position[0], 2.16, lamp.position[2]]} rotation={[0, side * -0.2, side * -0.12]}>
      <mesh castShadow><boxGeometry args={[0.44, 0.24, 0.16]} /><primitive object={materials.safetyYellow} attach="material" /></mesh>
      <mesh position={[-side * 0.015, -0.02, -side * 0.09]}><boxGeometry args={[0.34, 0.13, 0.018]} /><meshStandardMaterial color={defect ? '#ff6454' : '#fff0a1'} emissive={defect ? '#ef3d2f' : '#ffd95a'} emissiveIntensity={active ? 2.2 : 0.14} toneMapped={false} /></mesh>
    </group>)}
  </group>)}</group>;
}

function AreaScanCamera({ camera, active, defect, materials }: { camera: typeof INSPECTION_LAYOUT.cameras[number]; active: boolean; defect: boolean; materials: Palette }) {
  const side = Math.sign(camera.position[0]);
  return <group position={[...camera.position]} rotation={[...camera.rotation]}>
    <mesh castShadow><boxGeometry args={[0.52, camera.kind === 'upper' ? 0.42 : 0.35, 0.52]} /><primitive object={materials.paintedSteel} attach="material" /></mesh>
    <mesh position={[-side * 0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.13, 0.16, 0.12, 18]} /><primitive object={materials.rubber} attach="material" /></mesh>
    <mesh position={[-side * 0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.035, 20]} /><primitive object={materials.lens} attach="material" /></mesh>
    <mesh position={[side * 0.18, 0.15, 0.27]}><sphereGeometry args={[0.032, 10, 10]} /><meshStandardMaterial color={defect ? '#ff4f3e' : '#56d5ff'} emissive={defect ? '#ff301f' : '#2cbae8'} emissiveIntensity={active ? 3 : 0.15} toneMapped={false} /></mesh>
    <Cable side={side} materials={materials} />
  </group>;
}

function Cable({ side, materials }: { side: number; materials: Palette }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(side * 0.2, -0.16, 0.16), new THREE.Vector3(side * 0.42, -0.28, 0.18), new THREE.Vector3(side * 0.5, -0.52, 0.08)]), 12, 0.025, 6, false), [side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}><primitive object={materials.rubber} attach="material" /></mesh>;
}

function LineScanPit({ active, defect, materials }: { active: boolean; defect: boolean; materials: Palette }) {
  return <group position={[...INSPECTION_LAYOUT.lineScanner.position]}>
    <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.84, 0.32, 0.82]} /><meshStandardMaterial color="#292b29" roughness={0.78} metalness={0.45} /></mesh>
    <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.68, 0.66]} /><meshStandardMaterial color="#151817" roughness={0.7} metalness={0.6} /></mesh>
    <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[0.48, 0.16, 0.06]} /><primitive object={materials.paintedSteel} attach="material" /></mesh>
    <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[0.36, 0.045, 0.02]} /><meshStandardMaterial color={defect ? '#ff4f3e' : '#72ddff'} emissive={defect ? '#ff301f' : '#2cbae8'} emissiveIntensity={active ? 3.2 : 0.12} toneMapped={false} /></mesh>
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

function ServiceEquipment({ materials }: { materials: Palette }) {
  return <group>{[-1, 1].map((side) => <group key={side} position={[side * 3.15, 0, 0.72]}>
    <mesh position={[0, 0.62, 0]} castShadow><boxGeometry args={[0.62, 1.24, 0.5]} /><meshStandardMaterial color="#adb1ad" roughness={0.6} metalness={0.38} /></mesh>
    <mesh position={[-side * 0.316, 0.67, 0]}><boxGeometry args={[0.018, 0.92, 0.38]} /><meshStandardMaterial color="#707572" roughness={0.62} metalness={0.55} /></mesh>
    <mesh position={[-side * 0.33, 0.86, 0.12]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.025, 8]} /><primitive object={materials.rubber} attach="material" /></mesh>
  </group>)}</group>;
}
