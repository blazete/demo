import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type DronePreset = 'site' | 'top' | 'inspection' | 'train-side';

const PRESETS: Record<DronePreset, { position: THREE.Vector3; target: THREE.Vector3 }> = {
  site: { position: new THREE.Vector3(25, 22, 30), target: new THREE.Vector3(-7, 0, 0) },
  top: { position: new THREE.Vector3(-5, 34, 4), target: new THREE.Vector3(-7, 0, 0) },
  inspection: { position: new THREE.Vector3(18, 9, 14), target: new THREE.Vector3(0, 1.5, 0) },
  'train-side': { position: new THREE.Vector3(16, 5, 12), target: new THREE.Vector3(0, 2, 0) },
};

export function DroneCamera({ enabled, preset }: { enabled: boolean; preset: DronePreset }) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const targetPosition = useRef(PRESETS.site.position.clone());
  const targetLook = useRef(PRESETS.site.target.clone());

  useEffect(() => {
    targetPosition.current.copy(PRESETS[preset].position);
    targetLook.current.copy(PRESETS[preset].target);
  }, [preset]);

  useFrame((_, dt) => {
    if (!enabled || !controls.current) return;
    const t = Math.min(dt * 3.2, 1);
    camera.position.lerp(targetPosition.current, t);
    controls.current.target.lerp(targetLook.current, t);
    controls.current.update();
  });

  if (!enabled) return null;
  return <OrbitControls ref={controls} enableDamping dampingFactor={0.08} minDistance={6} maxDistance={70} minPolarAngle={0.18} maxPolarAngle={Math.PI / 2.05} target={[0, 1, 0]} />;
}
