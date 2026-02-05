import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Line, Billboard, useTexture } from '@react-three/drei';
import { useRef, Suspense, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import apexLogoSrc from '@/assets/apex-logo.png';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_LIGHT = '#ffe066';
const CYAN_ACTIVE = '#00d4ff';
const CYAN_GLOW = '#40e0ff';

// Ethereal Logo in background
function BackgroundLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(apexLogoSrc);
  
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <Billboard position={[0, 1, -6]}>
      <mesh ref={meshRef} scale={[6, 6, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}

// Ultimate Sacred Pyramid at top
const TopPyramid = forwardRef<THREE.Group, {}>(function TopPyramid(_props, forwardedRef) {
  const groupRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.08) * 0.04;
    }
    if (eyeRef.current) {
      const pulse = 1 + Math.sin(time * 1.8) * 0.25;
      eyeRef.current.scale.setScalar(pulse);
    }
    if (raysRef.current) {
      raysRef.current.rotation.z = time * 0.03;
    }
  });

  const pyramidLines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    const apex = new THREE.Vector3(0, 1.4, 0);
    const baseSize = 1;
    const baseY = -0.3;
    
    const base = [
      new THREE.Vector3(0, baseY, baseSize),
      new THREE.Vector3(-baseSize * 0.866, baseY, -baseSize * 0.5),
      new THREE.Vector3(baseSize * 0.866, baseY, -baseSize * 0.5),
    ];
    
    base.forEach(point => points.push([apex, point]));
    points.push([base[0], base[1]]);
    points.push([base[1], base[2]]);
    points.push([base[2], base[0]]);
    
    return points;
  }, []);

  return (
    <group
      ref={(node) => {
        groupRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as any).current = node;
      }}
      position={[0, 2.5, -2]}
      scale={0.7}
    >
      {/* Main pyramid */}
      {pyramidLines.map((line, i) => (
        <line key={`main-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0].toArray(), ...line[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.9} />
        </line>
      ))}
      
      {/* Inner pyramid */}
      {pyramidLines.map((line, i) => {
        const inner = line.map(v => v.clone().multiplyScalar(0.5));
        return (
          <line key={`inner-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...inner[0].toArray(), ...inner[1].toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={GOLD_LIGHT} transparent opacity={0.6} />
          </line>
        );
      })}
      
      {/* Eye */}
      <mesh ref={eyeRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={GOLD_LIGHT} />
      </mesh>
      
      {/* Eye glow layers */}
      <mesh position={[0, 0.4, 0]} scale={2}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]} scale={4}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.15} />
      </mesh>
      
      {/* Rays */}
      <group ref={raysRef} position={[0, 0.4, 0]}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <planeGeometry args={[0.008, 1.5 + (i % 2) * 0.5]} />
              <meshBasicMaterial 
                color={GOLD_LIGHT} 
                transparent 
                opacity={0.25}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Halo ring */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.012, 8, 48]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.5} />
      </mesh>
    </group>
  );
});

// Network node with enhanced glow
function NetworkNode({ position, isActive }: { 
  position: [number, number, number]; 
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = isActive ? CYAN_ACTIVE : GOLD_PRIMARY;
  const glowColor = isActive ? CYAN_GLOW : GOLD_BRIGHT;
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + position[0] * 2;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.6) * 0.04;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.4;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={isActive ? 2.5 : 1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Multi-layer glow */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={isActive ? 0.5 : 0.25} />
      </mesh>
      <mesh position={position} scale={2}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      
      {/* Orbital ring for active nodes */}
      {isActive && (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.01, 8, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

// Central hub - enhanced
const CentralHub = forwardRef<THREE.Group, {}>(function CentralHub(_props, forwardedRef) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.12;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 1.2) * 0.25;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={(node) => {
        groupRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as any).current = node;
      }}
      position={[0, 0, 0]}
    >
      {/* Core diamond */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={CYAN_ACTIVE}
          emissive={CYAN_GLOW}
          emissiveIntensity={2}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial color={CYAN_GLOW} transparent opacity={0.6} />
      </mesh>
      
      {/* Outer glow */}
      <mesh scale={2.5}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={CYAN_ACTIVE} transparent opacity={0.2} />
      </mesh>
      
      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.015, 8, 64]} />
        <meshBasicMaterial color={CYAN_ACTIVE} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[0.55, 0.01, 8, 64]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 3, -Math.PI / 3, 0]}>
        <torusGeometry args={[0.7, 0.008, 8, 64]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.2} />
      </mesh>
    </group>
  );
});

