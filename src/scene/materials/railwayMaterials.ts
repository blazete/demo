import * as THREE from 'three';

export interface RailwayMaterialPalette {
  galvanizedSteel: THREE.MeshStandardMaterial;
  paintedSteel: THREE.MeshStandardMaterial;
  railTop: THREE.MeshStandardMaterial;
  railWeb: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  ballast: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  lens: THREE.MeshPhysicalMaterial;
  safetyYellow: THREE.MeshStandardMaterial;
  led: THREE.MeshStandardMaterial;
}

export function createNoiseTexture(seed = 41, size = 32) {
  let state = seed >>> 0;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const value = 105 + (state % 86);
    const offset = i * 4;
    data[offset] = value;
    data[offset + 1] = Math.max(0, value - 6);
    data[offset + 2] = Math.max(0, value - 12);
    data[offset + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 36);
  texture.needsUpdate = true;
  return texture;
}

export function createRailwayMaterialPalette(): RailwayMaterialPalette {
  return {
    galvanizedSteel: new THREE.MeshStandardMaterial({ color: '#7c8588', roughness: 0.52, metalness: 0.78 }),
    paintedSteel: new THREE.MeshStandardMaterial({ color: '#d8d9d4', roughness: 0.42, metalness: 0.32 }),
    railTop: new THREE.MeshStandardMaterial({ color: '#585b59', roughness: 0.2, metalness: 0.94 }),
    railWeb: new THREE.MeshStandardMaterial({ color: '#4b352a', roughness: 0.62, metalness: 0.72 }),
    concrete: new THREE.MeshStandardMaterial({ color: '#918d83', roughness: 0.92, metalness: 0.02 }),
    ballast: new THREE.MeshStandardMaterial({ color: '#716b62', roughness: 0.98, metalness: 0, map: createNoiseTexture() }),
    rubber: new THREE.MeshStandardMaterial({ color: '#111514', roughness: 0.9, metalness: 0.05 }),
    lens: new THREE.MeshPhysicalMaterial({ color: '#102534', roughness: 0.08, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }),
    safetyYellow: new THREE.MeshStandardMaterial({ color: '#e0aa19', roughness: 0.38, metalness: 0.34 }),
    led: new THREE.MeshStandardMaterial({ color: '#ffe36d', emissive: '#ffd84c', emissiveIntensity: 0.25, roughness: 0.28, toneMapped: false }),
  };
}

export function disposeRailwayMaterialPalette(palette: RailwayMaterialPalette) {
  Object.values(palette).forEach((material) => {
    if ('map' in material && material.map) material.map.dispose();
    material.dispose();
  });
}
