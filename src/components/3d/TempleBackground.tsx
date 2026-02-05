import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_DEEP = '#8b6914';

function TempleArch({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Left pillar */}
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial
          color={GOLD_DEEP}
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Right pillar */}
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial
          color={GOLD_DEEP}
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Arch top */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 8, 32, Math.PI]} />
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

function SacredSymbol({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const centerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (centerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      centerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer triangle pointing up */}
      <mesh>
        <coneGeometry args={[1, 1.5, 3]} />
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner triangle pointing down */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.3, 0]} scale={0.6}>
        <coneGeometry args={[0.8, 1.2, 3]} />
        <meshStandardMaterial
          color={GOLD_BRIGHT}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Center orb */}
      <mesh ref={centerRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.9} />
      </mesh>
      
      {/* Concentric rings */}
      {[0.5, 0.7, 0.9].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <torusGeometry args={[radius, 0.01, 8, 64]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function TemplePlatform({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[2, 2.2, 0.1, 64]} />
        <meshStandardMaterial
          color="#0a0908"
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.15}
          metalness={0.98}
          roughness={0.1}
        />
      </mesh>
      
      {/* Glowing edge */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[2.1, 0.02, 8, 64]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.5} />
      </mesh>
      
      {/* Inner ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[1.5, 0.01, 8, 64]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function FloatingPillar({ position, height = 2 }: { position: [number, number, number]; height?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.12, height, 0.08]} />
        <meshStandardMaterial
          color="#0a0908"
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.12}
          metalness={0.98}
          roughness={0.02}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 5, 3]} intensity={1} color={GOLD_BRIGHT} />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color={GOLD_PRIMARY} />
      <pointLight position={[5, 3, -5]} intensity={0.4} color={GOLD_PRIMARY} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={0.8} intensity={0.6} color={GOLD_BRIGHT} />
      
      <Stars radius={80} depth={40} count={2000} factor={3} saturation={0.1} fade speed={0.3} />
      <Sparkles count={60} scale={12} size={1.5} speed={0.2} color={GOLD_BRIGHT} opacity={0.5} />
      
      {/* Central sacred symbol */}
      <SacredSymbol position={[0, 0.5, -1]} scale={1.2} />
      
      {/* Temple platform */}
      <TemplePlatform position={[0, -1.5, -1]} />
      
      {/* Background arches */}
      <TempleArch position={[-2.5, -0.5, -4]} scale={0.6} />
      <TempleArch position={[2.5, -0.5, -4]} scale={0.6} />
      <TempleArch position={[0, -0.3, -5]} scale={0.8} />
      
      {/* Floating pillars */}
      <FloatingPillar position={[-3, 0, -3]} height={2.5} />
      <FloatingPillar position={[3, 0.2, -3]} height={2.2} />
      <FloatingPillar position={[-4, -0.3, -5]} height={1.8} />
      <FloatingPillar position={[4, -0.1, -5]} height={2} />
    </>
  );
}

export default function TempleBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#d4a020]/25 via-[#d4a020]/10 to-transparent blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
