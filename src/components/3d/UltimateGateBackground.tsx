import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars, useTexture, Billboard } from '@react-three/drei';
import { useRef, Suspense, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import apexLogoSrc from '@/assets/apex-logo.png';

const GOLD_PRIMARY = '#d4a020';
const GOLD_BRIGHT = '#f5c542';
const GOLD_LIGHT = '#ffe066';
const GOLD_DEEP = '#b8860b';

// Ethereal Logo Background - Glowing presence
function EtherealLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(apexLogoSrc);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(time * 0.5) * 0.05;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.1;
      glowRef.current.scale.setScalar(pulse * 8);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(time * 0.5) * 0.04;
    }
  });

  return (
    <group position={[0, 0.5, -8]}>
      {/* Massive glow behind logo */}
      <mesh ref={glowRef} scale={8}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.12} />
      </mesh>
      
      {/* Logo texture */}
      <Billboard>
        <mesh ref={meshRef} scale={[4, 4, 1]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

// Ultimate Sacred Pyramid with All-Seeing Eye
function SacredPyramid() {
  const groupRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const innerEyeRef = useRef<THREE.Mesh>(null);
  const raysGroupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.08) * 0.03;
      groupRef.current.position.y = 0.5 + Math.sin(time * 0.3) * 0.06;
    }
    if (eyeRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.2;
      eyeRef.current.scale.setScalar(pulse);
    }
    if (innerEyeRef.current) {
      innerEyeRef.current.rotation.z = time * 0.3;
    }
    if (raysGroupRef.current) {
      raysGroupRef.current.rotation.z = time * 0.02;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = -time * 0.05;
    }
  });

  const pyramidGeometry = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    const apex = new THREE.Vector3(0, 2.2, 0);
    const baseSize = 1.6;
    const baseY = -0.4;
    
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
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Main Pyramid wireframe */}
      {pyramidGeometry.map((line, i) => (
        <line key={`main-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0].toArray(), ...line[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.95} linewidth={3} />
        </line>
      ))}
      
      {/* Inner pyramid layer */}
      {pyramidGeometry.map((line, i) => {
        const innerLine = line.map(v => v.clone().multiplyScalar(0.65));
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

      {/* Third inner pyramid */}
      {pyramidGeometry.map((line, i) => {
        const deepLine = line.map(v => v.clone().multiplyScalar(0.35));
        return (
          <line key={`deep-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...deepLine[0].toArray(), ...deepLine[1].toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={GOLD_LIGHT} transparent opacity={0.7} />
          </line>
        );
      })}

      {/* All-Seeing Eye - Multi-layered */}
      <group position={[0, 0.7, 0.1]}>
        {/* Core eye */}
        <mesh ref={eyeRef}>
          <sphereGeometry args={[0.22, 48, 48]} />
          <meshBasicMaterial color={GOLD_LIGHT} />
        </mesh>
        
        {/* Eye inner detail */}
        <mesh ref={innerEyeRef}>
          <torusGeometry args={[0.12, 0.02, 8, 32]} />
          <meshBasicMaterial color={GOLD_DEEP} />
        </mesh>
        
        {/* Glow layer 1 */}
        <mesh scale={1.8}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.4} />
        </mesh>
        
        {/* Glow layer 2 */}
        <mesh scale={3}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.2} />
        </mesh>
        
        {/* Glow layer 3 - massive */}
        <mesh scale={5}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.08} />
        </mesh>
      </group>

      {/* Divine Light Rays - More dramatic */}
      <group ref={raysGroupRef} position={[0, 0.7, 0]}>
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          const length = 3.5 + (i % 3) * 0.8;
          const width = i % 2 === 0 ? 0.015 : 0.008;
          const opacity = 0.35 - (i % 4) * 0.06;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <planeGeometry args={[width, length]} />
              <meshBasicMaterial 
                color={i % 2 === 0 ? GOLD_LIGHT : GOLD_BRIGHT} 
                transparent 
                opacity={opacity}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Sacred Halo Rings */}
      <group ref={haloRef} position={[0, 0.7, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.015, 8, 64]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[1.3, 0.01, 8, 64]} />
          <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, -0.3, 0]}>
          <torusGeometry args={[1.7, 0.008, 8, 64]} />
          <meshBasicMaterial color={GOLD_PRIMARY} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Triangular accents at vertices */}
      {[
        [0, 2.2, 0],
        [0, -0.4, 1.6],
        [-1.38, -0.4, -0.8],
        [1.38, -0.4, -0.8],
      ].map(([x, y, z], i) => (
        <mesh key={`accent-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={GOLD_LIGHT} />
        </mesh>
      ))}
    </group>
  );
}

// Dark Portal Frame with ornate details
function PortalFrame() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.5]}>
      {/* Left pillar */}
      <mesh position={[-2.8, 0, 0]}>
        <boxGeometry args={[0.18, 6.5, 0.18]} />
        <meshStandardMaterial 
          color="#080808" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.06}
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>
      
      {/* Left pillar ornaments */}
      {[-2, -1, 0, 1, 2].map((y, i) => (
        <mesh key={`left-orn-${i}`} position={[-2.8, y, 0.12]}>
          <boxGeometry args={[0.22, 0.08, 0.08]} />
          <meshStandardMaterial color="#0a0a0a" emissive={GOLD_BRIGHT} emissiveIntensity={0.12} />
        </mesh>
      ))}
      
      {/* Right pillar */}
      <mesh position={[2.8, 0, 0]}>
        <boxGeometry args={[0.18, 6.5, 0.18]} />
        <meshStandardMaterial 
          color="#080808" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.06}
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>
      
      {/* Right pillar ornaments */}
      {[-2, -1, 0, 1, 2].map((y, i) => (
        <mesh key={`right-orn-${i}`} position={[2.8, y, 0.12]}>
          <boxGeometry args={[0.22, 0.08, 0.08]} />
          <meshStandardMaterial color="#0a0a0a" emissive={GOLD_BRIGHT} emissiveIntensity={0.12} />
        </mesh>
      ))}
      
      {/* Top beam with arch */}
      <mesh position={[0, 3.25, 0]}>
        <boxGeometry args={[5.8, 0.15, 0.15]} />
        <meshStandardMaterial 
          color="#080808" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.08}
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>
      
      {/* Bottom beam */}
      <mesh position={[0, -3.25, 0]}>
        <boxGeometry args={[5.8, 0.15, 0.15]} />
        <meshStandardMaterial 
          color="#080808" 
          emissive={GOLD_PRIMARY}
          emissiveIntensity={0.06}
          metalness={0.98}
          roughness={0.05}
        />
      </mesh>

      {/* Corner jewels */}
      {[[-2.8, 3.25], [2.8, 3.25], [-2.8, -3.25], [2.8, -3.25]].map(([x, y], i) => (
        <group key={`corner-${i}`} position={[x, y, 0.15]}>
          <mesh>
            <octahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial color={GOLD_LIGHT} />
          </mesh>
          <mesh scale={2}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Ethereal ground mist
function GroundMist() {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ref1.current) {
      const mat = ref1.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(time * 0.4) * 0.1;
    }
    if (ref2.current) {
      const mat = ref2.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(time * 0.3 + 1) * 0.08;
    }
  });

  return (
    <group position={[0, -3, 0]}>
      <mesh ref={ref1} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshBasicMaterial 
          color="#0d0d18"
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ref2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <planeGeometry args={[15, 8]} />
        <meshBasicMaterial 
          color="#1a1a2e"
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Floating sacred particles
function SacredParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const colors = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      
      const goldIntensity = Math.random();
      colors[i * 3] = 0.8 + goldIntensity * 0.2;
      colors[i * 3 + 1] = 0.6 + goldIntensity * 0.2;
      colors[i * 3 + 2] = 0.1 + goldIntensity * 0.1;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < 500; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={500}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 3, 4]} intensity={2} color={GOLD_BRIGHT} distance={15} />
      <pointLight position={[0, 1, 6]} intensity={0.8} color={GOLD_PRIMARY} distance={12} />
      <spotLight 
        position={[0, 8, 3]} 
        angle={0.3} 
        penumbra={0.9} 
        intensity={1.5} 
        color={GOLD_BRIGHT}
        castShadow
      />
      <spotLight 
        position={[0, -5, 2]} 
        angle={0.5} 
        penumbra={1} 
        intensity={0.4} 
        color={GOLD_PRIMARY}
        target-position={[0, 2, 0]}
      />
      
      <Stars radius={120} depth={60} count={6000} factor={5} saturation={0.1} fade speed={0.2} />
      <Sparkles count={150} scale={10} size={2} speed={0.15} color={GOLD_BRIGHT} opacity={0.5} />
      <Sparkles count={80} scale={8} size={1.5} speed={0.25} color={GOLD_LIGHT} opacity={0.3} />
      
      <EtherealLogo />
      <SacredPyramid />
      <PortalFrame />
      <GroundMist />
      <SacredParticles />
    </>
  );
}

export default function UltimateGateBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central divine glow */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#d4a020]/35 via-[#d4a020]/15 to-transparent blur-[100px] animate-pulse-subtle" />
        
        {/* Upper ethereal light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-[#ffe066]/20 to-transparent blur-[80px]" />
        
        {/* Bottom atmospheric depth */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent" />
        
        {/* Side atmospheric gradients */}
        <div className="absolute top-0 left-0 bottom-0 w-48 bg-gradient-to-r from-[#050508]/90 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-48 bg-gradient-to-l from-[#050508]/90 to-transparent" />
        
        {/* Ultimate vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,8,0.5)_60%,rgba(5,5,8,0.9)_100%)]" />
      </div>
    </div>
  );
}
