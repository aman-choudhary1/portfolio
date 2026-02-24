import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";

/* ─── Scroll tracker ─── */
const useScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setPageHeight(document.documentElement.scrollHeight - window.innerHeight);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { scrollY, progress: pageHeight > 0 ? scrollY / pageHeight : 0 };
};

/* ─── Stars Background ─── */
const StarField = () => {
  const ref = useRef();
  const count = 2500;

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [
      new THREE.Color("#00d4ff"),
      new THREE.Color("#7b2ff7"),
      new THREE.Color("#f72585"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#00ffaa"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return [positions, colors, sizes];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ─── Floating Wireframe Shape ─── */
const WireShape = ({ geometry, position, color, speed, scale, rotOffset = 0 }) => {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.4 + rotOffset;
    ref.current.rotation.y = t * speed * 0.3;
    ref.current.rotation.z = t * speed * 0.2;
    ref.current.position.y = position[1] + Math.sin(t * speed + rotOffset) * 0.6;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.7 + rotOffset) * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  );
};

/* ─── Section-specific 3D Objects ─── */
const SectionObjects = ({ scrollProgress }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Pan the entire scene vertically based on scroll
      groupRef.current.position.y = scrollProgress * 60;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ═══ ABOUT SECTION (y: -8 to -16) — Data cubes & code brackets ═══ */}
      <WireShape
        geometry={<boxGeometry args={[0.8, 0.8, 0.8]} />}
        position={[-7, -10, -3]}
        color="#00d4ff"
        speed={0.3}
        scale={1.2}
      />
      <WireShape
        geometry={<boxGeometry args={[0.5, 0.5, 0.5]} />}
        position={[8, -12, -4]}
        color="#7b2ff7"
        speed={0.25}
        scale={1}
        rotOffset={1}
      />
      <WireShape
        geometry={<octahedronGeometry args={[0.5]} />}
        position={[-6, -14, -5]}
        color="#00ffaa"
        speed={0.35}
        scale={0.9}
        rotOffset={2}
      />

      {/* ═══ EXPERIENCE SECTION (y: -18 to -28) — Gears & timeline ═══ */}
      <WireShape
        geometry={<torusGeometry args={[0.6, 0.15, 8, 32]} />}
        position={[9, -20, -3]}
        color="#f72585"
        speed={0.4}
        scale={1.3}
      />
      <WireShape
        geometry={<torusGeometry args={[0.4, 0.12, 8, 24]} />}
        position={[-8, -22, -4]}
        color="#00d4ff"
        speed={0.5}
        scale={1.1}
        rotOffset={3}
      />
      <WireShape
        geometry={<dodecahedronGeometry args={[0.4]} />}
        position={[7, -25, -5]}
        color="#7b2ff7"
        speed={0.28}
        scale={1}
        rotOffset={1.5}
      />
      <WireShape
        geometry={<cylinderGeometry args={[0.3, 0.3, 0.8, 6]} />}
        position={[-5, -27, -3]}
        color="#00ffaa"
        speed={0.32}
        scale={0.9}
        rotOffset={4}
      />

      {/* ═══ EDUCATION SECTION (y: -30 to -38) — Books & knowledge ═══ */}
      <WireShape
        geometry={<boxGeometry args={[1, 0.15, 0.7]} />}
        position={[-7, -32, -4]}
        color="#4dc9f6"
        speed={0.2}
        scale={1.4}
      />
      <WireShape
        geometry={<boxGeometry args={[0.9, 0.12, 0.6]} />}
        position={[-7, -32.3, -4]}
        color="#7b2ff7"
        speed={0.2}
        scale={1.4}
        rotOffset={0.1}
      />
      <WireShape
        geometry={<icosahedronGeometry args={[0.5, 0]} />}
        position={[8, -34, -3]}
        color="#f72585"
        speed={0.3}
        scale={1}
        rotOffset={2}
      />
      <WireShape
        geometry={<tetrahedronGeometry args={[0.5]} />}
        position={[6, -36, -5]}
        color="#00d4ff"
        speed={0.35}
        scale={1.1}
        rotOffset={5}
      />

      {/* ═══ SKILLS SECTION (y: -40 to -52) — Circuit nodes & chips ═══ */}
      <WireShape
        geometry={<boxGeometry args={[0.6, 0.6, 0.1]} />}
        position={[-8, -42, -3]}
        color="#00d4ff"
        speed={0.15}
        scale={1.5}
      />
      <WireShape
        geometry={<torusKnotGeometry args={[0.35, 0.1, 64, 8]} />}
        position={[9, -44, -4]}
        color="#7b2ff7"
        speed={0.25}
        scale={1}
        rotOffset={1}
      />
      <WireShape
        geometry={<sphereGeometry args={[0.4, 8, 8]} />}
        position={[-6, -48, -5]}
        color="#f72585"
        speed={0.3}
        scale={1.2}
        rotOffset={3}
      />
      <WireShape
        geometry={<octahedronGeometry args={[0.4]} />}
        position={[7, -50, -3]}
        color="#00ffaa"
        speed={0.22}
        scale={1}
        rotOffset={2}
      />

      {/* ═══ PROJECTS SECTION (y: -54 to -64) — Screens & code ═══ */}
      <WireShape
        geometry={<boxGeometry args={[1.2, 0.8, 0.05]} />}
        position={[-8, -56, -3]}
        color="#00d4ff"
        speed={0.12}
        scale={1.3}
      />
      <WireShape
        geometry={<boxGeometry args={[0.9, 0.6, 0.05]} />}
        position={[9, -58, -4]}
        color="#7b2ff7"
        speed={0.18}
        scale={1.1}
        rotOffset={0.5}
      />
      <WireShape
        geometry={<coneGeometry args={[0.3, 0.6, 4]} />}
        position={[-5, -61, -5]}
        color="#f72585"
        speed={0.28}
        scale={1}
        rotOffset={4}
      />
      <WireShape
        geometry={<torusGeometry args={[0.3, 0.08, 8, 32]} />}
        position={[6, -63, -3]}
        color="#00ffaa"
        speed={0.35}
        scale={1.2}
        rotOffset={1}
      />

      {/* ═══ CONTACT SECTION (y: -66 to -74) — Communication ═══ */}
      <WireShape
        geometry={<sphereGeometry args={[0.5, 6, 6]} />}
        position={[-7, -68, -4]}
        color="#00d4ff"
        speed={0.2}
        scale={1}
        rotOffset={2}
      />
      <WireShape
        geometry={<dodecahedronGeometry args={[0.35]} />}
        position={[8, -70, -3]}
        color="#7b2ff7"
        speed={0.25}
        scale={1.1}
        rotOffset={3}
      />
    </group>
  );
};

/* ─── Main Global Scene ─── */
const GlobalScene = ({ scrollProgress }) => {
  return (
    <group>
      <ambientLight intensity={0.08} />
      <pointLight position={[8, 5, 5]} color="#00d4ff" intensity={0.4} distance={30} />
      <pointLight position={[-8, -5, 5]} color="#7b2ff7" intensity={0.3} distance={30} />

      <StarField />
      <SectionObjects scrollProgress={scrollProgress} />
    </group>
  );
};

/* ─── Wrapper with scroll tracking ─── */
const SceneWithScroll = () => {
  const { progress } = useScrollProgress();
  return <GlobalScene scrollProgress={progress} />;
};

const GlobalSceneCanvas = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneWithScroll />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlobalSceneCanvas;
