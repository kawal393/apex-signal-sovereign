// TRUE WEBGL 3D DEPTH - React Three Fiber (PERFORMANCE OPTIMIZED)
// Frame-skipping, reduced particles, simplified post-processing

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import apexLogo from '@/assets/apex-logo.png';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Shared cursor state for 3D projection
interface CursorState {
  position: THREE.Vector3;
  active: boolean;
}

// Cursor-reactive particle field - particles drift toward mouse
// OPTIMIZED: Reduced count, skip frames, simplified physics
function CursorReactiveParticles({ 
  count = 400, 
  cursorState 
}: { 
  count?: number;
  cursorState: CursorState;
}) {
  const ref = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const frameSkip = useRef(0);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 20;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const t = Math.random();
      if (t > 0.8) {
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.25;
        colors[i * 3 + 2] = 0.7;
      } else if (t > 0.4) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.78;
        colors[i * 3 + 2] = 0.82;
      } else {
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.55;
      }
    }
    return [positions, colors];
  }, [count]);

  useEffect(() => {
    velocitiesRef.current = new Float32Array(count * 3).fill(0);
    originalPositionsRef.current = new Float32Array(positions);
  }, [count, positions]);

  useFrame((state) => {
    if (!ref.current || !velocitiesRef.current || !originalPositionsRef.current) return;
    
    // Skip every other frame for performance
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    
    const geometry = ref.current.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;
    const velocities = velocitiesRef.current;
    const origPositions = originalPositionsRef.current;
    
    const cursorPos = cursorState.position;
    const cursorActive = cursorState.active;
    const time = state.clock.elapsedTime;
    
    // Process particles in batches for cache efficiency
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      
      const px = posArray[ix];
      const py = posArray[iy];
      const pz = posArray[iz];
      
      // Simplified cursor attraction
      if (cursorActive) {
        const dx = cursorPos.x - px;
        const dy = cursorPos.y - py;
        const dz = cursorPos.z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < 225 && distSq > 0.01) { // 15^2 = 225
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 15) * 0.025;
          velocities[ix] += dx / dist * force;
          velocities[iy] += dy / dist * force;
          velocities[iz] += dz / dist * force;
        }
      }
      
      // Return to origin
      velocities[ix] += (origPositions[ix] - px) * 0.004;
      velocities[iy] += (origPositions[iy] - py) * 0.004;
      velocities[iz] += (origPositions[iz] - pz) * 0.004;
      
      // Damping and apply
      velocities[ix] *= 0.94;
      velocities[iy] *= 0.94;
      velocities[iz] *= 0.94;
      
      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];
    }
    
    positionAttr.needsUpdate = true;
    ref.current.rotation.y = time * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </Points>
  );
}

// Ambient particle field - background depth (OPTIMIZED: static, no per-frame updates)
function AmbientParticles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 35;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const t = Math.random();
      if (t > 0.85) {
        colors[i * 3] = 0.35;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.5;
      } else {
        const grey = 0.25 + Math.random() * 0.2;
        colors[i * 3] = grey;
        colors[i * 3 + 1] = grey;
        colors[i * 3 + 2] = grey + 0.05;
      }
    }
    return [positions, colors];
  }, [count]);

  // Slower rotation, update every 3rd frame
  const frameSkip = useRef(0);
  useFrame((state) => {
    if (!ref.current) return;
    frameSkip.current++;
    if (frameSkip.current % 3 !== 0) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.005;
    ref.current.rotation.y = state.clock.elapsedTime * 0.003;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

// Central silver orb - OPTIMIZED: lower geometry, skip frames
function SilverOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const frameSkip = useRef(0);

  useFrame((state) => {
    if (!ref.current || !glowRef.current) return;
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    const pulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.12 + 1;
    ref.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2.5);
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#b0b0b8" transparent opacity={0.95} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#7050a0" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// Orbital rings - OPTIMIZED: 2 rings instead of 4, lower segments
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const frameSkip = useRef(0);

  useFrame((state) => {
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.06;
      ring1.current.rotation.y = t * 0.08;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.04;
      ring2.current.rotation.z = t * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={ring1}>
        <torusGeometry args={[3, 0.02, 8, 48]} />
        <meshBasicMaterial color="#c0c0c8" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[5, 0.015, 8, 48]} />
        <meshBasicMaterial color="#6040a0" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// 3D Logo Plane - embedded in the scene with depth and occlusion
function LogoPlane() {
  const ref = useRef<THREE.Group>(null);
  const texture = useTexture(apexLogo);
  
  // Configure texture for proper transparency
  texture.premultiplyAlpha = false;
  
  useFrame((state) => {
    if (!ref.current) return;
    // Subtle breathing animation synced with orb
    const pulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.03 + 1;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={[0, 0, 2]}>
      {/* Outer glow layer - large, very subtle */}
      <mesh position={[0, 0, -0.2]} renderOrder={1}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          color="#6040a0"
          transparent
          opacity={0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner glow layer - silver ambient */}
      <mesh position={[0, 0, -0.1]} renderOrder={2}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial
          color="#a0a0b0"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Main logo plane */}
      <mesh renderOrder={3}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

// Cursor tracker - projects 2D mouse to 3D space
function CursorTracker({ cursorState }: { cursorState: CursorState }) {
  const { camera, size } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse to normalized device coordinates
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      // Cast ray from camera through mouse point
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Find intersection with a plane at z=0
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        // Scale to our 3D space and add depth
        cursorState.position.set(
          intersection.x * 1.5,
          intersection.y * 1.5,
          5 // Place cursor plane in front of main content
        );
      }
      cursorState.active = true;
    };
    
    const handleMouseLeave = () => {
      cursorState.active = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [camera, size, raycaster, plane, cursorState]);
  
  return null;
}

// Camera controller - responds to scroll
function CameraController({ scrollDepth = 0 }: { scrollDepth: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Move camera based on scroll - traveling through the void
    const targetZ = 20 - scrollDepth * 15;
    const targetY = scrollDepth * 4;
    const targetX = Math.sin(scrollDepth * Math.PI) * 2;
    
    camera.position.x += (targetX - camera.position.x) * 0.015;
    camera.position.y += (targetY - camera.position.y) * 0.015;
    camera.position.z += (targetZ - camera.position.z) * 0.015;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main exported component
interface SovereignVoidProps {
  scrollDepth?: number;
  className?: string;
}

export default function SovereignVoid({ scrollDepth = 0, className = '' }: SovereignVoidProps) {
  // Cursor state shared between tracker and particles
  const [cursorState] = useState<CursorState>(() => ({
    position: new THREE.Vector3(0, 0, 5),
    active: false
  }));

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 55 }}
        dpr={[1, 1.25]}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#050508', 12, 55]} />
        
        <CameraController scrollDepth={scrollDepth} />
        <CursorTracker cursorState={cursorState} />
        
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#a0a0b0" />
        <pointLight position={[5, 5, 10]} intensity={0.3} color="#6040a0" />
        
        <CursorReactiveParticles count={400} cursorState={cursorState} />
        <AmbientParticles count={250} />
        <LogoPlane />
        <SilverOrb />
        <OrbitalRings />
        
        {/* POST-PROCESSING - OPTIMIZED: removed noise, reduced bloom */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.45}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.8}
            mipmapBlur
            radius={0.5}
          />
          <Vignette
            darkness={0.45}
            offset={0.35}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}