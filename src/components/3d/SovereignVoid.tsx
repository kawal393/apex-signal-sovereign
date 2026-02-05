// TRUE WEBGL 3D DEPTH - React Three Fiber
// Actual 3D coordinate space with camera movement on scroll

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle field in true 3D space
function ParticleField({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in 3D space - sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 40;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Gold to purple gradient based on position
      const t = Math.random();
      if (t > 0.7) {
        // Purple particles
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 0.8;
      } else if (t > 0.3) {
        // Gold particles
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.3;
      } else {
        // Silver particles
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.85;
      }
    }
    return colors;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

// Central golden orb - the APEX core
function GoldenOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || !glowRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
    ref.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2.5);
  });

  return (
    <group>
      {/* Core orb */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#d4a020" transparent opacity={0.9} />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#d4a020" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Orbital rings - sacred geometry
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.1;
      ring1.current.rotation.y = t * 0.15;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.08;
      ring2.current.rotation.z = t * 0.12;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.06;
      ring3.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group>
      {/* Gold ring */}
      <mesh ref={ring1}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#d4a020" transparent opacity={0.6} />
      </mesh>
      {/* Silver ring */}
      <mesh ref={ring2}>
        <torusGeometry args={[4.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#a0a0a0" transparent opacity={0.4} />
      </mesh>
      {/* Purple ring */}
      <mesh ref={ring3}>
        <torusGeometry args={[6, 0.01, 16, 100]} />
        <meshBasicMaterial color="#8040c0" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Camera controller - responds to scroll
function CameraController({ scrollDepth = 0 }: { scrollDepth: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Move camera based on scroll - traveling through the void
    const targetZ = 25 - scrollDepth * 20;
    const targetY = scrollDepth * 5;
    const targetX = Math.sin(scrollDepth * Math.PI) * 3;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
    
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
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 15, 60]} />
        
        <CameraController scrollDepth={scrollDepth} />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#d4a020" />
        
        <ParticleField count={4000} />
        <GoldenOrb />
        <OrbitalRings />
      </Canvas>
    </div>
  );
}