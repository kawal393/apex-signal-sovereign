// ULTIMATE WEBGL 3D VOID - Next Level
// Nebula clouds, star field, energy tendrils, particle trails

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, useTexture } from '@react-three/drei';
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

// Deep space star field with parallax layers
function StarField({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, sizes, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 50;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Varying sizes for depth
      sizes[i] = 0.5 + Math.random() * 2;
      
      // Mostly white/silver with occasional gold or purple
      const t = Math.random();
      if (t > 0.95) {
        // Gold stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.5;
      } else if (t > 0.9) {
        // Purple stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
      } else {
        // Silver/white
        const brightness = 0.7 + Math.random() * 0.3;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness + 0.05;
      }
    }
    return [positions, sizes, colors];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    // Ultra slow rotation
    ref.current.rotation.y = state.clock.elapsedTime * 0.002;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  );
}

// Nebula clouds - volumetric fog effect
function NebulaClouds() {
  const cloud1 = useRef<THREE.Mesh>(null);
  const cloud2 = useRef<THREE.Mesh>(null);
  const cloud3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cloud1.current) {
      cloud1.current.rotation.z = t * 0.008;
      cloud1.current.scale.setScalar(1 + Math.sin(t * 0.1) * 0.05);
    }
    if (cloud2.current) {
      cloud2.current.rotation.z = -t * 0.005;
      cloud2.current.scale.setScalar(1 + Math.sin(t * 0.08 + 1) * 0.05);
    }
    if (cloud3.current) {
      cloud3.current.rotation.z = t * 0.003;
      cloud3.current.scale.setScalar(1 + Math.sin(t * 0.12 + 2) * 0.05);
    }
  });

  return (
    <group>
      {/* Deep purple nebula */}
      <mesh ref={cloud1} position={[-8, 5, -20]}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshBasicMaterial
          color="#2a1040"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Gold dust nebula */}
      <mesh ref={cloud2} position={[10, -3, -25]}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial
          color="#3d2800"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Silver mist */}
      <mesh ref={cloud3} position={[0, 0, -15]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial
          color="#1a1a20"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Energy tendrils - flowing light streams
function EnergyTendrils({ count = 6 }: { count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  
  const tendrils = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.1,
      radius: 4 + Math.random() * 2,
      length: 8 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const tendril = tendrils[i];
      mesh.rotation.z = tendril.angle + t * tendril.speed;
      mesh.scale.x = 1 + Math.sin(t * 0.5 + tendril.phase) * 0.2;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(t * 0.3 + tendril.phase) * 0.05;
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
          <planeGeometry args={[tendril.length, 0.3]} />
          <meshBasicMaterial
            color="#d4a54a"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Cursor-reactive particles with trails
function CursorReactiveParticles({ 
  count = 500, 
  cursorState 
}: { 
  count?: number;
  cursorState: CursorState;
}) {
  const ref = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const trailsRef = useRef<Float32Array | null>(null);
  const frameSkip = useRef(0);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 18;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Color distribution
      const t = Math.random();
      if (t > 0.85) {
        // Gold
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.3;
      } else if (t > 0.7) {
        // Purple
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.8;
      } else {
        // Silver
        const grey = 0.6 + Math.random() * 0.3;
        colors[i * 3] = grey;
        colors[i * 3 + 1] = grey;
        colors[i * 3 + 2] = grey + 0.1;
      }
    }
    return [positions, colors];
  }, [count]);

  useEffect(() => {
    velocitiesRef.current = new Float32Array(count * 3).fill(0);
    originalPositionsRef.current = new Float32Array(positions);
    trailsRef.current = new Float32Array(count).fill(0);
  }, [count, positions]);

  useFrame((state) => {
    if (!ref.current || !velocitiesRef.current || !originalPositionsRef.current) return;
    
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    
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
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      
      const px = posArray[ix];
      const py = posArray[iy];
      const pz = posArray[iz];
      
      // Cursor attraction with velocity influence
      if (cursorActive) {
        const dx = cursorPos.x - px;
        const dy = cursorPos.y - py;
        const dz = cursorPos.z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < 400 && distSq > 0.01) { // 20^2 = 400
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 20) * 0.02;
          
          // Add some swirl based on cursor velocity
          const swirlX = -cursorVel.y * 0.5;
          const swirlY = cursorVel.x * 0.5;
          
          velocities[ix] += (dx / dist * force) + swirlX * 0.01;
          velocities[iy] += (dy / dist * force) + swirlY * 0.01;
          velocities[iz] += dz / dist * force;
          
          // Brighten particles near cursor
          const brightness = 1 + (1 - dist / 20) * 0.5;
          colorArray[ix] = Math.min(1, colorArray[ix] * brightness);
          colorArray[iy] = Math.min(1, colorArray[iy] * brightness);
          colorArray[iz] = Math.min(1, colorArray[iz] * brightness);
        }
      }
      
      // Orbital motion around center
      const distFromCenter = Math.sqrt(px * px + py * py);
      if (distFromCenter > 0.1) {
        const orbitalForce = 0.0003;
        velocities[ix] += (-py / distFromCenter) * orbitalForce;
        velocities[iy] += (px / distFromCenter) * orbitalForce;
      }
      
      // Return to origin
      velocities[ix] += (origPositions[ix] - px) * 0.001;
      velocities[iy] += (origPositions[iy] - py) * 0.001;
      velocities[iz] += (origPositions[iz] - pz) * 0.001;
      
      // Heavy damping for ultra smooth
      velocities[ix] *= 0.97;
      velocities[iy] *= 0.97;
      velocities[iz] *= 0.97;
      
      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];
    }
    
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    ref.current.rotation.y = time * 0.003;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  );
}

