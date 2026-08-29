import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { PortalState } from '../../data/types';

export type CameraShot = 'arrival' | 'standby' | 'approach' | 'activation' | 'inspection' | 'defect_focus' | 'exit' | 'completion' | 'free_roam';

interface Props {
  currentShot: CameraShot;
  trainPosition: number;
  trainSpeed: number;
  activeCoachIndex: number;
  portalState: PortalState;
  highlightedComponent: string | null;
  isGuided: boolean;
}

const CONFIGS: Record<CameraShot, (ctx: { trainPosition: number; activeCoachIndex: number }) => { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  arrival: () => ({ pos: new THREE.Vector3(10.5, 4.8, 15), look: new THREE.Vector3(0, 1.35, 0) }),
  standby: () => ({ pos: new THREE.Vector3(7.2, 3.2, 5.6), look: new THREE.Vector3(0, 1.35, 0) }),
  approach: ({ trainPosition: tp }) => ({ pos: new THREE.Vector3(10, 5, Math.max(tp + 30, 20)), look: new THREE.Vector3(0, 2, Math.min(tp + 15, 30)) }),
  activation: () => ({ pos: new THREE.Vector3(6.2, 2.85, 4.5), look: new THREE.Vector3(0, 1.15, 0) }),
  inspection: ({ trainPosition: tp, activeCoachIndex }) => { const coachZ = tp + 21 + activeCoachIndex * 23.5; return { pos: new THREE.Vector3(-10.6, 3.9, coachZ + 7.5), look: new THREE.Vector3(0, 1.35, coachZ) }; },
  defect_focus: ({ trainPosition: tp, activeCoachIndex }) => { const coachZ = tp + 21 + activeCoachIndex * 23.5; return { pos: new THREE.Vector3(-7.2, 2.4, coachZ + 4.6), look: new THREE.Vector3(0, 0.72, coachZ) }; },
  exit: ({ trainPosition: tp }) => ({ pos: new THREE.Vector3(10, 5, -15), look: new THREE.Vector3(0, 2, Math.min(tp + 10, 10)) }),
  completion: () => ({ pos: new THREE.Vector3(10.5, 5.5, 7), look: new THREE.Vector3(0, 1.3, 0) }),
  free_roam: () => ({ pos: new THREE.Vector3(6, 3, 5), look: new THREE.Vector3(0, 2, 0) }),
};

export function CameraDirector({ currentShot, trainPosition, activeCoachIndex, isGuided }: Props) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(12, 6, 20));
  const targetLook = useRef(new THREE.Vector3(0, 2, 0));
  const currentLook = useRef(new THREE.Vector3(0, 2, 0));

  useEffect(() => {
    if (!isGuided) return;
    const cfg = CONFIGS[currentShot]?.({ trainPosition, activeCoachIndex }) ?? CONFIGS.standby({ trainPosition: 0, activeCoachIndex: 0 });
    targetPos.current.copy(cfg.pos);
    targetLook.current.copy(cfg.look);
  }, [currentShot, trainPosition, activeCoachIndex, isGuided]);

  useFrame((_, dt) => {
    if (!isGuided) return;
    const t = Math.min(dt * 2, 1);
    camera.position.lerp(targetPos.current, t);
    currentLook.current.lerp(targetLook.current, t);
    camera.lookAt(currentLook.current);
  });

  return null;
}
