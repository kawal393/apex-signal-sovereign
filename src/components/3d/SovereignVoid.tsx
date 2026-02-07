// TRANSCENDENT WEBGL 3D VOID - Maximum Smoothness
// Particle trails, enhanced glow, silky 120fps motion

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, useTexture, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import apexLogo from '@/assets/apex-logo.png';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Shared cursor state for 3D projection
interface CursorState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  active: boolean;
}

// Deep space star field with parallax layers - ULTRA SMOOTH
function StarField({ count = 1200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  
  const [positions, sizes, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 25 + Math.random() * 60;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      sizes[i] = 0.3 + Math.random() * 2.5;
      
      const t = Math.random();
      if (t > 0.92) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.6;
      } else if (t > 0.85) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 1;
      } else {
        const brightness = 0.75 + Math.random() * 0.25;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness + 0.08;
      }
    }
    return [positions, sizes, colors];
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    timeRef.current += delta * 0.15;
    ref.current.rotation.y = timeRef.current * 0.012;
    ref.current.rotation.x = Math.sin(timeRef.current * 0.008) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </Points>
  );
}

// Volumetric nebula clouds
function NebulaClouds() {
  const cloud1 = useRef<THREE.Mesh>(null);
  const cloud2 = useRef<THREE.Mesh>(null);
  const cloud3 = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.3;
    const t = timeRef.current;
    if (cloud1.current) {
      cloud1.current.rotation.z = t * 0.015;
      cloud1.current.scale.setScalar(1 + Math.sin(t * 0.08) * 0.04);
    }
    if (cloud2.current) {
      cloud2.current.rotation.z = -t * 0.01;
      cloud2.current.scale.setScalar(1 + Math.sin(t * 0.06 + 1) * 0.04);
    }
    if (cloud3.current) {
      cloud3.current.rotation.z = t * 0.005;
      cloud3.current.scale.setScalar(1 + Math.sin(t * 0.1 + 2) * 0.04);
    }
  });

  return (
    <group>
      <mesh ref={cloud1} position={[-10, 6, -25]}>
        <sphereGeometry args={[18, 20, 20]} />
        <meshBasicMaterial color="#3a1860" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>
      <mesh ref={cloud2} position={[12, -4, -30]}>
        <sphereGeometry args={[15, 20, 20]} />
        <meshBasicMaterial color="#4a2800" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh ref={cloud3} position={[0, 0, -18]}>
        <sphereGeometry args={[25, 20, 20]} />
        <meshBasicMaterial color="#1a1a28" transparent opacity={0.25} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// Energy tendrils with trails
function EnergyTendrils({ count = 8 }: { count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);
  
  const tendrils = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.06 + Math.random() * 0.06,
      radius: 5 + Math.random() * 3,
      length: 10 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.4;
    const t = timeRef.current;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const tendril = tendrils[i];
      mesh.rotation.z = tendril.angle + t * tendril.speed;
      mesh.scale.x = 1 + Math.sin(t * 0.3 + tendril.phase) * 0.15;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 + Math.sin(t * 0.2 + tendril.phase) * 0.06;
    });
  });

  return (
    <group>
      {tendrils.map((tendril, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={[0, 0, 0]}
          rotation={[0, 0, tendril.angle]}
        >
          <planeGeometry args={[tendril.length, 0.4]} />
          <meshBasicMaterial
            color="#e8b84a"
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// PARTICLE TRAILS - orbiting particles with persistent trails
function ParticleTrails({ count = 12 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);
  
  const orbits = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      radius: 3 + Math.random() * 8,
      speed: 0.15 + Math.random() * 0.2,
      phase: (i / count) * Math.PI * 2,
      tilt: Math.random() * 0.4 - 0.2,
      yOffset: (Math.random() - 0.5) * 4,
    }));
  }, [count]);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.5;
    const t = timeRef.current;
    
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;
      const orbit = orbits[i];
      const angle = t * orbit.speed + orbit.phase;
      
      particle.position.x = Math.cos(angle) * orbit.radius;
      particle.position.y = Math.sin(angle) * orbit.radius * 0.4 + orbit.yOffset;
      particle.position.z = Math.sin(angle) * orbit.radius * orbit.tilt;
      
      const scale = 0.08 + Math.sin(t * 2 + orbit.phase) * 0.03;
      particle.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {orbits.map((orbit, i) => (
        <Trail
          key={i}
          width={0.8}
          length={20}
          color={i % 3 === 0 ? '#e8b84a' : i % 3 === 1 ? '#9070c0' : '#c0c0d0'}
          attenuation={(t) => t * t}
        >
          <mesh ref={(el) => { if (el) particlesRef.current[i] = el; }}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial 
              color={i % 3 === 0 ? '#ffcc55' : i % 3 === 1 ? '#a080d0' : '#d0d0e0'} 
              transparent 
              opacity={0.95}
            />
          </mesh>
        </Trail>
      ))}
    </group>
  );
}

