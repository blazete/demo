import { Suspense, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PortalState, CoachRecord } from '../../data/types';
import { LicensedCoachShell, LicensedLocomotive } from '../assets/LicensedRailwayAssets';

const RAIL_GAUGE = 1.676;
const WHEEL_RADIUS = 0.42;
const WHEEL_SEPARATION = RAIL_GAUGE - 0.1;
const COACH_START = 21;
const COACH_SPACING = 23.5;

interface TrainProps {
  position: number;
  speed: number;
  night?: boolean;
  coachCount: number;
  coaches?: CoachRecord[];
  portalState: PortalState;
  activeCoachIndex: number;
  highlightedComponent: string | null;
  scenarioSeed: number;
  onComponentInspect?: (componentId: string) => void;
  onTrainSelect?: () => void;
}

export function Train({ position, night = false, coachCount, coaches, portalState, activeCoachIndex, highlightedComponent, scenarioSeed, onComponentInspect, onTrainSelect }: TrainProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coachRecords = coaches ?? Array.from({ length: Math.min(coachCount, 18) }, (_, i) => ({ coachId: `B${i + 1}`, order: i, variant: 'standard' }));
  useFrame((_, dt) => { if (groupRef.current) groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, position, 7, Math.min(dt, 0.05)); });
  return (
    <group ref={groupRef} onClick={(event) => { event.stopPropagation(); onTrainSelect?.(); }}>
      <Locomotive night={night} />
      {coachRecords.map((coach, i) => (
        <Coach key={coach.coachId} coachIndex={i} coachId={coach.coachId} zOffset={COACH_START + i * COACH_SPACING}
          isActive={i === activeCoachIndex} highlightedComponent={highlightedComponent}
          portalState={portalState} scenarioSeed={scenarioSeed} onComponentInspect={onComponentInspect}
          useLicensedShell={i < 6 || i === coachRecords.length - 1} generator={i === coachRecords.length - 1} />
      ))}
    </group>
  );
}

function Locomotive({ night }: { night: boolean }) {
  return <Suspense fallback={<NativeLocomotive night={night} />}><LicensedLocomotive night={night} /></Suspense>;
}

function NativeLocomotive({ night }: { night: boolean }) {
  return (
    <group>
      <mesh position={[0, 1.8, 0]} castShadow><boxGeometry args={[2.8, 2.2, 6]} /><meshPhysicalMaterial color="#d8ddd9" roughness={0.38} metalness={0.48} clearcoat={0.35} clearcoatRoughness={0.4} /></mesh>
      <mesh position={[0, 2.9, -1.5]} castShadow><boxGeometry args={[2.6, 1.0, 2.5]} /><meshPhysicalMaterial color="#c7362f" roughness={0.4} metalness={0.42} clearcoat={0.3} /></mesh>
      <mesh position={[0, 2.9, -2.8]}><boxGeometry args={[2.2, 0.7, 0.1]} /><meshStandardMaterial color="#1a3a5a" roughness={0.1} metalness={0.8} /></mesh>
      <mesh position={[0, 2.5, -3.02]}><sphereGeometry args={[0.15, 8, 8]} /><meshStandardMaterial color="#F5F5DC" emissive="#F5F5DC" emissiveIntensity={1} toneMapped={false} /></mesh>
      <Headlights night={night} z={-3.08} y={2.5} />
      <mesh position={[0, 0.5, 0]}><boxGeometry args={[2.4, 0.6, 5.8]} /><meshStandardMaterial color="#2A2A2A" roughness={0.8} /></mesh>
      <mesh position={[0, 2.05, 0.01]}><boxGeometry args={[2.82, 0.2, 6.02]} /><meshStandardMaterial color="#d13b32" roughness={0.42} metalness={0.34} /></mesh>
      <mesh position={[0, 3.47, 0.25]}><boxGeometry args={[2.2, 0.08, 4.7]} /><meshStandardMaterial color="#686d6b" roughness={0.64} metalness={0.48} /></mesh>
      <Bogie position={[0, 0, -2]} coachId="Loco" isActive={false} highlightedComponent={null} portalState="standby" bogieSide="front" scenarioSeed={0} />
      <Bogie position={[0, 0, 2]} coachId="Loco" isActive={false} highlightedComponent={null} portalState="standby" bogieSide="rear" scenarioSeed={0} />
    </group>
  );
}

