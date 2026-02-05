import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Sacred golden color palette
const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_DEEP = '#8b6914';

function FloatingRing({ position, rotation, scale }: { position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={GOLD_PRIMARY}
          emissive={GOLD_BRIGHT}
          emissiveIntensity={0.4}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function SacredTriangle({ position, rotation, scale }: { position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(0, 1.2);
  triangleShape.lineTo(-1, -0.8);
  triangleShape.lineTo(1, -0.8);
  triangleShape.lineTo(0, 1.2);

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Outer triangle frame */}
      <mesh>
        <shapeGeometry args={[triangleShape]} />
        <meshStandardMaterial
          color={GOLD_DEEP}
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner glow lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.ShapeGeometry(triangleShape)]} />
        <lineBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

function FloatingOrb({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1);
    }
  });

  return (
    <group>
      {/* Core orb */}
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1.2}
          iridescenceThicknessRange={[100, 800]}
          transmission={0.95}
          roughness={0}
          color={GOLD_PRIMARY}
        />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef} position={position} scale={scale * 1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={GOLD_BRIGHT}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function EtherealRays({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      rotation: [0, 0, angle] as [number, number, number],
    };
  });

  return (
    <group ref={groupRef} position={position}>
      {rays.map((ray, i) => (
        <mesh key={i} rotation={ray.rotation}>
          <planeGeometry args={[0.02, 4]} />
          <meshBasicMaterial
            color={GOLD_BRIGHT}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingMonolith({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[0.2, 2.5, 0.08]} />
      <meshStandardMaterial
        color="#0a0908"
        emissive={GOLD_PRIMARY}
        emissiveIntensity={0.08}
        metalness={0.98}
        roughness={0.02}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD_BRIGHT}
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color={GOLD_BRIGHT} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color={GOLD_PRIMARY} />
      <pointLight position={[0, 5, 0]} intensity={0.6} color={GOLD_BRIGHT} />
      
      {/* Central sacred orb */}
      <FloatingOrb position={[0, 0, -2]} scale={1.2} />
      
      {/* Sacred triangle frames */}
      <SacredTriangle position={[0, 0, -3]} rotation={[0, 0, 0]} scale={2} />
      <SacredTriangle position={[0, 0, -4]} rotation={[0, 0, Math.PI]} scale={1.5} />
      
      {/* Ethereal rays from center */}
      <EtherealRays position={[0, 0, -3]} />
      
      {/* Surrounding orbital rings */}
      <FloatingRing position={[-2.5, 1, -4]} rotation={[0.6, 0, 0.4]} scale={1.4} />
      <FloatingRing position={[2.5, -0.5, -5]} rotation={[-0.4, 0.6, 0]} scale={1} />
      <FloatingRing position={[1.5, 1.5, -6]} rotation={[0.3, -0.4, 0.6]} scale={1.2} />
      <FloatingRing position={[-1.5, -1, -5.5]} rotation={[-0.2, 0.3, -0.5]} scale={0.9} />
      
      {/* Floating monoliths */}
      <FloatingMonolith position={[-4, 0, -7]} rotation={[0, 0.5, 0.1]} />
      <FloatingMonolith position={[4, -0.5, -8]} rotation={[0, -0.3, -0.1]} />
      <FloatingMonolith position={[0, -2, -9]} rotation={[0.1, 0, 0]} />
      
      {/* Particle field */}
      <ParticleField />
    </>
  );
}

export default function ApexBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Light bloom effects */}
      <div className="light-bloom top-1/4 left-1/4 animate-pulse-glow" />
      <div className="light-bloom bottom-1/4 right-1/4 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 sacred-glow" />
    </div>
  );
}
