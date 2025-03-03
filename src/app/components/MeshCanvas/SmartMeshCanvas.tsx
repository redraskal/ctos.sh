'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, ComponentProps, type ComponentType } from 'react';
import { type SmartMeshProps } from '@/app/components/SmartMesh/SmartMesh';
import { type GlyphDitherProps } from '@/app/components/GlyphDitherMesh/GlyphDitherMesh';
import { useIsObserved } from '@/app/hooks/useIsObserved';

type SmartMeshCanvasProps = {
  mesh: ComponentType<Partial<SmartMeshProps & GlyphDitherProps>>;
  meshProps?: Partial<SmartMeshProps & GlyphDitherProps>;
  /**
   * When true, the mesh will only render when visible in the viewport.
   * This helps improve performance by culling off-screen meshes.
   */
  culling?: boolean;
} & Omit<ComponentProps<'div'>, 'mesh'>;

export default function SmartMeshCanvas({ 
  mesh: MeshComponent, 
  meshProps = {}, 
  culling = false,
  ...delegated 
}: SmartMeshCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const isObserved = useIsObserved(ref);
  const shouldRender = useRef(!culling || isObserved);

  return (
    <div {...delegated} className="absolute inset-0 mx-0">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        dpr={[1, 2]}
        ref={ref}
        className={delegated.className}
      >
        <Suspense fallback={null}>
          <MeshComponent shouldRender={shouldRender} {...meshProps} />
        </Suspense>
      </Canvas>
    </div>
  );
}