function Headlights({ night, z, y }: { night: boolean; z: number; y: number }) {
  return <group name="locomotive-headlights">
    {[-0.56, 0.56].map((x) => <group key={x} position={[x, y, z]}>
      <mesh><sphereGeometry args={[0.13, 16, 10]} /><meshStandardMaterial color="#fff7d6" emissive="#fff1a8" emissiveIntensity={night ? 6 : 0.35} toneMapped={false} /></mesh>
      {night && <pointLight color="#fff0b0" intensity={5.5} distance={24} decay={2} />}
    </group>)}
  </group>;
}

interface CoachProps {
  coachIndex: number; coachId: string; zOffset: number; isActive: boolean;
  highlightedComponent: string | null; portalState: PortalState;
  scenarioSeed: number; onComponentInspect?: (id: string) => void;
  useLicensedShell: boolean; generator: boolean;
}

function Coach({ coachIndex, coachId, zOffset, isActive, highlightedComponent, portalState, scenarioSeed, onComponentInspect, useLicensedShell, generator }: CoachProps) {
  const bodyColor = coachIndex % 3 === 1 ? '#bd302c' : '#c53a34';
  return (
    <group position={[0, 0, zOffset]}>
      {useLicensedShell ? <Suspense fallback={<NativeCoachShell bodyColor={bodyColor} />}><LicensedCoachShell generator={generator} /></Suspense> : <NativeCoachShell bodyColor={bodyColor} />}
      <Bogie position={[0, 0, -8.2]} coachId={coachId} isActive={isActive} highlightedComponent={highlightedComponent} portalState={portalState} bogieSide="front" scenarioSeed={scenarioSeed} onComponentInspect={onComponentInspect} />
      <Bogie position={[0, 0, 8.2]} coachId={coachId} isActive={isActive} highlightedComponent={highlightedComponent} portalState={portalState} bogieSide="rear" scenarioSeed={scenarioSeed + 1} onComponentInspect={onComponentInspect} />
    </group>
  );
}

function NativeCoachShell({ bodyColor }: { bodyColor: string }) {
  return <group>
      <mesh position={[0, 2.2, 0]} castShadow><boxGeometry args={[2.8, 2.6, 22.5]} /><meshPhysicalMaterial color={bodyColor} roughness={0.43} metalness={0.4} clearcoat={0.25} clearcoatRoughness={0.48} /></mesh>
      <Windows />
      <mesh position={[0, 3.6, 0]}><boxGeometry args={[2.6, 0.12, 22.25]} /><meshStandardMaterial color="#bdc0bc" roughness={0.62} metalness={0.34} /></mesh>
      <mesh position={[0, 0.7, 0]}><boxGeometry args={[2.4, 0.5, 22]} /><meshStandardMaterial color="#2A2A2A" roughness={0.8} /></mesh>
      <mesh position={[0, 2.8, -11.27]}><boxGeometry args={[1.0, 0.3, 0.01]} /><meshStandardMaterial color="#f2efe6" roughness={0.3} /></mesh>
      <mesh position={[0, 1.45, 0.01]}><boxGeometry args={[2.82, 0.64, 22.52]} /><meshStandardMaterial color="#aeb2ae" roughness={0.56} metalness={0.4} /></mesh>
      <mesh position={[0, 1.78, 0.01]}><boxGeometry args={[2.83, 0.055, 22.53]} /><meshStandardMaterial color="#f0c327" roughness={0.45} /></mesh>
      {[-10.25, 10.25].map((z) => <group key={z}>{[-1.411, 1.411].map((x) => <mesh key={x} position={[x, 2.12, z]}><boxGeometry args={[0.025, 1.5, 0.72]} /><meshStandardMaterial color="#8f2421" roughness={0.5} metalness={0.32} /></mesh>)}</group>)}
    </group>;
}

