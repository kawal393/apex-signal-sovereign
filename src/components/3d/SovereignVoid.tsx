// TRUE WEBGL 3D DEPTH - React Three Fiber
// Cursor-reactive particles + Post-processing (Bloom, Chromatic Aberration)

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Shared cursor state for 3D projection
interface CursorState {
  position: THREE.Vector3;
  active: boolean;
}

// Cursor-reactive particle field - particles drift toward mouse
function CursorReactiveParticles({ 
  count = 2000, 
  cursorState 
}: { 
  count?: number;
  cursorState: CursorState;
}) {
  const ref = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute in 3D space - closer to camera for interaction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 20;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Silver/grey dominant palette
      const t = Math.random();
      if (t > 0.8) {
        // Purple particles
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.25;
        colors[i * 3 + 2] = 0.7;
      } else if (t > 0.4) {
        // Silver particles
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.78;
        colors[i * 3 + 2] = 0.82;
      } else {
        // Grey particles
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.55;
      }
    }
    return [positions, colors];
  }, [count]);

  // Initialize velocities and store original positions
  useEffect(() => {
    velocitiesRef.current = new Float32Array(count * 3).fill(0);
    originalPositionsRef.current = new Float32Array(positions);
  }, [count, positions]);

  useFrame((state) => {
    if (!ref.current || !velocitiesRef.current || !originalPositionsRef.current) return;
    
    const geometry = ref.current.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;
    const velocities = velocitiesRef.current;
    const origPositions = originalPositionsRef.current;
    
    const cursorPos = cursorState.position;
    const cursorActive = cursorState.active;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      const px = posArray[ix];
      const py = posArray[iy];
      const pz = posArray[iz];
      
      // Calculate distance to cursor
      const dx = cursorPos.x - px;
      const dy = cursorPos.y - py;
      const dz = cursorPos.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Attraction force when cursor is active and close
      if (cursorActive && dist < 15 && dist > 0.1) {
        const force = (1 - dist / 15) * 0.02;
        velocities[ix] += dx / dist * force;
        velocities[iy] += dy / dist * force;
        velocities[iz] += dz / dist * force;
      }
      
      // Return to original position slowly
      const origDx = origPositions[ix] - px;
      const origDy = origPositions[iy] - py;
      const origDz = origPositions[iz] - pz;
      
      velocities[ix] += origDx * 0.003;
      velocities[iy] += origDy * 0.003;
      velocities[iz] += origDz * 0.003;
      
      // Add subtle orbital motion
      velocities[ix] += Math.sin(time * 0.2 + i * 0.01) * 0.001;
      velocities[iy] += Math.cos(time * 0.15 + i * 0.01) * 0.001;
      
      // Damping
      velocities[ix] *= 0.95;
      velocities[iy] *= 0.95;
      velocities[iz] *= 0.95;
      
      // Apply velocity
      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];
    }
    
    positionAttr.needsUpdate = true;
    
    // Slow rotation of entire field
    ref.current.rotation.y = time * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

// Ambient particle field - background depth
function AmbientParticles({ count = 2000 }: { count?: number }) {
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
      
      // Deeper, more muted colors
      const t = Math.random();
      if (t > 0.85) {
        // Deep purple
        colors[i * 3] = 0.35;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.5;
      } else {
        // Dark grey/silver
        const grey = 0.25 + Math.random() * 0.2;
        colors[i * 3] = grey;
        colors[i * 3 + 1] = grey;
        colors[i * 3 + 2] = grey + 0.05;
      }
    }
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.008;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </Points>
  );
}

// Central silver orb - the APEX core (mystical grey)
function SilverOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || !glowRef.current || !innerGlowRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 1;
    const innerPulse = Math.sin(state.clock.elapsedTime * 0.5 + 1) * 0.1 + 1;
    ref.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 3);
    innerGlowRef.current.scale.setScalar(innerPulse * 1.5);
  });

  return (
    <group>
      {/* Core orb - silver */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial color="#b0b0b8" transparent opacity={0.95} />
      </mesh>
      {/* Inner glow - purple tint */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#6040a0" transparent opacity={0.2} />
      </mesh>
      {/* Outer glow - silver */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#909098" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// Orbital rings - sacred geometry (silver/grey/purple)
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.08;
      ring1.current.rotation.y = t * 0.12;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.06;
      ring2.current.rotation.z = t * 0.1;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.05;
      ring3.current.rotation.z = -t * 0.08;
    }
    if (ring4.current) {
      ring4.current.rotation.x = t * 0.03;
      ring4.current.rotation.y = -t * 0.04;
    }
  });

  return (
    <group>
      {/* Silver ring - closest */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.5, 0.025, 16, 100]} />
        <meshBasicMaterial color="#c0c0c8" transparent opacity={0.7} />
      </mesh>
      {/* Grey ring */}
      <mesh ref={ring2}>
        <torusGeometry args={[4, 0.018, 16, 100]} />
        <meshBasicMaterial color="#808088" transparent opacity={0.5} />
      </mesh>
      {/* Purple ring */}
      <mesh ref={ring3}>
        <torusGeometry args={[5.5, 0.012, 16, 100]} />
        <meshBasicMaterial color="#6040a0" transparent opacity={0.35} />
      </mesh>
      {/* Deep void ring */}
      <mesh ref={ring4}>
        <torusGeometry args={[7.5, 0.008, 16, 100]} />
        <meshBasicMaterial color="#404048" transparent opacity={0.2} />
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
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
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
        
        <CursorReactiveParticles count={2500} cursorState={cursorState} />
        <AmbientParticles count={2000} />
        <SilverOrb />
        <OrbitalRings />
        
        {/* POST-PROCESSING EFFECTS */}
        <EffectComposer>
          {/* Bloom - makes bright areas glow */}
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur={true}
            radius={0.85}
          />
          
          {/* Chromatic Aberration - RGB split at edges for cinematic depth */}
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0015, 0.0012)}
            radialModulation={true}
            modulationOffset={0.3}
          />
          
          {/* Vignette - darkened edges for focus */}
          <Vignette
            darkness={0.5}
            offset={0.3}
            blendFunction={BlendFunction.NORMAL}
          />
          
          {/* Subtle film grain for texture */}
          <Noise
            premultiply
            blendFunction={BlendFunction.SOFT_LIGHT}
            opacity={0.15}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}