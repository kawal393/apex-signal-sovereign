 import { Canvas, useFrame } from '@react-three/fiber';
 import { Float, MeshTransmissionMaterial } from '@react-three/drei';
 import { useRef, useMemo, Suspense } from 'react';
 import * as THREE from 'three';
 
 function FloatingRing({ position, rotation, scale }: { position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
   const meshRef = useRef<THREE.Mesh>(null);
   
   useFrame((state) => {
     if (meshRef.current) {
       meshRef.current.rotation.x += 0.001;
       meshRef.current.rotation.y += 0.002;
     }
   });
 
   return (
     <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
       <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
         <torusGeometry args={[1, 0.03, 16, 100]} />
         <meshStandardMaterial
           color="#22d3ee"
           emissive="#22d3ee"
           emissiveIntensity={0.3}
           metalness={0.9}
           roughness={0.1}
           transparent
           opacity={0.6}
         />
       </mesh>
     </Float>
   );
 }
 
 function FloatingOrb({ position, scale }: { position: [number, number, number]; scale: number }) {
   const meshRef = useRef<THREE.Mesh>(null);
   
   useFrame((state) => {
     if (meshRef.current) {
       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
     }
   });
 
   return (
     <mesh ref={meshRef} position={position} scale={scale}>
       <sphereGeometry args={[1, 64, 64]} />
       <MeshTransmissionMaterial
         backside
         samples={4}
         thickness={0.5}
         chromaticAberration={0.1}
         anisotropy={0.3}
         distortion={0.2}
         distortionScale={0.3}
         temporalDistortion={0.1}
         iridescence={1}
         iridescenceIOR={1}
         iridescenceThicknessRange={[0, 1400]}
         transmission={1}
         roughness={0}
         color="#22d3ee"
       />
     </mesh>
   );
 }
 
 function FloatingMonolith({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
   const meshRef = useRef<THREE.Mesh>(null);
   
   useFrame((state) => {
     if (meshRef.current) {
       meshRef.current.rotation.y += 0.003;
       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
     }
   });
 
   return (
     <mesh ref={meshRef} position={position} rotation={rotation}>
       <boxGeometry args={[0.3, 2, 0.1]} />
       <meshStandardMaterial
         color="#1a1a1f"
         emissive="#22d3ee"
         emissiveIntensity={0.05}
         metalness={0.95}
         roughness={0.05}
       />
     </mesh>
   );
 }
 
 function Scene() {
   return (
     <>
       <ambientLight intensity={0.2} />
       <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
       <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
       
       {/* Main central orb */}
       <FloatingOrb position={[0, 0, -2]} scale={1.5} />
       
       {/* Surrounding rings */}
       <FloatingRing position={[-3, 1, -4]} rotation={[0.5, 0, 0.3]} scale={1.2} />
       <FloatingRing position={[3, -0.5, -5]} rotation={[-0.3, 0.5, 0]} scale={0.8} />
       <FloatingRing position={[2, 2, -6]} rotation={[0.2, -0.3, 0.5]} scale={1} />
       
       {/* Floating monoliths */}
       <FloatingMonolith position={[-4, 0, -7]} rotation={[0, 0.5, 0.1]} />
       <FloatingMonolith position={[4, -1, -8]} rotation={[0, -0.3, -0.1]} />
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
     </div>
   );
 }