function Windows() {
  return (
    <group>
      {Array.from({ length: 28 }, (_, i) => (
        <group key={i}>
          <mesh position={[-1.41, 2.4, -8.8 + i * 0.65]}><boxGeometry args={[0.025, 0.68, 0.49]} /><meshPhysicalMaterial color="#173b4a" roughness={0.14} metalness={0.22} clearcoat={0.7} /></mesh>
          <mesh position={[1.41, 2.4, -8.8 + i * 0.65]}><boxGeometry args={[0.025, 0.68, 0.49]} /><meshPhysicalMaterial color="#173b4a" roughness={0.14} metalness={0.22} clearcoat={0.7} /></mesh>
        </group>
      ))}
    </group>
  );
}

interface BogieProps {
  position: [number, number, number]; coachId: string; isActive: boolean;
  highlightedComponent: string | null; portalState: PortalState;
  bogieSide: 'front' | 'rear'; scenarioSeed: number;
  onComponentInspect?: (id: string) => void;
}

function Bogie({ position, coachId = 'B1', isActive = false, highlightedComponent, portalState, bogieSide = 'front', scenarioSeed = 0, onComponentInspect }: BogieProps) {
  const bogieId = `${coachId}/bogie/${bogieSide}`;
  const isHighlighted = highlightedComponent?.includes(bogieId);
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.15, 1.6]} />
        <meshStandardMaterial color={isHighlighted ? '#F2B544' : '#343b3a'} roughness={0.62} metalness={0.72} emissive={isHighlighted ? '#F2B544' : '#000'} emissiveIntensity={isHighlighted ? 0.5 : 0} />
      </mesh>
      {[-0.5, 0.5].map((zOff, i) => [WHEEL_SEPARATION / 2, -WHEEL_SEPARATION / 2].map((xOff, j) => (
        <Wheel key={`w${i}${j}`} position={[xOff, WHEEL_RADIUS, zOff]}
          componentId={`${bogieId}/wheelset/${i * 2 + j + 1}`} isActive={isActive}
          highlightedComponent={highlightedComponent} portalState={portalState} onInspect={onComponentInspect} />
      )))}
      {[-0.5, 0.5].map((zOff, i) => [WHEEL_SEPARATION / 2 + 0.2, -WHEEL_SEPARATION / 2 - 0.2].map((xOff, j) => (
        <Spring key={`s${i}${j}`} position={[xOff, 0.5, zOff]}
          componentId={`${bogieId}/spring/${j === 0 ? 'left' : 'right'}-primary-${String(i + 1).padStart(2, '0')}`}
          isActive={isActive} highlightedComponent={highlightedComponent} portalState={portalState} onInspect={onComponentInspect} />
      )))}
      {[-0.5, 0.5].map((zOff, i) => (
        <Brake key={`b${i}`} position={[0, 0.35, zOff]}
          componentId={`${bogieId}/brake/${i === 0 ? 'left' : 'right'}-${String(i + 1).padStart(2, '0')}`}
          isActive={isActive} highlightedComponent={highlightedComponent} portalState={portalState} onInspect={onComponentInspect} />
      ))}
    </group>
  );
}

