import { Suspense, useMemo } from 'react';
import { Html, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { SiteMetrics } from '../../data/types';
import { PROJECT_OFFICE_FOUNDATION, PROJECT_OFFICE_TRANSFORM } from '../layout/siteAssetTransforms';

const OFFICE_MODEL_URL = '/assets/models/mvis-project-office-portacabin.glb';

function ProjectOfficeAsset() {
  const { scene } = useGLTF(OFFICE_MODEL_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -bounds.min.y, -center.z);
    return clone;
  }, [scene]);
  return <primitive object={model} scale={PROJECT_OFFICE_TRANSFORM.scale} />;
}

function OfficeFallback() {
  return <mesh position={[0, 1.1, 0]} castShadow receiveShadow><boxGeometry args={[2.85, 2.2, 6.05]} /><meshStandardMaterial color="#d9d6cc" roughness={0.8} /></mesh>;
}

export function ControlRoom({ metrics, night = false }: { metrics: SiteMetrics; night?: boolean }) {
  return (
    <group name="MVIS project office" position={[...PROJECT_OFFICE_TRANSFORM.position]} rotation={[0, PROJECT_OFFICE_TRANSFORM.rotationY, 0]}>
      <mesh position={[...PROJECT_OFFICE_FOUNDATION.position]} receiveShadow><boxGeometry args={[...PROJECT_OFFICE_FOUNDATION.size]} /><meshStandardMaterial color="#77756e" roughness={0.96} /></mesh>
      <Suspense fallback={<OfficeFallback />}><ProjectOfficeAsset /></Suspense>
      <Text position={[-1.52, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.28} color="#f2efe6" anchorX="center" anchorY="middle" outlineWidth={0.018} outlineColor="#0b1f33">
        MVIS PROJECT OFFICE
      </Text>
      <Html transform position={[-1.57, 1.45, 0]} rotation={[0, -Math.PI / 2, 0]} distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div aria-label="Project office metrics" style={{ width: 240, padding: 10, background: 'rgba(11,31,51,0.94)', color: '#F2EFE6', fontFamily: 'Inter, sans-serif', fontSize: 9, border: '1px solid rgba(44,186,232,0.5)', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
          <div style={{ color: '#2CBAE8', letterSpacing: 1, marginBottom: 6 }}>MVIS PROJECT OFFICE</div>
          <div>Total trains inspected: <strong>{metrics.totalTrainsInspected}</strong></div>
          <div>Defects found: <strong style={{ color: '#D94B3D' }}>{metrics.defectsFound}</strong></div>
          <div>Today’s activity: <strong>{metrics.todayActivity}</strong></div>
          <div>Latest alerts: <strong style={{ color: '#F2B544' }}>{metrics.latestAlerts}</strong></div>
        </div>
      </Html>
      <pointLight position={[-1.8, 2.45, 0]} intensity={night ? 8 : 0.35} color="#fff0c4" distance={11} decay={2} />
    </group>
  );
}

useGLTF.preload(OFFICE_MODEL_URL);
