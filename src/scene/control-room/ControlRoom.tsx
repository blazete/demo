import type { SiteMetrics } from '../../data/types';
import { Html } from '@react-three/drei';

export function ControlRoom({ metrics }: { metrics: SiteMetrics }) {
  return (
    <group position={[14, 0, -5]}>
      <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[5, 3, 4]} /><meshStandardMaterial color="#6B6050" roughness={0.85} /></mesh>
      <mesh position={[0, 3.1, 0]} castShadow><boxGeometry args={[5.4, 0.15, 4.4]} /><meshStandardMaterial color="#5A5040" roughness={0.8} /></mesh>
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 2, 2.01]}><boxGeometry args={[0.9, 0.8, 0.05]} /><meshStandardMaterial color="#1a3a5a" emissive={i === 1 ? '#2CBAE8' : '#F2B544'} emissiveIntensity={0.3} roughness={0.1} metalness={0.5} /></mesh>
      ))}
      <mesh position={[2, 1, 2.01]}><boxGeometry args={[0.8, 1.8, 0.05]} /><meshStandardMaterial color="#4A4030" roughness={0.8} /></mesh>
      <group position={[0, 1.5, 1.5]}>
        <mesh position={[-1.2, 0.5, 0]}><boxGeometry args={[1, 0.6, 0.03]} /><meshStandardMaterial color="#0B1F33" emissive="#2CBAE8" emissiveIntensity={0.2} roughness={0.2} /></mesh>
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[1, 0.6, 0.03]} /><meshStandardMaterial color="#0B1F33" emissive="#F2B544" emissiveIntensity={0.2} roughness={0.2} /></mesh>
        <mesh position={[1.2, 0.5, 0]}><boxGeometry args={[1, 0.6, 0.03]} /><meshStandardMaterial color="#0B1F33" emissive="#2CBAE8" emissiveIntensity={0.15} roughness={0.2} /></mesh>
        <mesh position={[0, -0.3, 0]}><boxGeometry args={[1, 0.5, 0.03]} /><meshStandardMaterial color="#0B1F33" emissive="#D94B3D" emissiveIntensity={0.15} roughness={0.2} /></mesh>
      </group>
      <Html transform position={[0, 2.2, 2.08]} distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div aria-label="Control room metrics" style={{ width: 240, padding: 10, background: 'rgba(11,31,51,0.92)', color: '#F2EFE6', fontFamily: 'Inter, sans-serif', fontSize: 9, border: '1px solid rgba(44,186,232,0.4)', borderRadius: 4 }}>
          <div style={{ color: '#2CBAE8', letterSpacing: 1, marginBottom: 6 }}>MVIS CONTROL ROOM</div>
          <div>Total trains inspected: <strong>{metrics.totalTrainsInspected}</strong></div>
          <div>Defects found: <strong style={{ color: '#D94B3D' }}>{metrics.defectsFound}</strong></div>
          <div>Today’s activity: <strong>{metrics.todayActivity}</strong></div>
          <div>Latest alerts: <strong style={{ color: '#F2B544' }}>{metrics.latestAlerts}</strong></div>
        </div>
      </Html>
      <pointLight position={[2.5, 2.5, 2.5]} intensity={0.5} color="#F2EFE6" distance={6} decay={2} />
    </group>
  );
}
