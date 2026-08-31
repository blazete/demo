import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EquipmentId } from '../../data/equipment/equipmentRegistry';
import { EquipmentMarker } from '../selection/EquipmentMarker';
import { INSPECTION_LAYOUT } from './inspectionLayout';

type Props = {
  active: boolean;
  defect: boolean;
  lightsEnabled?: boolean;
  selected?: boolean;
  onSelect?: (id: EquipmentId) => void;
};

/** Detailed under-track line-scan camera assembly based on the MVIS cross-section. */
export function LineScanCameraAssembly({ active, defect, lightsEnabled = true, selected = false, onSelect }: Props) {
  const ledRefs = useRef<THREE.Mesh[]>([]);
  const materials = useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({ color: 0x6e7074, roughness: 0.9, metalness: 0.05 }),
    darkAnodized: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.3, metalness: 0.85 }),
    brushedSteel: new THREE.MeshStandardMaterial({ color: 0xb0b3b8, roughness: 0.35, metalness: 0.95 }),
    opticalGlass: new THREE.MeshPhysicalMaterial({ color: 0x70a5c4, metalness: 0.1, roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.95, ior: 1.52 }),
    ledEmitter: new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffff, emissiveIntensity: 0.2, roughness: 0.2, toneMapped: false }),
    cableRubber: new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.8, metalness: 0.1 }),
    status: new THREE.MeshStandardMaterial({ color: 0x72ddff, emissive: 0x2cbae8, emissiveIntensity: 0.12, roughness: 0.25, toneMapped: false }),
  }), []);

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);

  useFrame(({ clock }) => {
    const pulse = lightsEnabled ? (active ? 1.8 + Math.sin(clock.elapsedTime * 8) * 0.55 : 0.42) : 0.02;
    const color = defect ? 0xff4f3e : 0xffffee;
    const emissive = defect ? 0xff301f : 0xffffff;
    ledRefs.current.forEach((led) => {
      const material = led.material as THREE.MeshStandardMaterial;
      material.color.setHex(color);
      material.emissive.setHex(emissive);
      material.emissiveIntensity = pulse;
    });
    materials.status.color.setHex(defect ? 0xff4f3e : 0x72ddff);
    materials.status.emissive.setHex(defect ? 0xff301f : 0x2cbae8);
    materials.status.emissiveIntensity = lightsEnabled ? (active ? 2.4 + Math.sin(clock.elapsedTime * 6) * 0.5 : 0.3) : 0.02;
  });

  const ledOffsets = [
    [-0.28, 0.08], [0, 0.08], [0.28, 0.08],
    [-0.28, -0.08], [0, -0.08], [0.28, -0.08],
  ] as const;

  return (
    <group
      name="MVIS_LineScanCameraAssembly"
      position={[...INSPECTION_LAYOUT.lineScanner.position]}
      onClick={(event) => { event.stopPropagation(); onSelect?.('CAM-5'); }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      <mesh name="InspectionPit" position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.25, 0.84]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
      <mesh name="ProtectiveHousing" position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.82, 0.06, 0.72]} />
        <primitive object={materials.darkAnodized} attach="material" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} name={`HousingWall_${side === -1 ? 'L' : 'R'}`} position={[0, 0.065, side * 0.31]} castShadow>
          <boxGeometry args={[0.82, 0.1, 0.045]} />
          <primitive object={materials.darkAnodized} attach="material" />
        </mesh>
      ))}
      <mesh name="MountingBracket" position={[0, -0.04, 0]}>
        <boxGeometry args={[0.24, 0.02, 0.18]} />
        <primitive object={materials.brushedSteel} attach="material" />
      </mesh>
      <mesh name="LineScanCamera" position={[0, 0.105, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <primitive object={materials.darkAnodized} attach="material" />
      </mesh>
      <mesh name="OpticalLens" position={[0, 0.19, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.07, 32]} />
        <primitive object={materials.opticalGlass} attach="material" />
      </mesh>
      <mesh name="CableConnector" position={[0, 0.01, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
        <primitive object={materials.cableRubber} attach="material" />
      </mesh>
      {ledOffsets.map(([x, z], index) => (
        <mesh
          key={index}
          name={`LEDStrip_0${index + 1}`}
          ref={(mesh) => { if (mesh) ledRefs.current[index] = mesh; }}
          position={[x, 0.12, z * 3]}
        >
          <boxGeometry args={[0.22, 0.015, 0.025]} />
          <primitive object={materials.ledEmitter} attach="material" />
        </mesh>
      ))}
      <mesh name="LineScanStatusBar" position={[0, 0.25, 0]}>
        <boxGeometry args={[0.34, 0.018, 0.028]} />
        <primitive object={materials.status} attach="material" />
      </mesh>
      <mesh name="LineScanIlluminationWindow" position={[0, 0.255, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.66, 0.16]} />
        <meshBasicMaterial color={defect ? '#ff3929' : '#36c9f4'} transparent opacity={active ? 0.28 : 0.06} toneMapped={false} />
      </mesh>
      {selected && <EquipmentMarker label="CAM-5 LINE SCAN" position={[0, 0.62, 0]} />}
    </group>
  );
}
