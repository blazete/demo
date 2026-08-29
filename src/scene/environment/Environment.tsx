import { Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { createNoiseTexture } from '../materials/railwayMaterials';
import { LicensedTrackTiles } from '../assets/LicensedRailwayAssets';
import { BROAD_GAUGE, TRACK_CENTERS } from '../portal/inspectionLayout';

const TRACK_LENGTH = 200;
const RAIL_GAUGE = BROAD_GAUGE;
const SLEEPER_SPACING = 0.305;
const SLEEPER_COUNT = Math.floor(TRACK_LENGTH / SLEEPER_SPACING);
const POLE_SPACING = 25;
const POLE_COUNT = Math.floor(TRACK_LENGTH / POLE_SPACING);

export function Ground() {
  const groundTexture = useMemo(() => createNoiseTexture(71, 64), []);
  useEffect(() => () => groundTexture.dispose(), [groundTexture]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, TRACK_LENGTH + 40]} />
        <meshStandardMaterial color="#8f836f" roughness={0.98} metalness={0.01} map={groundTexture} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, -0.02, 0]} receiveShadow>
        <planeGeometry args={[3, TRACK_LENGTH + 40]} />
        <meshStandardMaterial color="#a99f8d" roughness={0.94} />
      </mesh>
      {TRACK_CENTERS.map((center) => <Track key={center} position={[center - RAIL_GAUGE / 2, 0, 0]} />)}
      <BallastStones />
      <Suspense fallback={null}><LicensedTrackTiles /></Suspense>
    </group>
  );
}

function Track({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[RAIL_GAUGE / 2, 0.005, 0]} receiveShadow>
        <boxGeometry args={[RAIL_GAUGE + 1.25, 0.1, TRACK_LENGTH]} />
        <meshStandardMaterial color="#686158" roughness={0.98} />
      </mesh>
      {[0, RAIL_GAUGE].map((x) => <group key={x} position={[x, 0, 0]}>
        <mesh position={[0, 0.11, 0]} castShadow><boxGeometry args={[0.065, 0.18, TRACK_LENGTH]} /><meshStandardMaterial color="#51392e" roughness={0.58} metalness={0.7} /></mesh>
        <mesh position={[0, 0.215, 0]} castShadow><boxGeometry args={[0.105, 0.035, TRACK_LENGTH]} /><meshStandardMaterial color="#797d7c" roughness={0.2} metalness={0.96} /></mesh>
      </group>)}
      <Sleepers />
      {Array.from({ length: 26 }, (_, i) => <group key={i} position={[0, 0.24, -TRACK_LENGTH / 2 + 2 + i * 7.5]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.18, 0.025, 0.13]} /><meshStandardMaterial color="#2b2723" roughness={0.58} metalness={0.72} /></mesh>
        <mesh position={[RAIL_GAUGE, 0, 0]}><boxGeometry args={[0.18, 0.025, 0.13]} /><meshStandardMaterial color="#2b2723" roughness={0.58} metalness={0.72} /></mesh>
      </group>)}
    </group>
  );
}

function Sleepers() {
  const geom = useMemo(() => new THREE.BoxGeometry(RAIL_GAUGE + 0.4, 0.03, 0.18), []);
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const half = TRACK_LENGTH / 2;
    for (let i = 0; i < SLEEPER_COUNT; i++) arr.push([0.838, 0.01, -half + i * SLEEPER_SPACING]);
    return arr;
  }, []);
  const meshRef = useMemo(() => ({ current: null as THREE.InstancedMesh | null }), []);

  return (
    <instancedMesh
      ref={(el) => { meshRef.current = el; if (el) { const m = new THREE.Matrix4(); positions.forEach((p, i) => { m.makeTranslation(p[0], p[1], p[2]); el.setMatrixAt(i, m); }); el.instanceMatrix.needsUpdate = true; } }}
      args={[geom, undefined, SLEEPER_COUNT]}
      receiveShadow
    >
      <meshStandardMaterial color="#aaa79e" roughness={0.94} />
    </instancedMesh>
  );
}

function BallastStones() {
  const count = 420;
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(0.09, 0), []);
  const matrices = useMemo(() => {
    let seed = 90210;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0xffffffff; };
    const dummy = new THREE.Object3D();
    return Array.from({ length: count }, () => {
      const sideBias = rand() > 0.5 ? 1 : -1;
      dummy.position.set(sideBias * (0.95 + rand() * 0.7), 0.1 + rand() * 0.08, -18 + rand() * 36);
      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      dummy.scale.set(0.55 + rand(), 0.35 + rand() * 0.65, 0.55 + rand());
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, []);
  return <instancedMesh args={[geometry, undefined, count]} ref={(mesh) => { if (!mesh) return; matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix)); mesh.instanceMatrix.needsUpdate = true; }} castShadow receiveShadow><meshStandardMaterial color="#716b62" roughness={0.98} /></instancedMesh>;
}

