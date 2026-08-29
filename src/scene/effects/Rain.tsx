import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { QualityTier } from '../../data/types';

export function Rain({ qualityTier }: { qualityTier: QualityTier }) {
  const count = qualityTier === 'high' ? 1200 : qualityTier === 'low' ? 320 : 720;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const droplets = useMemo(() => {
    let seed = 82719;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0xffffffff; };
    return Array.from({ length: count }, () => ({ x: -23 + random() * 36, y: 2 + random() * 23, z: -48 + random() * 96, speed: 15 + random() * 13 }));
  }, [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const dt = Math.min(delta, 0.05);
    droplets.forEach((drop, index) => {
      drop.y -= drop.speed * dt;
      drop.x += 1.2 * dt;
      if (drop.y < 0.05) { drop.y = 20 + (index % 9) * 0.45; drop.x = -23 + ((index * 37) % 360) / 10; }
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.rotation.z = -0.08;
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false} renderOrder={8}>
    <boxGeometry args={[0.018, 0.42, 0.018]} />
    <meshBasicMaterial color="#b9e5ff" transparent opacity={0.52} depthWrite={false} />
  </instancedMesh>;
}
