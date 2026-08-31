import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { CameraEquipment, EquipmentDefinition, OperatorMode } from '../../data/equipment/equipmentRegistry';
import { clampOperatorTarget, getOverviewPreset, type OperatorPreset, type OperatorViewState } from './operatorCameraState';

interface Props {
  enabled: boolean;
  mode: OperatorMode;
  preset: OperatorPreset;
  selectedEquipment: EquipmentDefinition | null;
  resetToken: number;
  onExitPov: () => void;
}

export function OperatorCameraController({ enabled, mode, preset, selectedEquipment, resetToken, onExitPov }: Props) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const destinationPosition = useRef(new THREE.Vector3());
  const destinationTarget = useRef(new THREE.Vector3());
  const destinationFov = useRef(50);
  const transitioning = useRef(false);
  const previousMode = useRef<OperatorMode>('explore');
  const savedView = useRef<OperatorViewState | null>(null);
  const pressedKeys = useRef(new Set<string>());

  const beginTransition = (view: OperatorViewState) => {
    destinationPosition.current.fromArray(view.position as [number, number, number]);
    destinationTarget.current.fromArray(view.target as [number, number, number]);
    destinationFov.current = view.fov;
    transitioning.current = true;
  };

  useEffect(() => {
    if (!enabled || !controls.current) return;
    if (mode !== 'explore' && previousMode.current === 'explore') {
      savedView.current = {
        position: camera.position.toArray() as [number, number, number],
        target: controls.current.target.toArray() as [number, number, number],
        fov: (camera as THREE.PerspectiveCamera).fov,
      };
    }
    if (mode === 'explore' && previousMode.current !== 'explore' && savedView.current) {
      beginTransition(savedView.current);
    } else if (selectedEquipment && mode === 'focus') {
      beginTransition({ position: selectedEquipment.focusPosition, target: selectedEquipment.position, fov: 48 });
    } else if (selectedEquipment && mode === 'pov' && (selectedEquipment.kind === 'camera' || selectedEquipment.kind === 'line-scan')) {
      const selectedCamera = selectedEquipment as CameraEquipment;
      const position = new THREE.Vector3(...selectedCamera.position);
      const target = new THREE.Vector3(...selectedCamera.lookTarget);
      const direction = target.clone().sub(position).normalize();
      position.addScaledVector(direction, 0.09);
      beginTransition({ position: position.toArray() as [number, number, number], target: selectedCamera.lookTarget, fov: selectedCamera.fov });
    }
    previousMode.current = mode;
  }, [enabled, mode, selectedEquipment, camera]);

  useEffect(() => {
    if (!enabled) return;
    beginTransition(getOverviewPreset(preset));
  }, [enabled, preset, resetToken]);

  useEffect(() => {
    if (!enabled) return;
    const keyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, button')) return;
      if (event.code === 'Escape' && mode === 'pov') onExitPov();
      if (event.code === 'Home') beginTransition(getOverviewPreset('site'));
      pressedKeys.current.add(event.code);
    };
    const keyUp = (event: KeyboardEvent) => pressedKeys.current.delete(event.code);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      pressedKeys.current.clear();
    };
  }, [enabled, mode, onExitPov]);

  useFrame((_, dt) => {
    if (!enabled || !controls.current) return;
    const perspective = camera as THREE.PerspectiveCamera;
    if (transitioning.current) {
      const t = 1 - Math.exp(-dt * 5.2);
      camera.position.lerp(destinationPosition.current, t);
      controls.current.target.lerp(destinationTarget.current, t);
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, destinationFov.current, t);
      perspective.updateProjectionMatrix();
      if (camera.position.distanceTo(destinationPosition.current) < 0.035 && controls.current.target.distanceTo(destinationTarget.current) < 0.035) {
        camera.position.copy(destinationPosition.current);
        controls.current.target.copy(destinationTarget.current);
        perspective.fov = destinationFov.current;
        perspective.updateProjectionMatrix();
        transitioning.current = false;
      }
    }

    if (mode !== 'pov' && !transitioning.current && pressedKeys.current.size) {
      const speed = pressedKeys.current.has('ShiftLeft') || pressedKeys.current.has('ShiftRight') ? 18 : 7;
      const movement = new THREE.Vector3();
      const forward = controls.current.target.clone().sub(camera.position);
      forward.y = 0;
      if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
      if (pressedKeys.current.has('KeyW')) movement.add(forward);
      if (pressedKeys.current.has('KeyS')) movement.sub(forward);
      if (pressedKeys.current.has('KeyD')) movement.add(right);
      if (pressedKeys.current.has('KeyA')) movement.sub(right);
      if (pressedKeys.current.has('KeyE')) movement.y += 1;
      if (pressedKeys.current.has('KeyQ')) movement.y -= 1;
      if (movement.lengthSq()) {
        movement.normalize().multiplyScalar(speed * dt);
        camera.position.add(movement);
        const target = controls.current.target.clone().add(movement);
        controls.current.target.fromArray(clampOperatorTarget(target.toArray() as [number, number, number]));
      }
    }
    controls.current.enabled = mode !== 'pov' && !transitioning.current;
    controls.current.update();
  });

  if (!enabled) return null;
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      enablePan
      enableRotate
      enableZoom
      zoomToCursor
      screenSpacePanning
      minDistance={0.8}
      maxDistance={140}
      minPolarAngle={0.04}
      maxPolarAngle={Math.PI / 2.01}
      target={[-8, 0.5, 0]}
    />
  );
}
