import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityTier } from '../../data/types';
import { LicensedEngineerBase } from '../assets/LicensedRailwayAssets';
import { Billboard, Text } from '@react-three/drei';

export function FieldEngineer({ active, qualityTier = 'balanced' }: { active: boolean; qualityTier?: QualityTier }) {
  return <group name="indian-railways-field-engineer" position={[5.35, 0.02, 3.4]} rotation={[0, -0.72, 0]}>
    <Suspense fallback={<NativeFieldEngineer active={active} qualityTier={qualityTier} />}>
      <LicensedEngineerBase active={active} />
    </Suspense>
    <Billboard position={[0, 2.18, 0]} follow lockX={false} lockY={false} lockZ={false}>
      <mesh position={[0, 0, -0.015]}><planeGeometry args={[1.55, 0.42]} /><meshBasicMaterial color="#0B1F33" transparent opacity={0.88} depthWrite={false} /></mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.24} color="#F2EFE6" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#2CBAE8">Shreyansh</Text>
    </Billboard>
  </group>;
}

function NativeFieldEngineer({ active, qualityTier }: { active: boolean; qualityTier: QualityTier }) {
  const body = useRef<THREE.Group>(null);
  const tablet = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (body.current) body.current.rotation.z = Math.sin(t * 1.2) * 0.006;
    if (tablet.current) tablet.current.rotation.x = -0.18 + Math.sin(t * 0.75) * 0.018;
  });

  return (
    <group>
      <group ref={body}>
        <mesh position={[0, 1.12, 0]} castShadow><capsuleGeometry args={[0.26, 0.62, 8, 14]} /><meshStandardMaterial color="#8bb6d9" roughness={0.82} /></mesh>
        <mesh position={[0, 1.14, -0.245]} castShadow><boxGeometry args={[0.58, 0.72, 0.055]} /><meshStandardMaterial color="#f08b1e" roughness={0.68} /></mesh>
        <mesh position={[-0.16, 1.14, -0.28]} rotation={[0, 0, -0.13]}><boxGeometry args={[0.065, 0.7, 0.025]} /><meshStandardMaterial color="#f4d23c" roughness={0.62} /></mesh>
        <mesh position={[0.16, 1.14, -0.28]} rotation={[0, 0, 0.13]}><boxGeometry args={[0.065, 0.7, 0.025]} /><meshStandardMaterial color="#f4d23c" roughness={0.62} /></mesh>
        <mesh position={[0, 1.08, -0.285]}><boxGeometry args={[0.5, 0.065, 0.026]} /><meshStandardMaterial color="#f4d23c" roughness={0.62} /></mesh>
        <mesh position={[-0.16, 0.47, 0]} castShadow><capsuleGeometry args={[0.105, 0.62, 6, 10]} /><meshStandardMaterial color="#182a47" roughness={0.86} /></mesh>
        <mesh position={[0.16, 0.47, 0]} castShadow><capsuleGeometry args={[0.105, 0.62, 6, 10]} /><meshStandardMaterial color="#182a47" roughness={0.86} /></mesh>
        <mesh position={[-0.17, 0.08, -0.04]} castShadow><boxGeometry args={[0.28, 0.16, 0.48]} /><meshStandardMaterial color="#252522" roughness={0.82} /></mesh>
        <mesh position={[0.17, 0.08, -0.04]} castShadow><boxGeometry args={[0.28, 0.16, 0.48]} /><meshStandardMaterial color="#252522" roughness={0.82} /></mesh>
        <mesh position={[0, 1.7, 0]} castShadow><sphereGeometry args={[0.205, qualityTier === 'low' ? 12 : 20, qualityTier === 'low' ? 8 : 14]} /><meshStandardMaterial color="#9a6042" roughness={0.9} /></mesh>
        <mesh position={[0, 1.86, 0]} castShadow><sphereGeometry args={[0.235, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} /><meshStandardMaterial color="#f2f3ee" roughness={0.52} /></mesh>
        <mesh position={[0, 1.84, -0.17]}><boxGeometry args={[0.56, 0.045, 0.17]} /><meshStandardMaterial color="#f2f3ee" roughness={0.52} /></mesh>
        <mesh position={[0, 1.47, -0.27]}><boxGeometry args={[0.18, 0.24, 0.025]} /><meshStandardMaterial color="#f4f4ef" roughness={0.72} /></mesh>
        <mesh position={[0, 1.47, -0.286]}><boxGeometry args={[0.12, 0.025, 0.008]} /><meshStandardMaterial color={active ? '#2cbae8' : '#496d83'} emissive={active ? '#2cbae8' : '#000'} emissiveIntensity={active ? 0.7 : 0} /></mesh>
        <mesh position={[-0.34, 1.14, -0.04]} rotation={[0, 0, -0.18]} castShadow><capsuleGeometry args={[0.08, 0.5, 6, 10]} /><meshStandardMaterial color="#8bb6d9" roughness={0.82} /></mesh>
        <mesh position={[0.34, 1.14, -0.04]} rotation={[0, 0, 0.18]} castShadow><capsuleGeometry args={[0.08, 0.5, 6, 10]} /><meshStandardMaterial color="#8bb6d9" roughness={0.82} /></mesh>
        <group ref={tablet} position={[0, 1.05, -0.5]}>
          <mesh castShadow><boxGeometry args={[0.58, 0.38, 0.055]} /><meshStandardMaterial color="#151a1c" roughness={0.55} metalness={0.28} /></mesh>
          <mesh position={[0, 0, -0.031]}><planeGeometry args={[0.47, 0.28]} /><meshStandardMaterial color="#183e52" emissive="#2cbae8" emissiveIntensity={active ? 0.42 : 0.14} /></mesh>
        </group>
      </group>
    </group>
  );
}
