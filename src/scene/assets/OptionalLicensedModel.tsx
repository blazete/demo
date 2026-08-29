import { Suspense, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { Clone } from '@react-three/drei';

interface OptionalLicensedModelProps {
  url?: string;
  fallback: ReactNode;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function LicensedGLB({ url, scale = 1, position, rotation }: Required<Pick<OptionalLicensedModelProps, 'url'>> & Omit<OptionalLicensedModelProps, 'url' | 'fallback'>) {
  const { scene } = useGLTF(url);
  return <Clone object={scene} scale={scale} position={position} rotation={rotation} castShadow receiveShadow />;
}

export function OptionalLicensedModel({ url, fallback, ...transform }: OptionalLicensedModelProps) {
  if (!url) return <>{fallback}</>;
  return <Suspense fallback={fallback}><LicensedGLB url={url} {...transform} /></Suspense>;
}
