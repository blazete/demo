import { Billboard, Text } from '@react-three/drei';

export function EquipmentMarker({ label, position = [0, 0.55, 0] }: { label: string; position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.22, 24]} />
        <meshBasicMaterial color="#35d5ff" transparent opacity={0.9} depthWrite={false} toneMapped={false} />
      </mesh>
      <Billboard position={[0, 0.32, 0]} scale={0.28}>
        <Text fontSize={0.16} color="#dff8ff" outlineWidth={0.018} outlineColor="#0b1f33" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