// Pulsing energy rings
function EnergyRings() {
  const rings = useRef<THREE.Mesh[]>([]);
  
  const ringConfigs = useMemo(() => [
    { radius: 2.5, color: '#d4a54a', speed: 0.15, phase: 0 },
    { radius: 4, color: '#8060a0', speed: 0.12, phase: Math.PI / 3 },
    { radius: 6, color: '#a0a0b0', speed: 0.1, phase: Math.PI * 2 / 3 },
    { radius: 8, color: '#d4a54a', speed: 0.08, phase: Math.PI },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const config = ringConfigs[i];
      ring.rotation.x = Math.sin(t * config.speed + config.phase) * 0.3;
      ring.rotation.y = t * config.speed;
      ring.rotation.z = Math.cos(t * config.speed * 0.7 + config.phase) * 0.2;
      
      // Pulse opacity
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(t * 0.5 + config.phase) * 0.1;
    });
  });

  return (
    <group>
      {ringConfigs.map((config, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) rings.current[i] = el; }}
        >
          <torusGeometry args={[config.radius, 0.015, 8, 64]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Central core with energy pulses
function SovereignCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const frameSkip = useRef(0);

  useFrame((state) => {
    if (!coreRef.current || !glowRef.current || !pulseRef.current) return;
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 0.15) * 0.1 + 1;
    const fastPulse = Math.sin(t * 0.4) * 0.05 + 1;
    
    coreRef.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2.2);
    pulseRef.current.scale.setScalar(fastPulse * 3.5);
    
    // Rotate core slowly
    coreRef.current.rotation.y = t * 0.05;
    coreRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
  });

  return (
    <group>
      {/* Outer pulse wave */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial 
          color="#d4a54a" 
          transparent 
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#6040a0" 
          transparent 
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial 
          color="#c8c8d0" 
          transparent 
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

// 3D Logo Plane
function LogoPlane() {
  const ref = useRef<THREE.Group>(null);
  const texture = useTexture(apexLogo);
  
  texture.premultiplyAlpha = false;
  
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 0.15) * 0.02 + 1;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref} position={[0, 0, 2]}>
      <mesh position={[0, 0, -0.2]} renderOrder={1}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial
          color="#6040a0"
          transparent
          opacity={0.03}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.1]} renderOrder={2}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          color="#d4a54a"
          transparent
          opacity={0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh renderOrder={3}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Cursor tracker with velocity
function CursorTracker({ cursorState }: { cursorState: CursorState }) {
  const { camera, size } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const lastPos = useRef(new THREE.Vector3());
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        const newPos = new THREE.Vector3(
          intersection.x * 1.5,
          intersection.y * 1.5,
          5
        );
        
        // Calculate velocity
        cursorState.velocity.subVectors(newPos, lastPos.current);
        lastPos.current.copy(newPos);
        
        cursorState.position.copy(newPos);
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

// Camera controller - ultra smooth
function CameraController({ scrollDepth = 0 }: { scrollDepth: number }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 20 });

  useFrame(() => {
    // Calculate target based on scroll
    targetRef.current.z = 22 - scrollDepth * 18;
    targetRef.current.y = scrollDepth * 5;
    targetRef.current.x = Math.sin(scrollDepth * Math.PI) * 3;
    
    // Ultra smooth interpolation
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.005;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.005;
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.005;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main component
interface SovereignVoidProps {
  scrollDepth?: number;
  className?: string;
}

export default function SovereignVoid({ scrollDepth = 0, className = '' }: SovereignVoidProps) {
  const [cursorState] = useState<CursorState>(() => ({
    position: new THREE.Vector3(0, 0, 5),
    velocity: new THREE.Vector3(0, 0, 0),
    active: false
  }));

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 22], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#030308', 15, 60]} />
        
        <CameraController scrollDepth={scrollDepth} />
        <CursorTracker cursorState={cursorState} />
        
        <ambientLight intensity={0.03} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#d4a54a" distance={30} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#6040a0" distance={40} />
        <pointLight position={[-10, -5, 5]} intensity={0.3} color="#a0a0b0" distance={30} />
        
        {/* Background layers */}
        <StarField count={600} />
        <NebulaClouds />
        
        {/* Core elements */}
        <EnergyTendrils count={8} />
        <EnergyRings />
        <CursorReactiveParticles count={400} cursorState={cursorState} />
        <SovereignCore />
        <LogoPlane />
        
        {/* Post-processing */}
        <EffectComposer multisampling={2}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.8}
          />
          <Vignette
            darkness={0.5}
            offset={0.3}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
