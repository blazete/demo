import { Suspense, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { EquipmentId } from '../../data/equipment/equipmentRegistry';
import { CAM5_MODEL_TRANSFORM } from '../layout/siteAssetTransforms';
import { EquipmentMarker } from '../selection/EquipmentMarker';
import { INSPECTION_LAYOUT } from './inspectionLayout';

const MODEL_URL = '/assets/models/line-scan-camera-enclosure.glb';

type Props = {
  active: boolean;
  defect: boolean;
  lightsEnabled?: boolean;
  selected?: boolean;
  onSelect?: (id: EquipmentId) => void;
};

function CameraAsset({ active, defect, lightsEnabled }: Pick<Props, 'active' | 'defect' | 'lightsEnabled'>) {
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(() => {
    const model = scene.clone(true);
    const lensMaterials: THREE.MeshStandardMaterial[] = [];
    const ledMaterials: THREE.MeshStandardMaterial[] = [];
    const clonedMaterials: THREE.Material[] = [];

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const sources = Array.isArray(child.material) ? child.material : [child.material];
      const materials = sources.map((material) => {
        const cloned = material.clone();
        clonedMaterials.push(cloned);
        return cloned;
      });
      child.material = Array.isArray(child.material) ? materials : materials[0];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.envMapIntensity = 0.7;
        if (/^LEDStrip_(Left|Right)_[0-3]$/.test(child.name)) {
          material.toneMapped = false;
          ledMaterials.push(material);
        }
        if (/LineScanLens_(Dome|Body|TrimRing)/.test(child.name)) {
          material.toneMapped = false;
          lensMaterials.push(material);
        }
      });
    });
    return { model, lensMaterials, ledMaterials, clonedMaterials };
  }, [scene]);

  useEffect(() => () => prepared.clonedMaterials.forEach((material) => material.dispose()), [prepared]);

  useFrame(({ clock }) => {
    const pulse = (Math.sin(clock.elapsedTime * 7) + 1) * 0.5;
    const enabled = lightsEnabled ?? true;
    const ledColor = defect ? 0xff4938 : 0xfff4cf;
    const lensColor = defect ? 0xff4938 : 0x53d6ff;
    prepared.ledMaterials.forEach((material) => {
      material.color.setHex(ledColor);
      material.emissive.setHex(ledColor);
      material.emissiveIntensity = enabled ? (active ? 2.7 + pulse * 1.5 : 0.65) : 0.015;
    });
    prepared.lensMaterials.forEach((material) => {
      material.color.setHex(lensColor);
      material.emissive.setHex(lensColor);
      material.emissiveIntensity = enabled ? (active ? 1.8 + pulse : 0.25) : 0.01;
    });
  });

  return (
    <group
      rotation={[CAM5_MODEL_TRANSFORM.rotationX, 0, 0]}
      scale={CAM5_MODEL_TRANSFORM.scale}
      position={[...CAM5_MODEL_TRANSFORM.position]}
    >
      <primitive object={prepared.model} />
    </group>
  );
}

function CameraFallback() {
  return <mesh position={[0, -0.05, 0]} castShadow receiveShadow><boxGeometry args={[0.75, 0.22, 0.9]} /><meshStandardMaterial color="#17191d" metalness={0.8} roughness={0.35} /></mesh>;
}

/** User-supplied under-track CAM-5 enclosure, aligned with the MVIS cross-section. */
export function LineScanCameraAssembly({ active, defect, lightsEnabled = true, selected = false, onSelect }: Props) {
  return (
    <group
      name="MVIS_LineScanCameraAssembly"
      position={[...INSPECTION_LAYOUT.lineScanner.position]}
      onClick={(event) => { event.stopPropagation(); onSelect?.('CAM-5'); }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      <Suspense fallback={<CameraFallback />}><CameraAsset active={active} defect={defect} lightsEnabled={lightsEnabled} /></Suspense>
      {selected && <EquipmentMarker label="CAM-5 LINE SCAN" position={[0, 0.72, 0]} />}
    </group>
  );
}

useGLTF.preload(MODEL_URL);