function Wheel({ position, componentId, isActive, highlightedComponent, portalState, onInspect }: {
  position: [number, number, number]; componentId: string; isActive: boolean;
  highlightedComponent: string | null; portalState: PortalState; onInspect?: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const isHL = highlightedComponent === componentId;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    if (isHL) { m.emissiveIntensity = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.3; m.emissive.set('#2CBAE8'); }
    else if (isActive && portalState === 'active') { m.emissiveIntensity = 0.2; m.emissive.set('#2CBAE8'); }
    else { m.emissiveIntensity = 0; }
  });
  return (
    <group position={position}>
      <mesh ref={ref} rotation={[0, 0, Math.PI / 2]} castShadow onClick={() => onInspect?.(componentId)}>
        <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.12, 16]} />
        <meshStandardMaterial color="#343635" roughness={0.22} metalness={0.94} emissive="#000" emissiveIntensity={0} />
      </mesh>
      <mesh><boxGeometry args={[0.15, 0.18, 0.15]} /><meshStandardMaterial color="#555" roughness={0.5} metalness={0.6} /></mesh>
    </group>
  );
}

function Spring({ position, componentId, isActive, highlightedComponent, portalState, onInspect }: {
  position: [number, number, number]; componentId: string; isActive: boolean;
  highlightedComponent: string | null; portalState: PortalState; onInspect?: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const isHL = highlightedComponent === componentId;
  const isDefect = isHL && highlightedComponent?.includes('spring');
  const springGeom = useMemo(() => {
    const pts = Array.from({ length: 20 }, (_, i) => {
      const t = i / 19, a = t * Math.PI * 8, r = 0.06;
      return new THREE.Vector3(Math.cos(a) * r, t * 0.3, Math.sin(a) * r);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.012, 6, false);
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    if (isDefect) {
      const p = Math.sin(clock.getElapsedTime() * 3) * 0.5 + 0.5;
      m.emissiveIntensity = 1.0 + p * 0.5; m.emissive.set('#D94B3D');
      m.color.lerp(new THREE.Color('#FF6B5A'), 0.1);
    } else if (isHL) { m.emissiveIntensity = 0.8; m.emissive.set('#F2B544'); }
    else if (isActive && portalState === 'active') { m.emissiveIntensity = 0.15; m.emissive.set('#2CBAE8'); }
    else { m.emissiveIntensity = 0; m.color.lerp(new THREE.Color('#5A7A5A'), 0.1); }
  });
  return (
    <group position={position}>
      <mesh ref={ref} geometry={springGeom} onClick={() => onInspect?.(componentId)}>
        <meshStandardMaterial color="#5A7A5A" roughness={0.6} metalness={0.4} emissive="#000" emissiveIntensity={0} />
      </mesh>
      <mesh position={[0, 0.32, 0]}><boxGeometry args={[0.12, 0.02, 0.12]} /><meshStandardMaterial color="#555" roughness={0.7} metalness={0.5} /></mesh>
      <mesh position={[0, -0.01, 0]}><boxGeometry args={[0.12, 0.02, 0.12]} /><meshStandardMaterial color="#555" roughness={0.7} metalness={0.5} /></mesh>
    </group>
  );
}

function Brake({ position, componentId, isActive, highlightedComponent, portalState, onInspect }: {
  position: [number, number, number]; componentId: string; isActive: boolean;
  highlightedComponent: string | null; portalState: PortalState; onInspect?: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const isHL = highlightedComponent === componentId;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    if (isHL) { m.emissiveIntensity = 0.8; m.emissive.set('#F2B544'); }
    else if (isActive && portalState === 'active') { m.emissiveIntensity = 0.15; m.emissive.set('#2CBAE8'); }
    else { m.emissiveIntensity = 0; }
  });
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 0.15, 0]} onClick={() => onInspect?.(componentId)}>
        <boxGeometry args={[0.15, 0.08, 0.2]} />
        <meshStandardMaterial color="#666" roughness={0.8} metalness={0.3} emissive="#000" emissiveIntensity={0} />
      </mesh>
      <mesh position={[0, 0.1, 0.12]}><boxGeometry args={[0.04, 0.2, 0.04]} /><meshStandardMaterial color="#555" roughness={0.6} metalness={0.5} /></mesh>
    </group>
  );
}
