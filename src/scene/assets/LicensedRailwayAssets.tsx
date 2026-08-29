import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';

const MODELS = {
  coach: '/assets/models/indian-lhb-coach.glb',
  generator: '/assets/models/indian-lhb-generator-car.glb',
  locomotive: '/assets/models/indian-wap7-locomotive.glb',
  engineer: '/assets/models/indian-field-engineer.glb',
  track: '/assets/models/indian-track-ballast.glb',
} as const;

function prepareStaticModel(scene: THREE.Group, hiddenPattern?: RegExp) {
  const model = scene.clone(true);
  model.traverse((child) => {
    if (hiddenPattern?.test(child.name)) child.visible = false;
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.55;
          material.roughness = Math.max(material.roughness, 0.28);
        }
      });
    }
  });
  return model;
}

export function LicensedLocomotive({ night = false }: { night?: boolean }) {
  const { scene } = useGLTF(MODELS.locomotive);
  const model = useMemo(() => prepareStaticModel(scene), [scene]);
  return <group><primitive object={model} scale={0.8} /><Headlights night={night} /></group>;
}

function Headlights({ night }: { night: boolean }) {
  return <group name="wap7-headlights" position={[0, 2.25, -8.25]}>
    {[-0.58, 0.58].map((x) => <group key={x} position={[x, 0, 0]}>
      <mesh><sphereGeometry args={[0.14, 16, 10]} /><meshStandardMaterial color="#fff7d6" emissive="#fff1a8" emissiveIntensity={night ? 6 : 0.35} toneMapped={false} /></mesh>
      {night && <pointLight color="#fff0b0" intensity={6} distance={26} decay={2} />}
    </group>)}
  </group>;
}

export function LicensedCoachShell({ generator = false }: { generator?: boolean }) {
  const coach = useGLTF(generator ? MODELS.generator : MODELS.coach);
  const model = useMemo(
    () => prepareStaticModel(coach.scene, generator ? undefined : /bogie/i),
    [coach.scene, generator],
  );
  if (generator) return <primitive object={model} scale={60} position={[0, 0.065, 0]} />;
  return <primitive object={model} scale={0.8} rotation={[0, Math.PI / 2, 0]} position={[0, 1.12, 0]} />;
}

export function LicensedTrackTiles() {
  const { scene } = useGLTF(MODELS.track);
  const tiles = useMemo(() => [-17.2, -12.2, -7.2, 7.2, 12.2, 17.2].map((z) => ({ z, model: prepareStaticModel(scene) })), [scene]);
  return <group name="licensed-indian-railway-track-detail">{tiles.map(({ z, model }) => <primitive key={z} object={model} scale={1.31} position={[0, 0.055, z]} />)}</group>;
}

export function LicensedEngineerBase({ active: _active }: { active: boolean }) {
  const { scene } = useGLTF(MODELS.engineer);
  const model = useMemo(() => cloneSkeleton(scene) as THREE.Group, [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; }
    });
  }, [model]);

  return <group name="licensed-indian-engineer" scale={1.02} position={[0, -0.095, 0]}>
    <primitive object={model} />
  </group>;
}

Object.values(MODELS).forEach((url) => useGLTF.preload(url));