export function TractionPoles() {
  return (
    <group name="indian-railways-25kv-ohe">
      {TRACK_CENTERS.map((trackX) => <group key={trackX}>
        {Array.from({ length: POLE_COUNT + 1 }, (_, i) => {
          const z = -TRACK_LENGTH / 2 + i * POLE_SPACING;
          const mastX = trackX + 2.5;
          const stagger = i % 2 === 0 ? -0.2 : 0.2;
          return <group key={z}>
            <mesh position={[mastX, 4.5, z]} castShadow><boxGeometry args={[0.16, 9, 0.2]} /><meshStandardMaterial color="#626b6b" roughness={0.58} metalness={0.72} /></mesh>
            <OheMember from={[mastX, 7.25, z]} to={[trackX + stagger, 7.05, z]} radius={0.045} />
            <OheMember from={[mastX, 8.0, z]} to={[trackX + 0.55, 7.08, z]} radius={0.035} />
            <OheMember from={[trackX + 0.62, 6.02, z]} to={[trackX + stagger, 5.65, z]} radius={0.025} color="#858f91" />
            {[0.35, 0.72].map((fraction) => <mesh key={fraction} position={[THREE.MathUtils.lerp(mastX, trackX + stagger, fraction), THREE.MathUtils.lerp(7.25, 7.05, fraction), z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.075, 0.075, 0.18, 10]} /><meshStandardMaterial color="#d9ddd8" roughness={0.36} metalness={0.12} /></mesh>)}
          </group>;
        })}
        {Array.from({ length: POLE_COUNT }, (_, i) => <CatenarySpan key={i} trackX={trackX} zStart={-TRACK_LENGTH / 2 + i * POLE_SPACING} zEnd={-TRACK_LENGTH / 2 + (i + 1) * POLE_SPACING} reverse={i % 2 === 1} />)}
      </group>)}
    </group>
  );
}

function OheMember({ from, to, radius, color = '#6b7475' }: { from: [number, number, number]; to: [number, number, number]; radius: number; color?: string }) {
  const start = new THREE.Vector3(...from), end = new THREE.Vector3(...to);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const direction = end.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={midpoint} quaternion={quaternion}><cylinderGeometry args={[radius, radius, direction.length(), 8]} /><meshStandardMaterial color={color} roughness={0.45} metalness={0.72} /></mesh>;
}

function CatenarySpan({ trackX, zStart, zEnd, reverse }: { trackX: number; zStart: number; zEnd: number; reverse: boolean }) {
  const startX = trackX + (reverse ? 0.2 : -0.2);
  const endX = trackX + (reverse ? -0.2 : 0.2);
  const midZ = (zStart + zEnd) / 2;
  const contactCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(startX, 5.65, zStart), new THREE.Vector3(trackX, 5.5, midZ), new THREE.Vector3(endX, 5.65, zEnd)]);
  const messengerCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(startX, 7.05, zStart), new THREE.Vector3(trackX, 6.78, midZ), new THREE.Vector3(endX, 7.05, zEnd)]);
  return <group>
    <mesh><tubeGeometry args={[contactCurve, 24, 0.022, 6, false]} /><meshStandardMaterial color="#9e7d55" roughness={0.34} metalness={0.86} /></mesh>
    <mesh><tubeGeometry args={[messengerCurve, 24, 0.018, 6, false]} /><meshStandardMaterial color="#747d7d" roughness={0.4} metalness={0.82} /></mesh>
    {[0.25, 0.5, 0.75].map((t) => {
      const contact = contactCurve.getPoint(t), messenger = messengerCurve.getPoint(t);
      return <OheMember key={t} from={[contact.x, contact.y, contact.z]} to={[messenger.x, messenger.y, messenger.z]} radius={0.01} color="#777f80" />;
    })}
  </group>;
}

export function Fencing() {
  const positions = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let z = -TRACK_LENGTH / 2; z < TRACK_LENGTH / 2; z += 3) { p.push([12, 0.75, z]); p.push([-16, 0.75, z]); }
    return p;
  }, []);
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh><boxGeometry args={[0.05, 1.5, 0.05]} /><meshStandardMaterial color="#888" roughness={0.6} metalness={0.4} /></mesh>
          <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.02, 0.02, 2.8]} /><meshStandardMaterial color="#888" roughness={0.6} metalness={0.4} /></mesh>
        </group>
      ))}
    </group>
  );
}

export function Signals() {
  return (
    <group position={[4, 0, -80]}>
      <mesh position={[0, 4, 0]} castShadow><boxGeometry args={[0.2, 8, 0.2]} /><meshStandardMaterial color="#555" roughness={0.6} metalness={0.5} /></mesh>
      <mesh position={[0, 7.5, 0]}><boxGeometry args={[0.4, 1.2, 0.3]} /><meshStandardMaterial color="#333" roughness={0.8} /></mesh>
      <mesh position={[0, 7.8, 0.16]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#D94B3D" emissive="#D94B3D" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 7.2, 0.16]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#2CBAE8" emissive="#2CBAE8" emissiveIntensity={0.3} /></mesh>
    </group>
  );
}

export function BackgroundElements() {
  return (
    <group>
      <group position={[-7, 0, 0]}><mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1.2, 1, 0.8]} /><meshStandardMaterial color="#4A6B4A" roughness={0.8} /></mesh></group>
      <group position={[9, 0, -3]}><mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.8, 0.8, 0.6]} /><meshStandardMaterial color="#555" roughness={0.8} /></mesh></group>
    </group>
  );
}
