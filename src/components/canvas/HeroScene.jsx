import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import CanvasLoader from "../Loader";

const Particles = () => {
  const ref = useRef();
  const count = 2000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color("#00d4ff"),
      new THREE.Color("#7b2ff7"),
      new THREE.Color("#f72585"),
      new THREE.Color("#00d4ff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FloatingShape = ({ geometry, position, color, speed, scale }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const CentralOrb = () => {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (glowRef.current) {
      const glowScale = 1.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#7b2ff7"
          emissive="#7b2ff7"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

const OrbitalRing = ({ radius, color, speed, tilt }) => {
  const ref = useRef();
  const segments = 128;

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={ref} rotation={tilt}>
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          linewidth={1}
        />
      </line>
    </group>
  );
};

const HeroScene = () => {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={1} />
      <pointLight position={[-5, -5, 5]} color="#7b2ff7" intensity={0.8} />
      <pointLight position={[0, 5, -5]} color="#f72585" intensity={0.6} />

      <CentralOrb />

      <OrbitalRing radius={3} color="#00d4ff" speed={0.1} tilt={[0.3, 0, 0]} />
      <OrbitalRing radius={4} color="#7b2ff7" speed={-0.08} tilt={[0.8, 0.2, 0]} />
      <OrbitalRing radius={5.5} color="#f72585" speed={0.06} tilt={[1.2, 0.5, 0]} />

      <FloatingShape
        geometry={<torusGeometry args={[0.4, 0.15, 16, 32]} />}
        position={[3, 1, -1]}
        color="#00d4ff"
        speed={0.8}
        scale={1}
      />
      <FloatingShape
        geometry={<octahedronGeometry args={[0.5]} />}
        position={[-3, -1, 1]}
        color="#7b2ff7"
        speed={0.6}
        scale={1}
      />
      <FloatingShape
        geometry={<dodecahedronGeometry args={[0.4]} />}
        position={[2, -2, 2]}
        color="#f72585"
        speed={0.7}
        scale={1}
      />
      <FloatingShape
        geometry={<tetrahedronGeometry args={[0.35]} />}
        position={[-2, 2, -2]}
        color="#00d4ff"
        speed={0.9}
        scale={1}
      />
      <FloatingShape
        geometry={<torusKnotGeometry args={[0.3, 0.1, 64, 8]} />}
        position={[0, 3, -3]}
        color="#7b2ff7"
        speed={0.5}
        scale={0.8}
      />

      <Particles />
    </group>
  );
};

const HeroSceneCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={<CanvasLoader />}>
        <HeroScene />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default HeroSceneCanvas;
