import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const keys = new Set<string>();

export function ThirdPersonController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const avatar = useRef<THREE.Group>(null);
  const visitor = useRef(new THREE.Vector3(7, 1.1, 8));
  const targetCamera = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (event: KeyboardEvent) => keys.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); keys.clear(); };
  }, []);

  useFrame((_, delta) => {
    if (!enabled) return;
    const direction = new THREE.Vector3(
      (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0),
      0,
      (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0),
    );
    if (direction.lengthSq() > 0) visitor.current.add(direction.normalize().multiplyScalar(Math.min(delta, 0.05) * 2.2));
    visitor.current.x = THREE.MathUtils.clamp(visitor.current.x, 5.2, 11.2);
    visitor.current.z = THREE.MathUtils.clamp(visitor.current.z, -24, 24);
    targetCamera.current.set(visitor.current.x + 6, 4.2, visitor.current.z + 6);
    targetLook.current.set(visitor.current.x, 1.8, visitor.current.z - 2);
    avatar.current?.position.copy(visitor.current);
    camera.position.lerp(targetCamera.current, Math.min(delta * 5, 1));
    camera.lookAt(targetLook.current);
  });

  return enabled ? <group ref={avatar}><mesh castShadow><capsuleGeometry args={[0.35, 1, 6, 12]} /><meshStandardMaterial color="#F2B544" roughness={0.7} /></mesh></group> : null;
}
