import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, Line } from '@react-three/drei';
import { useRef, Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const CYAN_ACTIVE = '#00d4ff';
const CYAN_GLOW = '#40e0ff';

// Sacred Pyramid at top - like reference
function TopPyramid() {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.03;
    }
    if (orbRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.2;
      orbRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 2.2, -2]} scale={0.8}>
      {/* Pyramid wireframe */}
      <mesh>
        <coneGeometry args={[1.2, 1.8, 3]} />
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner pyramid */}
      <mesh scale={0.6}>
        <coneGeometry args={[1.2, 1.8, 3]} />
        <meshStandardMaterial
          color={GOLD_BRIGHT}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.7}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Center orb */}
      <mesh ref={orbRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={GOLD_BRIGHT} />
      </mesh>
      
      {/* Glow */}
      <mesh position={[0, 0.2, 0]} scale={2}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.2} />
      </mesh>
      
      {/* Rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0.2, 0]} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
          <planeGeometry args={[0.01, 1.5]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Network node
function NetworkNode({ position, isActive, label }: { 
  position: [number, number, number]; 
  isActive: boolean;
  label?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = isActive ? CYAN_ACTIVE : GOLD_PRIMARY;
  const glowColor = isActive ? CYAN_GLOW : GOLD_BRIGHT;
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + position[0];
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.03;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.3;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={isActive ? 2 : 1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={isActive ? 0.4 : 0.2} />
      </mesh>
      
      {/* Orbital ring for active */}
      {isActive && (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.008, 8, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

// Central hub diamond
function CentralHub() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (innerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={CYAN_ACTIVE}
          emissive={CYAN_GLOW}
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={CYAN_GLOW} transparent opacity={0.5} />
      </mesh>
      
      {/* Outer rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.01, 8, 64]} />
        <meshBasicMaterial color={CYAN_ACTIVE} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[0.4, 0.008, 8, 64]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Scene() {
  const nodes = useMemo(() => [
    { position: [-1.2, 0.6, 0] as [number, number, number], isActive: true },
    { position: [1.2, 0.5, 0] as [number, number, number], isActive: true },
    { position: [0, -0.7, 0] as [number, number, number], isActive: true },
    { position: [-1.8, -0.2, -0.3] as [number, number, number], isActive: false },
    { position: [1.8, -0.4, -0.2] as [number, number, number], isActive: false },
    { position: [-0.8, 1, -0.2] as [number, number, number], isActive: false },
    { position: [0.6, 1.1, -0.3] as [number, number, number], isActive: false },
    { position: [-2, 0.5, -0.4] as [number, number, number], isActive: false },
    { position: [2, 0.8, -0.4] as [number, number, number], isActive: false },
    { position: [0, -1.2, -0.2] as [number, number, number], isActive: false },
  ], []);

  const connections = useMemo(() => {
    const lines: { points: [number, number, number][]; isActive: boolean }[] = [];
    const center: [number, number, number] = [0, 0, 0];
    
    nodes.forEach((node) => {
      lines.push({
        points: [center, node.position],
        isActive: node.isActive,
      });
    });
    
    // Node to node connections
    lines.push({ points: [nodes[0].position, nodes[1].position], isActive: true });
    lines.push({ points: [nodes[1].position, nodes[2].position], isActive: true });
    lines.push({ points: [nodes[0].position, nodes[2].position], isActive: true });
    lines.push({ points: [nodes[3].position, nodes[0].position], isActive: false });
    lines.push({ points: [nodes[4].position, nodes[1].position], isActive: false });
    lines.push({ points: [nodes[5].position, nodes[6].position], isActive: false });
    
    return lines;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 3, 3]} intensity={1} color={GOLD_BRIGHT} />
      <pointLight position={[0, 0, 5]} intensity={0.6} color={CYAN_ACTIVE} />
      
      <Stars radius={80} depth={40} count={3000} factor={3} saturation={0} fade speed={0.4} />
      <Sparkles count={60} scale={8} size={1.2} speed={0.15} color={CYAN_ACTIVE} opacity={0.3} />
      <Sparkles count={40} scale={8} size={1} speed={0.2} color={GOLD_BRIGHT} opacity={0.2} />
      
      <TopPyramid />
      
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={conn.points}
          color={conn.isActive ? CYAN_ACTIVE : GOLD_PRIMARY}
          lineWidth={conn.isActive ? 2 : 1}
          transparent
          opacity={conn.isActive ? 0.7 : 0.25}
        />
      ))}
      
      <CentralHub />
      
      {nodes.map((node, i) => (
        <NetworkNode key={i} {...node} />
      ))}
    </>
  );
}

export default function MapBackground() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top pyramid glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-radial from-[#d4a020]/25 to-transparent blur-[60px]" />
        
        {/* Center network glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[300px] h-[300px] bg-gradient-radial from-[#00d4ff]/20 to-transparent blur-[50px]" />
      </div>
      
      {/* Status labels */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center gap-4 pointer-events-none">
        <div className="px-5 py-2 glass-card border-[#00d4ff]/30 text-xs uppercase tracking-[0.25em] text-[#00d4ff] font-semibold shadow-[0_0_20px_rgba(0,212,255,0.3)]">
          Active
        </div>
        <div className="h-16 w-px bg-gradient-to-b from-[#00d4ff]/50 to-transparent" />
        <div className="px-5 py-2 glass-card border-primary/20 text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
          Frozen
        </div>
      </div>
    </div>
  );
}