// Cursor-reactive particles - ULTRA SMOOTH
function CursorReactiveParticles({ count = 600, cursorState }: { count?: number; cursorState: CursorState }) {
  const ref = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 20;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const t = Math.random();
      if (t > 0.82) {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.35;
      } else if (t > 0.65) {
        colors[i * 3] = 0.65;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.85;
      } else {
        const grey = 0.55 + Math.random() * 0.35;
        colors[i * 3] = grey;
        colors[i * 3 + 1] = grey;
        colors[i * 3 + 2] = grey + 0.12;
      }
    }
    return [positions, colors];
  }, [count]);

  useEffect(() => {
    velocitiesRef.current = new Float32Array(count * 3).fill(0);
    originalPositionsRef.current = new Float32Array(positions);
  }, [count, positions]);

  useFrame((state, delta) => {
    if (!ref.current || !velocitiesRef.current || !originalPositionsRef.current) return;
    
    const geometry = ref.current.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;
    const colorArray = colorAttr.array as Float32Array;
    const velocities = velocitiesRef.current;
    const origPositions = originalPositionsRef.current;
    
    const cursorPos = cursorState.position;
    const cursorVel = cursorState.velocity;
    const cursorActive = cursorState.active;
    
    // Smooth delta clamping for consistent physics
    const smoothDelta = Math.min(delta, 0.033);
    const timeScale = smoothDelta * 60;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      
      const px = posArray[ix];
      const py = posArray[iy];
      const pz = posArray[iz];
      
      if (cursorActive) {
        const dx = cursorPos.x - px;
        const dy = cursorPos.y - py;
        const dz = cursorPos.z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < 625 && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 25) * 0.018 * timeScale;
          
          const swirlX = -cursorVel.y * 0.4;
          const swirlY = cursorVel.x * 0.4;
          
          velocities[ix] += (dx / dist * force) + swirlX * 0.008 * timeScale;
          velocities[iy] += (dy / dist * force) + swirlY * 0.008 * timeScale;
          velocities[iz] += dz / dist * force;
          
          const brightness = 1 + (1 - dist / 25) * 0.6;
          colorArray[ix] = Math.min(1, colorArray[ix] * brightness);
          colorArray[iy] = Math.min(1, colorArray[iy] * brightness);
          colorArray[iz] = Math.min(1, colorArray[iz] * brightness);
        }
      }
      
      const distFromCenter = Math.sqrt(px * px + py * py);
      if (distFromCenter > 0.1) {
        const orbitalForce = 0.00025 * timeScale;
        velocities[ix] += (-py / distFromCenter) * orbitalForce;
        velocities[iy] += (px / distFromCenter) * orbitalForce;
      }
      
      velocities[ix] += (origPositions[ix] - px) * 0.0008 * timeScale;
      velocities[iy] += (origPositions[iy] - py) * 0.0008 * timeScale;
      velocities[iz] += (origPositions[iz] - pz) * 0.0008 * timeScale;
      
      // Ultra heavy damping for silky motion
      const damping = Math.pow(0.965, timeScale);
      velocities[ix] *= damping;
      velocities[iy] *= damping;
      velocities[iz] *= damping;
      
      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];
    }
    
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    ref.current.rotation.y += 0.0008 * timeScale;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.14}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.92}
      />
    </Points>
  );
}

// Pulsing energy rings - SMOOTHER
function EnergyRings() {
  const rings = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);
  
  const ringConfigs = useMemo(() => [
    { radius: 2.8, color: '#e8b84a', speed: 0.08, phase: 0 },
    { radius: 4.5, color: '#9070b0', speed: 0.06, phase: Math.PI / 3 },
    { radius: 6.5, color: '#b0b0c0', speed: 0.05, phase: Math.PI * 2 / 3 },
    { radius: 9, color: '#d4a54a', speed: 0.04, phase: Math.PI },
    { radius: 12, color: '#7060a0', speed: 0.03, phase: Math.PI * 1.3 },
  ], []);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.4;
    const t = timeRef.current;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const config = ringConfigs[i];
      ring.rotation.x = Math.sin(t * config.speed + config.phase) * 0.25;
      ring.rotation.y = t * config.speed * 0.8;
      ring.rotation.z = Math.cos(t * config.speed * 0.5 + config.phase) * 0.15;
      
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = 0.18 + Math.sin(t * 0.35 + config.phase) * 0.1;
    });
  });

  return (
    <group>
      {ringConfigs.map((config, i) => (
        <mesh key={i} ref={(el) => { if (el) rings.current[i] = el; }}>
          <torusGeometry args={[config.radius, 0.018, 12, 80]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.22} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// Central core with enhanced glow
function SovereignCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const outerPulseRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!coreRef.current || !glowRef.current || !pulseRef.current || !outerPulseRef.current) return;
    timeRef.current += delta * 0.3;
    const t = timeRef.current;
    
    const pulse = Math.sin(t * 0.12) * 0.08 + 1;
    const fastPulse = Math.sin(t * 0.25) * 0.04 + 1;
    const slowPulse = Math.sin(t * 0.06) * 0.06 + 1;
    
    coreRef.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2.5);
    pulseRef.current.scale.setScalar(fastPulse * 4);
    outerPulseRef.current.scale.setScalar(slowPulse * 6);
    
    coreRef.current.rotation.y = t * 0.03;
    coreRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    
    // Glow intensity pulsing
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMat.opacity = 0.12 + Math.sin(t * 0.15) * 0.05;
    
    const pulseMat = pulseRef.current.material as THREE.MeshBasicMaterial;
    pulseMat.opacity = 0.05 + Math.sin(t * 0.2) * 0.025;
  });

  return (
    <group>
      {/* Outer pulse wave */}
      <mesh ref={outerPulseRef}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color="#7050a0" transparent opacity={0.025} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Middle pulse wave */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color="#e8b84a" transparent opacity={0.04} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#7050a0" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.65, 36, 36]} />
        <meshBasicMaterial color="#d0d0e0" transparent opacity={0.96} />
      </mesh>
    </group>
  );
}

