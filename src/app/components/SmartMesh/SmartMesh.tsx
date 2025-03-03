'use client';

import { useRef, useMemo, useEffect, RefObject } from 'react';
import { ThreeElements, useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, FrontSide, IUniform } from 'three';

export type SmartMeshProps = {
  uniforms: { [uniform: string]: IUniform };
  vertexShader: string;
  fragmentShader: string;
  /**
   * External control for rendering the mesh.
   * When false, the mesh will stop rendering frames to save performance.
   * If not provided, defaults to true via an internal ref.
   */
  shouldRender?: RefObject<boolean>;
  fpsCap?: number;
  seed?: number;
} & ThreeElements['mesh'];

/**
 * A smart mesh component that handles efficient rendering of shader materials with:
 * - FPS capping
 * - Resize handling with anti-flickering
 * - Conditional rendering based on visibility
 */
export default function SmartMesh({
  uniforms,
  vertexShader,
  fragmentShader,
  shouldRender: externalShouldRender,
  fpsCap = 24,
  seed = 0,
  ...delegated
}: SmartMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const lastRender = useRef(0);
  const forceRender = useRef(false);
  const defaultShouldRender = useRef(true);
  const shouldRender = externalShouldRender ?? defaultShouldRender;

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        ...uniforms,
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: FrontSide,
    });
  }, [uniforms, vertexShader, fragmentShader]);

  /**
   * Prevents flickering artifacts during window resizing by forcing a new render.
   * This ensures smooth transitions when the component needs to adapt to new dimensions.
   */
  useEffect(() => {
    const handleResize = () => {
      forceRender.current = true;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame(({ clock, gl, scene, camera }) => {
    if (meshRef.current && shouldRender.current) {
      if (clock.elapsedTime - lastRender.current > 1 / fpsCap || forceRender.current || clock.elapsedTime == 0) {
        material.uniforms.time.value = clock.elapsedTime + seed;
        gl.render(scene, camera);
        lastRender.current = clock.elapsedTime;
        forceRender.current = false;
      }
    }
  }, 1);

  return (
    <mesh {...delegated} ref={meshRef} material={material} scale={[20, 20, 1]} position={[0, 0, -2]}>
      <planeGeometry args={[2.5, 1, 256, 256]} />
    </mesh>
  );
}
