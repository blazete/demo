import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODELS = {
  coach: '/assets/models/indian-lhb-coach.glb',
  generator: '/assets/models/indian-lhb-generator-car.glb',
  locomotive: '/assets/models/indian-wap7-locomotive.glb',
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
    {[-0.58, 0.58].map((x) => <HeadlightUnit key={x} x={x} night={night} />)}
  </group>;
}

function HeadlightUnit({ x, night }: { x: number; night: boolean }) {
  const light = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const spotlight = light.current;
    const parent = spotlight?.parent;
    if (!spotlight || !parent) return;
    spotlight.target.position.set(x, -1.4, -55);
    parent.add(spotlight.target);
    return () => { parent.remove(spotlight.target); };
  }, [x]);

  return <group>
    <mesh position={[x, 0, 0]}><sphereGeometry args={[0.14, 16, 10]} /><meshStandardMaterial color="#fff7d6" emissive="#fff1a8" emissiveIntensity={night ? 9 : 0.35} toneMapped={false} /></mesh>
    {night && <>
      <spotLight ref={light} position={[x, 0, -0.05]} color="#fff3c4" intensity={420} distance={60} angle={0.2} penumbra={0.58} decay={1.55} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0002} />
      <pointLight position={[x, 0, -0.2]} color="#ffe9a6" intensity={18} distance={22} decay={2} />
      <mesh position={[x, -0.38, -22.5]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
        <coneGeometry args={[5.1, 45, 24, 1, true]} />
        <meshBasicMaterial color="#fff1ba" transparent opacity={0.043} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </>}
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

Object.values(MODELS).forEach((url) => useGLTF.preload(url));
