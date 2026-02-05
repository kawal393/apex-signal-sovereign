import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Sparkles, Stars } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

// Sacred golden color palette
const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_DEEP = '#8b6914';
const GOLD_LIGHT = '#ffe066';
const CYAN_ACCENT = '#00d4ff';

function SacredPyramid({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (innerGlowRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      const material = innerGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulse * 0.3;
    }
  });

  const pyramidGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(1, 1.8, 3);
    return geometry;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main pyramid frame */}
      <mesh geometry={pyramidGeometry}>
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* Inner sacred triangle */}
      <mesh geometry={pyramidGeometry} scale={0.7}>
        <meshStandardMaterial
          color={GOLD_BRIGHT}
          emissive={GOLD_LIGHT}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Center orb */}
      <mesh ref={innerGlowRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={GOLD_LIGHT} transparent opacity={0.8} />
      </mesh>

      {/* Outer glow sphere */}
      <mesh position={[0, 0.3, 0]} scale={1.5}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function EtherealRays({ position, count = 12 }: { position: [number, number, number]; count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  const rays = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      rotation: [0, 0, (i / count) * Math.PI * 2] as [number, number, number],
      length: 3 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.1,
    })), [count]
  );

  return (
    <group ref={groupRef} position={position}>
      {rays.map((ray, i) => (
        <mesh key={i} rotation={ray.rotation}>
          <planeGeometry args={[0.015, ray.length]} />
          <meshBasicMaterial
            color={GOLD_BRIGHT}
            transparent
            opacity={ray.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingRing({ position, rotation, scale, speed = 1 }: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function CentralOrb({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (outerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      outerRef.current.scale.setScalar(scale * 1.4 * pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.4}
          chromaticAberration={0.08}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.15}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          transmission={0.98}
          roughness={0}
          color={GOLD_PRIMARY}
        />
      </mesh>
      <mesh ref={outerRef} position={position} scale={scale * 1.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={GOLD_BRIGHT}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      
      // Mix between gold and cyan
      const isGold = Math.random() > 0.2;
      if (isGold) {
        colors[i * 3] = 0.96; // R
        colors[i * 3 + 1] = 0.77; // G
        colors[i * 3 + 2] = 0.26; // B
      } else {
        colors[i * 3] = 0; // R
        colors[i * 3 + 1] = 0.83; // G
        colors[i * 3 + 2] = 1; // B
      }
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={200} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
}

function FloatingMonolith({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[0.15, 2, 0.06]} />
      <meshStandardMaterial
        color="#0a0908"
        emissive={GOLD_PRIMARY}
        emissiveIntensity={0.1}
        metalness={0.98}
        roughness={0.02}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={1} color={GOLD_BRIGHT} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={GOLD_PRIMARY} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color={GOLD_LIGHT} />
      <pointLight position={[0, 0, 5]} intensity={0.3} color={CYAN_ACCENT} />
      
      {/* Deep space stars */}
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
      
      {/* Golden sparkles */}
      <Sparkles count={80} scale={15} size={2} speed={0.3} color={GOLD_BRIGHT} opacity={0.6} />
      
      {/* Central sacred pyramid */}
      <SacredPyramid position={[0, 0.2, -2]} scale={1.5} />
      
      {/* Ethereal light rays */}
      <EtherealRays position={[0, 0.5, -2.5]} count={16} />
      
      {/* Central orb behind pyramid */}
      <CentralOrb position={[0, 0.5, -3]} scale={0.6} />
      
      {/* Orbital rings */}
      <FloatingRing position={[-2, 0.8, -4]} rotation={[0.6, 0, 0.4]} scale={1.2} speed={0.8} />
      <FloatingRing position={[2.2, -0.3, -5]} rotation={[-0.4, 0.6, 0]} scale={0.9} speed={1.2} />
      <FloatingRing position={[1.2, 1.2, -6]} rotation={[0.3, -0.4, 0.6]} scale={1} speed={0.6} />
      <FloatingRing position={[-1.8, -0.8, -5.5]} rotation={[-0.2, 0.3, -0.5]} scale={0.8} speed={1} />
      <FloatingRing position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]} scale={2.2} speed={0.3} />
      
      {/* Floating monoliths */}
      <FloatingMonolith position={[-3.5, 0.5, -7]} rotation={[0, 0.5, 0.1]} />
      <FloatingMonolith position={[3.5, -0.3, -8]} rotation={[0, -0.3, -0.1]} />
      <FloatingMonolith position={[0, -1.5, -9]} rotation={[0.1, 0, 0]} />
      
      {/* Particle systems */}
      <ParticleField />
    </>
  );
}

export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Enhanced atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central golden bloom */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#d4a020]/20 via-[#d4a020]/5 to-transparent blur-[100px] animate-pulse-subtle" />
        
        {/* Secondary blooms */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-[#f5c542]/15 to-transparent blur-[80px] animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-[#00d4ff]/10 to-transparent blur-[60px] animate-pulse-subtle" style={{ animationDelay: '2s' }} />
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60" />
      </div>
    </div>
  );
}
