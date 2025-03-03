'use client';

import { useMemo } from 'react';
import { ClampToEdgeWrapping, Color, LinearFilter, TextureLoader, type ColorRepresentation, Vector2 } from 'three';
import SmartMesh, { type SmartMeshProps } from '@/app/components/SmartMesh';
import { useLoader } from '@react-three/fiber';

export type GlyphDitherProps = {
  color?: ColorRepresentation;
  backgroundColor?: ColorRepresentation;
  whirlFactor?: number;
  timeFactor?: number;
  center?: [number, number];
  gridSize?: number;
} & Omit<SmartMeshProps, 'uniforms' | 'vertexShader' | 'fragmentShader'>;

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 color;
  uniform vec3 backgroundColor;
  uniform sampler2D glyphAtlasTexture;
  uniform float whirlFactor;
  uniform float timeFactor;
  uniform vec2 center;
  uniform float gridSize;

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Swirl math
    vec2 toCenter = vUv - center;
    float dist = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);

    float positionOffset = random(vUv) * 0.5;
    float modifiedAngle = angle + (1.0 - dist) * whirlFactor + time * timeFactor + positionOffset;

    // Grid in swirl space
    vec2 swirlCoord = vec2(
      gridSize * dist * cos(modifiedAngle),
      gridSize * dist * sin(modifiedAngle)
    );
    vec2 swirlCoordFloor = floor(swirlCoord);
    vec2 fractCoord = fract(swirlCoord);

    // Atlas info
    ivec2 atlasSize = textureSize(glyphAtlasTexture, 0);
    float glyphHeight = 48.0;
    float numCols = float(atlasSize.x) / glyphHeight;

    // Pick a random glyph index
    float rnd = random(swirlCoordFloor);
    float spriteIndex = floor(rnd * numCols);
    spriteIndex = clamp(spriteIndex, 0.0, numCols - 1.0);

    // Sample glyph from atlas
    float uSize = 1.0 / numCols;
    vec2 spriteUV = vec2(
      spriteIndex * uSize + fractCoord.x * uSize,
      fractCoord.y
    );
    vec4 glyphSample = texture2D(glyphAtlasTexture, spriteUV);

    // Mix colors based on glyph sample
    vec3 finalColor = mix(backgroundColor, color, glyphSample.r);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function GlyphDither({
  color = '#0066ff',
  backgroundColor = '#000000',
  whirlFactor = 0.1,
  timeFactor = 0.1,
  center = [0.5, 0.5],
  gridSize = 100.0,
  shouldRender,
  fpsCap = 24,
  seed = 1002,
  ...delegated
}: GlyphDitherProps) {
  const glyphAtlasTexture = useLoader(TextureLoader, '/atlas.png');
  glyphAtlasTexture.wrapS = ClampToEdgeWrapping;
  glyphAtlasTexture.wrapT = ClampToEdgeWrapping;
  glyphAtlasTexture.minFilter = LinearFilter;
  glyphAtlasTexture.magFilter = LinearFilter;

  const uniforms = useMemo(
    () => ({
      color: { value: new Color(color) },
      backgroundColor: { value: new Color(backgroundColor) },
      glyphAtlasTexture: { value: glyphAtlasTexture },
      whirlFactor: { value: whirlFactor },
      timeFactor: { value: timeFactor },
      center: { value: new Vector2(...center) },
      gridSize: { value: gridSize },
    }),
    [color, backgroundColor, glyphAtlasTexture, whirlFactor, timeFactor, center, gridSize]
  );

  return (
    <SmartMesh
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      shouldRender={shouldRender}
      fpsCap={fpsCap}
      seed={seed}
      {...delegated}
    />
  );
}
