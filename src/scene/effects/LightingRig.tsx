import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimeOfDay, Weather, QualityTier } from '../../data/types';
import { Rain } from './Rain';

export function LightingRig({ timeOfDay, weather = 'clear', qualityTier = 'balanced', portalActive }: { timeOfDay: TimeOfDay; weather?: Weather; qualityTier?: QualityTier; portalActive: boolean }) {
  const isNight = timeOfDay === 'night';
  const isRain = weather === 'rain';
  const isOvercast = weather === 'overcast' || isRain;
  useFrame(({ scene }) => {
    const sky = isNight ? '#050810' : isOvercast ? '#8D9DA6' : '#a9cfe3';
    scene.background = new THREE.Color(sky);
    scene.fog = new THREE.Fog(sky, isNight ? 60 : isOvercast ? 80 : 120, isNight ? 150 : isOvercast ? 180 : 250);
  });
  return (
    <>
      <directionalLight position={[24, 34, 18]} intensity={isNight ? 0.08 : isOvercast ? 0.95 : 2.0} color={isNight ? '#1a2a4a' : isOvercast ? '#D5DEE2' : '#fff0cf'} castShadow={qualityTier !== 'low'} shadow-mapSize-width={qualityTier === 'high' ? 2048 : 1024} shadow-mapSize-height={qualityTier === 'high' ? 2048 : 1024} shadow-camera-far={90} shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={18} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.025} />
      <hemisphereLight args={[isNight ? '#0a1020' : '#9ed3ed', isNight ? '#0a0a0a' : '#8a7152', isNight ? 0.15 : 0.58]} />
      <ambientLight intensity={isNight ? 0.05 : 0.08} />
      {portalActive && (<>
        <pointLight position={[-2.3, 2.6, 0]} intensity={isNight ? 5 : 2.4} color="#ffe28a" distance={8} decay={2} />
        <pointLight position={[2.3, 2.6, 0]} intensity={isNight ? 5 : 2.4} color="#ffe28a" distance={8} decay={2} />
        <pointLight position={[0, 0.45, 0]} intensity={isNight ? 2.4 : 1.1} color="#72ddff" distance={5} decay={2} />
      </>)}
      {isNight && (<>
        <pointLight position={[15, 3, 0]} intensity={1} color="#F2EFE6" distance={8} decay={2} />
      </>)}
      {isRain && <Rain qualityTier={qualityTier} />}
    </>
  );
}