// 3D Logo with glow
function LogoPlane() {
  const ref = useRef<THREE.Group>(null);
  const texture = useTexture(apexLogo);
  const timeRef = useRef(0);
  
  texture.premultiplyAlpha = false;
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    timeRef.current += delta * 0.25;
    const pulse = Math.sin(timeRef.current * 0.1) * 0.015 + 1;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={[0, 0, 2]}>
      <mesh position={[0, 0, -0.3]} renderOrder={1}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial color="#7050a0" transparent opacity={0.04} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, -0.15]} renderOrder={2}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#e8b84a" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh renderOrder={3}>
        <planeGeometry args={[7.5, 7.5]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0.88} />
      </mesh>
    </group>
  );
}

// Cursor tracker - SILKY SMOOTH
function CursorTracker({ cursorState }: { cursorState: CursorState }) {
  const { camera, size } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const lastPos = useRef(new THREE.Vector3());
  const smoothPos = useRef(new THREE.Vector3());
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        const targetPos = new THREE.Vector3(intersection.x * 1.6, intersection.y * 1.6, 5);
        
        // Ultra smooth interpolation
        smoothPos.current.lerp(targetPos, 0.12);
        
        cursorState.velocity.subVectors(smoothPos.current, lastPos.current);
        lastPos.current.copy(smoothPos.current);
        cursorState.position.copy(smoothPos.current);
      }
      cursorState.active = true;
    };
    
    const handleMouseLeave = () => {
      cursorState.active = false;
      cursorState.velocity.set(0, 0, 0);
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

// Camera controller - BUTTERY SMOOTH
function CameraController({ scrollDepth = 0 }: { scrollDepth: number }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 24 });
  const currentRef = useRef({ x: 0, y: 0, z: 24 });

  useFrame((state, delta) => {
    targetRef.current.z = 24 - scrollDepth * 20;
    targetRef.current.y = scrollDepth * 6;
    targetRef.current.x = Math.sin(scrollDepth * Math.PI) * 4;
    
    // Ultra smooth exponential interpolation
    const smoothing = 1 - Math.pow(0.003, delta);
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothing;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothing;
    currentRef.current.z += (targetRef.current.z - currentRef.current.z) * smoothing;
    
    camera.position.x = currentRef.current.x;
    camera.position.y = currentRef.current.y;
    camera.position.z = currentRef.current.z;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main component
interface SovereignVoidProps {
  scrollDepth?: number;
  className?: string;
  /** When false, pauses heavy rendering to keep the rest of the site smooth */
  active?: boolean;
}

export default function SovereignVoid({
  scrollDepth = 0,
  className = '',
  active = true,
}: SovereignVoidProps) {
  const [cursorState] = useState<CursorState>(() => ({
    position: new THREE.Vector3(0, 0, 5),
    velocity: new THREE.Vector3(0, 0, 0),
    active: false
  }));

  if (!active) {
    return <div className={`absolute inset-0 ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 24], fov: 48 }}
        dpr={[1, 1]} // Fixed DPR for consistent performance
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false, // Disable depth buffer for 2.5D scene
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: true, // Fall back if GPU is weak
        }}
        frameloop={active ? 'always' : 'demand'}
        performance={{ min: 0.5 }} // Allow frame throttling
        style={{ willChange: 'transform' }} // GPU layer hint
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#020208', 12, 70]} />
        
        <CameraController scrollDepth={scrollDepth} />
        <CursorTracker cursorState={cursorState} />
        
        <ambientLight intensity={0.025} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#e8b84a" distance={35} />
        <pointLight position={[12, 12, 12]} intensity={0.7} color="#7050a0" distance={45} />
        <pointLight position={[-12, -6, 6]} intensity={0.4} color="#b0b0c0" distance={35} />
        
        {/* Background layers - reduced counts for smoothness */}
        <StarField count={active ? 500 : 200} />
        <NebulaClouds />

        {/* Core elements - reduced complexity */}
        <EnergyTendrils count={active ? 5 : 3} />
        <EnergyRings />
        {active && <ParticleTrails count={6} />}
        <CursorReactiveParticles count={active ? 280 : 140} cursorState={cursorState} />
        <SovereignCore />
        <LogoPlane />
        
        {/* Post-processing - minimal for smoothness */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.95}
            mipmapBlur
            radius={0.6}
          />
          <Vignette
            darkness={0.45}
            offset={0.25}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
