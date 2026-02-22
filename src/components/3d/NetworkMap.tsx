import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Line } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const CYAN_ACTIVE = '#00d4ff';
const CYAN_GLOW = '#00e5ff';

interface NodeData {
  id: number;
  position: [number, number, number];
  isActive: boolean;
}

function NetworkNode({ position, isActive, delay = 0 }: { position: [number, number, number]; isActive: boolean; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const color = isActive ? CYAN_ACTIVE : GOLD_PRIMARY;
  const glowColor = isActive ? CYAN_GLOW : GOLD_BRIGHT;
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.05;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.3;
      glowRef.current.scale.setScalar(pulse);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(time * 2) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Core node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={isActive ? 1.5 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.3} />
      </mesh>
      
      {/* Orbital ring for active nodes */}
      {isActive && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.15, 0.008, 8, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function ConnectionLine({ start, end, isActive }: { start: [number, number, number]; end: [number, number, number]; isActive: boolean }) {
  const color = isActive ? CYAN_ACTIVE : GOLD_PRIMARY;
  
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={isActive ? 1.5 : 0.8}
      transparent
      opacity={isActive ? 0.6 : 0.2}
    />
  );
}

function CentralHub({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (innerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central diamond */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={CYAN_ACTIVE}
          emissive={CYAN_GLOW}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={CYAN_GLOW} transparent opacity={0.4} />
      </mesh>
      
      {/* Outer rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.01, 8, 64]} />
        <meshBasicMaterial color={CYAN_ACTIVE} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[0.4, 0.008, 8, 64]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Scene() {
  const nodes: NodeData[] = useMemo(() => [
    { id: 1, position: [-1.5, 0.8, 0], isActive: true },
    { id: 2, position: [1.5, 0.6, 0], isActive: true },
    { id: 3, position: [0, -0.8, 0], isActive: true },
    { id: 4, position: [-2, -0.3, -0.5], isActive: false },
    { id: 5, position: [2.2, -0.5, -0.3], isActive: false },
    { id: 6, position: [-1, 1.2, -0.2], isActive: false },
    { id: 7, position: [0.8, 1.4, -0.4], isActive: false },
    { id: 8, position: [-2.5, 0.2, -0.6], isActive: false },
    { id: 9, position: [2.5, 1, -0.5], isActive: false },
    { id: 10, position: [0, -1.5, -0.3], isActive: false },
  ], []);

  const connections = useMemo(() => {
    const lines: { start: [number, number, number]; end: [number, number, number]; isActive: boolean }[] = [];
    const center: [number, number, number] = [0, 0.2, 0];
    
    nodes.forEach((node) => {
      lines.push({
        start: center,
        end: node.position,
        isActive: node.isActive,
      });
    });
    
    // Add some node-to-node connections
    lines.push({ start: nodes[0].position, end: nodes[1].position, isActive: true });
    lines.push({ start: nodes[1].position, end: nodes[2].position, isActive: true });
    lines.push({ start: nodes[0].position, end: nodes[2].position, isActive: true });
    lines.push({ start: nodes[3].position, end: nodes[0].position, isActive: false });
    lines.push({ start: nodes[4].position, end: nodes[1].position, isActive: false });
    
    return lines;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={CYAN_ACTIVE} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color={GOLD_BRIGHT} />
      
      <Sparkles count={50} scale={6} size={1.5} speed={0.2} color={CYAN_ACTIVE} opacity={0.4} />
      <Sparkles count={30} scale={6} size={1} speed={0.3} color={GOLD_BRIGHT} opacity={0.3} />
      
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <ConnectionLine key={i} {...conn} />
      ))}
      
      {/* Central hub */}
      <CentralHub position={[0, 0.2, 0]} />
      
      {/* Network nodes */}
      {nodes.map((node, i) => (
        <NetworkNode
          key={node.id}
          position={node.position}
          isActive={node.isActive}
          delay={i * 0.3}
        />
      ))}
    </>
  );
}

export default function NetworkMap() {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Labels overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-8">
            <div className="px-4 py-2 glass-card text-base uppercase tracking-[0.2em] text-status-active font-medium">
              Active
            </div>
            <div className="h-32" />
            <div className="px-4 py-2 glass-card text-base uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Frozen
            </div>
          </div>
        </div>
      </div>
      
      {/* Glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-status-active/20 to-transparent blur-[60px]" />
      </div>
    </div>
  );
}