function Scene() {
  const nodes = useMemo(() => [
    { position: [-1.4, 0.7, 0] as [number, number, number], isActive: true },
    { position: [1.4, 0.6, 0] as [number, number, number], isActive: true },
    { position: [0, -0.9, 0] as [number, number, number], isActive: true },
    { position: [-2.2, -0.3, -0.4] as [number, number, number], isActive: false },
    { position: [2.2, -0.5, -0.3] as [number, number, number], isActive: false },
    { position: [-1, 1.3, -0.3] as [number, number, number], isActive: false },
    { position: [0.8, 1.4, -0.4] as [number, number, number], isActive: false },
    { position: [-2.5, 0.6, -0.5] as [number, number, number], isActive: false },
    { position: [2.5, 1, -0.5] as [number, number, number], isActive: false },
    { position: [0, -1.5, -0.3] as [number, number, number], isActive: false },
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
    
    // Active triangle
    lines.push({ points: [nodes[0].position, nodes[1].position], isActive: true });
    lines.push({ points: [nodes[1].position, nodes[2].position], isActive: true });
    lines.push({ points: [nodes[0].position, nodes[2].position], isActive: true });
    
    // Additional connections
    lines.push({ points: [nodes[3].position, nodes[0].position], isActive: false });
    lines.push({ points: [nodes[4].position, nodes[1].position], isActive: false });
    lines.push({ points: [nodes[5].position, nodes[6].position], isActive: false });
    lines.push({ points: [nodes[7].position, nodes[5].position], isActive: false });
    lines.push({ points: [nodes[8].position, nodes[6].position], isActive: false });
    
    return lines;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 4, 4]} intensity={1.5} color={GOLD_BRIGHT} />
      <pointLight position={[0, 0, 6]} intensity={0.8} color={CYAN_ACTIVE} />
      <spotLight position={[0, 5, 2]} angle={0.4} penumbra={0.8} intensity={1} color={GOLD_BRIGHT} />
      
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0.1} fade speed={0.3} />
      <Sparkles count={60} scale={10} size={1.5} speed={0.12} color={CYAN_ACTIVE} opacity={0.35} />
      <Sparkles count={40} scale={8} size={1.2} speed={0.18} color={GOLD_BRIGHT} opacity={0.25} />
      
      <BackgroundLogo />
      <TopPyramid />
      
      {/* Connection lines */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={conn.points}
          color={conn.isActive ? CYAN_ACTIVE : GOLD_PRIMARY}
          lineWidth={conn.isActive ? 2.5 : 1.2}
          transparent
          opacity={conn.isActive ? 0.8 : 0.3}
        />
      ))}
      
      <CentralHub />
      
      {nodes.map((node, i) => (
        <NetworkNode key={i} {...node} />
      ))}
    </>
  );
}

export default function UltimateMapBackground() {
  return (
    <div className="w-full h-[550px] md:h-[650px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.25]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top pyramid glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-radial from-[#d4a020]/30 to-transparent blur-[70px]" />
        
        {/* Center network glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[400px] h-[400px] bg-gradient-radial from-[#00d4ff]/25 to-transparent blur-[60px]" />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
      </div>
      
      {/* Status indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 flex flex-col items-center gap-5 pointer-events-none">
        <div className="px-6 py-2.5 glass-card border-[#00d4ff]/40 text-xs uppercase tracking-[0.3em] text-[#00d4ff] font-semibold shadow-[0_0_30px_rgba(0,212,255,0.4)]">
          Active
        </div>
        <div className="h-20 w-px bg-gradient-to-b from-[#00d4ff]/60 to-transparent" />
        <div className="px-6 py-2.5 glass-card border-primary/25 text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Frozen
        </div>
      </div>
    </div>
  );
}
