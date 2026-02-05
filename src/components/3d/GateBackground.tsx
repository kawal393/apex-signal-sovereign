import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, Environment } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_LIGHT = '#ffe066';

// Sacred Pyramid with glowing center - matching reference
function SacredPyramid() {
  const groupRef = useRef<THREE.Group>(null);
  const centerOrbRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
      groupRef.current.position.y = Math.sin(time * 0.3) * 0.08;
    }
    if (centerOrbRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.15;
      centerOrbRef.current.scale.setScalar(pulse);
    }
    if (raysRef.current) {
      raysRef.current.rotation.z = time * 0.05;
    }
  });

  const pyramidLines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    const apex = new THREE.Vector3(0, 1.8, 0);
    const baseSize = 1.4;
    const baseY = -0.6;
    
    // Triangle base points
    const base = [
      new THREE.Vector3(0, baseY, baseSize),
      new THREE.Vector3(-baseSize * 0.866, baseY, -baseSize * 0.5),
      new THREE.Vector3(baseSize * 0.866, baseY, -baseSize * 0.5),
    ];
    
    // Edges from apex to base
    base.forEach(point => points.push([apex, point]));
    // Base edges
    points.push([base[0], base[1]]);
    points.push([base[1], base[2]]);
    points.push([base[2], base[0]]);
    
    return points;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Pyramid wireframe edges */}
      {pyramidLines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0].toArray(), ...line[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.9} linewidth={2} />
        </line>
      ))}
      
      {/* Inner pyramid - smaller */}
      {pyramidLines.map((line, i) => {
        const innerLine = line.map(v => v.clone().multiplyScalar(0.6));
        return (
          <line key={`inner-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...innerLine[0].toArray(), ...innerLine[1].toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.5} />
          </line>
        );
      })}

      {/* Center glowing orb */}
      <mesh ref={centerOrbRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color={GOLD_LIGHT} />
      </mesh>
      
      {/* Orb glow layers */}
      <mesh position={[0, 0.4, 0]} scale={1.5}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]} scale={2.5}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.15} />
      </mesh>

      {/* Ethereal light rays */}
      <group ref={raysRef} position={[0, 0.4, 0]}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const length = 2 + (i % 2) * 0.8;
          return (
            <mesh key={i} rotation={[0, 0, angle]} position={[0, 0, 0]}>
              <planeGeometry args={[0.008, length]} />
              <meshBasicMaterial 
                color={GOLD_BRIGHT} 
                transparent 
                opacity={0.25 - (i % 3) * 0.05} 
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>

      {/* Orbital rings around pyramid */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
        <torusGeometry args={[0.8, 0.012, 8, 64]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]} position={[0, 0.5, 0]}>
        <torusGeometry args={[1.1, 0.008, 8, 64]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// Portal Frame - matching reference dark frame
function PortalFrame() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {/* Left pillar */}
      <mesh position={[-2.2, 0, 0]}>
        <boxGeometry args={[0.15, 5, 0.15]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.08}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Right pillar */}
      <mesh position={[2.2, 0, 0]}>
        <boxGeometry args={[0.15, 5, 0.15]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.08}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Top beam */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[4.6, 0.12, 0.12]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.1}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Bottom beam */}
      <mesh position={[0, -2.5, 0]}>
        <boxGeometry args={[4.6, 0.12, 0.12]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.08}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Corner accents */}
      {[[-2.2, 2.5], [2.2, 2.5], [-2.2, -2.5], [2.2, -2.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={GOLD_BRIGHT} />
        </mesh>
      ))}
    </group>
  );
}

// Atmospheric fog/mist at bottom
function AtmosphericMist() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.5, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 4]} />
      <meshBasicMaterial 
        color="#1a1a2e"
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 2, 3]} intensity={1.2} color={GOLD_BRIGHT} distance={10} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color={GOLD_PRIMARY} />
      <spotLight 
        position={[0, 5, 2]} 
        angle={0.4} 
        penumbra={0.8} 
        intensity={0.8} 
        color={GOLD_BRIGHT}
        castShadow
      />
      
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={0.3} />
      <Sparkles count={100} scale={8} size={1.5} speed={0.2} color={GOLD_BRIGHT} opacity={0.4} />
      
      <SacredPyramid />
      <PortalFrame />
      <AtmosphericMist />
    </>
  );
}

export default function GateBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central golden glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#d4a020]/30 via-[#d4a020]/10 to-transparent blur-[80px]" />
        
        {/* Bottom mist */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0a0a15]/90 via-[#0a0a15]/40 to-transparent" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>
    </div>
  );
}
