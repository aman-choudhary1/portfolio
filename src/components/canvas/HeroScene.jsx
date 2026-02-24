import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import CanvasLoader from "../Loader";

/* ─── Morphing Sphere Core ─── */
const MorphingSphere = () => {
  const meshRef = useRef();
  const originalPositions = useRef(null);

  useEffect(() => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      originalPositions.current = geo.attributes.position.array.slice();
    }
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !originalPositions.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position;
    const orig = originalPositions.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const ox = orig[i3], oy = orig[i3 + 1], oz = orig[i3 + 2];
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len, ny = oy / len, nz = oz / len;
      
      const noise = Math.sin(nx * 3 + time * 0.8) * 
                     Math.cos(ny * 4 + time * 0.6) * 
                     Math.sin(nz * 3.5 + time * 0.7) * 0.25;
      const pulse = Math.sin(time * 0.4) * 0.05;
      const scale = 1 + noise + pulse;

      pos.array[i3] = ox * scale;
      pos.array[i3 + 1] = oy * scale;
      pos.array[i3 + 2] = oz * scale;
    }
    pos.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;
  });

  return (
    <group>
      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Morphing wireframe shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh>
        <icosahedronGeometry args={[1.8, 2]} />
        <meshStandardMaterial
          color="#7b2ff7"
          emissive="#7b2ff7"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
};

/* ─── Galaxy Spiral Particles ─── */
const GalaxyParticles = () => {
  const ref = useRef();
  const count = 4000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const palette = [
      new THREE.Color("#00d4ff"),
      new THREE.Color("#7b2ff7"),
      new THREE.Color("#f72585"),
      new THREE.Color("#00ffaa"),
      new THREE.Color("#4dc9f6"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 10 + 0.5;
      const spinAngle = radius * 2.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      
      const randomX = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * radius * 0.5;
      const randomY = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 2;
      const randomZ = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * radius * 0.5;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const color = palette[Math.floor(Math.random() * palette.length)];
      const mixedColor = color.clone();
      mixedColor.lerp(new THREE.Color("#ffffff"), Math.random() * 0.3);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ─── Floating Geometric Shapes ─── */
const FloatingShape = ({ geometry, position, color, speed, scale }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.8} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </Float>
  );
};

/* ─── Orbital Rings (using mesh tubes instead of line) ─── */
const OrbitalRing = ({ radius, color, speed, tilt }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={ref} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 8, 200]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

/* ─── Mouse-Reactive Camera ─── */
const CameraRig = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.8 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

/* ─── Main Scene ─── */
const HeroScene = () => {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={1.5} distance={20} />
      <pointLight position={[-5, -5, 5]} color="#7b2ff7" intensity={1.2} distance={20} />
      <pointLight position={[0, 5, -5]} color="#f72585" intensity={0.8} distance={20} />
      <pointLight position={[3, -3, -3]} color="#00ffaa" intensity={0.5} distance={15} />

      <CameraRig />
      <MorphingSphere />
      <GalaxyParticles />

      <OrbitalRing radius={3} color="#00d4ff" speed={0.15} tilt={[0.3, 0, 0]} />
      <OrbitalRing radius={4.2} color="#7b2ff7" speed={-0.1} tilt={[0.9, 0.2, 0]} />
      <OrbitalRing radius={5.5} color="#f72585" speed={0.07} tilt={[1.3, 0.5, 0]} />
      <OrbitalRing radius={7} color="#00ffaa" speed={-0.05} tilt={[0.5, 1, 0.3]} />

      <FloatingShape
        geometry={<torusGeometry args={[0.5, 0.18, 16, 48]} />}
        position={[4, 1, -2]}
        color="#00d4ff"
        speed={0.8}
        scale={1.2}
      />
      <FloatingShape
        geometry={<octahedronGeometry args={[0.6]} />}
        position={[-4, -1, 1]}
        color="#7b2ff7"
        speed={0.6}
        scale={1.1}
      />
      <FloatingShape
        geometry={<dodecahedronGeometry args={[0.45]} />}
        position={[3, -2.5, 3]}
        color="#f72585"
        speed={0.7}
        scale={1}
      />
      <FloatingShape
        geometry={<tetrahedronGeometry args={[0.5]} />}
        position={[-3, 2.5, -3]}
        color="#00ffaa"
        speed={0.9}
        scale={1}
      />
      <FloatingShape
        geometry={<torusKnotGeometry args={[0.35, 0.12, 100, 16]} />}
        position={[0, 3.5, -4]}
        color="#4dc9f6"
        speed={0.5}
        scale={0.9}
      />
      <FloatingShape
        geometry={<icosahedronGeometry args={[0.4, 0]} />}
        position={[-5, 0, -3]}
        color="#00d4ff"
        speed={0.65}
        scale={1}
      />
      <FloatingShape
        geometry={<coneGeometry args={[0.35, 0.7, 6]} />}
        position={[5, -1, -4]}
        color="#f72585"
        speed={0.75}
        scale={1.1}
      />
      <FloatingShape
        geometry={<torusGeometry args={[0.3, 0.1, 16, 32]} />}
        position={[-2, -3, 2]}
        color="#7b2ff7"
        speed={0.55}
        scale={1.3}
      />
    </group>
  );
};

const HeroSceneCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <HeroScene />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default HeroSceneCanvas;
