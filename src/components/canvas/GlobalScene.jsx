import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";

/* ═══════════════════════════════════════════════════════════
   SCROLL STATE — shared mutable object for 60fps performance
   ═══════════════════════════════════════════════════════════ */
const scrollState = { progress: 0 };

const ScrollTracker = () => {
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = h > 0 ? window.scrollY / h : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return null;
};

/* ═══════════════════════════════════
   HELPERS
   ═══════════════════════════════════ */
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);

/* ═══════════════════════════════════════════════════
   SCROLL KEYFRAMES — position/rotation/scale per section
   ═══════════════════════════════════════════════════ */
const keyframes = [
  // Hero — right side, large, angled toward viewer
  { at: 0,    pos: [4, 0, 0],     rot: [0, 0, 0],          s: 1 },
  // About — left side, rotated
  { at: 0.12, pos: [-4.5, 0, -1], rot: [0.3, Math.PI, 0],  s: 0.7 },
  // Experience — right, tilted back
  { at: 0.28, pos: [4.5, -0.5, -1.5], rot: [0.4, 0.5, 0.2], s: 0.6 },
  // Education — left, upright
  { at: 0.42, pos: [-5, 0.5, -1], rot: [-0.2, Math.PI + 0.5, 0.1], s: 0.65 },
  // Skills — right, dramatic tilt
  { at: 0.56, pos: [5, -0.3, -1], rot: [0.5, -0.3, -0.3], s: 0.55 },
  // Projects — left, zoomed
  { at: 0.74, pos: [-4, 0, 0],    rot: [0.1, Math.PI - 0.3, 0.15], s: 0.75 },
  // Contact — center bottom, small, drifting
  { at: 0.92, pos: [0, -1.5, -3], rot: [0.3, Math.PI / 2, 0.2], s: 0.4 },
];

/* ═══════════════════════════════════════════════════
   HOLOGRAPHIC ENERGY CORE — the scroll-driven object
   ═══════════════════════════════════════════════════ */
const HolographicCore = () => {
  const groupRef = useRef();
  const innerRef = useRef();
  const midRef = useRef();
  const outerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  // Orbiting particles
  const particleCount = 60;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 0.6;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = scrollState.progress;
    const time = state.clock.elapsedTime;

    // ─── Interpolate between keyframes ───
    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (t >= keyframes[i].at) fromIdx = i;
    }
    const toIdx = Math.min(fromIdx + 1, keyframes.length - 1);
    const from = keyframes[fromIdx];
    const to = keyframes[toIdx];
    const range = to.at - from.at;
    const lt = range > 0 ? smoothstep(Math.max(0, Math.min(1, (t - from.at) / range))) : 0;

    // Position
    groupRef.current.position.x = lerp(from.pos[0], to.pos[0], lt);
    groupRef.current.position.y = lerp(from.pos[1], to.pos[1], lt) + Math.sin(time * 0.6) * 0.15;
    groupRef.current.position.z = lerp(from.pos[2], to.pos[2], lt);

    // Rotation (scroll-driven + slow idle spin)
    groupRef.current.rotation.x = lerp(from.rot[0], to.rot[0], lt);
    groupRef.current.rotation.y = lerp(from.rot[1], to.rot[1], lt) + time * 0.05;
    groupRef.current.rotation.z = lerp(from.rot[2], to.rot[2], lt);

    // Scale
    const s = lerp(from.s, to.s, lt);
    groupRef.current.scale.setScalar(s);

    // ─── Inner layers spin independently ───
    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.3;
      innerRef.current.rotation.y = time * 0.5;
    }
    if (midRef.current) {
      midRef.current.rotation.x = -time * 0.2;
      midRef.current.rotation.z = time * 0.15;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = time * 0.1;
      outerRef.current.rotation.z = -time * 0.08;
    }

    // ─── Rings orbit at different speeds ───
    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.x = time * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y = time * 0.25;

    // ─── Particles orbit ───
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.15;
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lights attached to the core */}
      <pointLight color="#00d4ff" intensity={2} distance={8} />
      <pointLight position={[0, 1, 0]} color="#7b2ff7" intensity={1} distance={6} />

      {/* ─── Inner glowing core ─── */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* ─── Layer 1: Spinning icosahedron ─── */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ─── Layer 2: Counter-rotating dodecahedron ─── */}
      <mesh ref={midRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#7b2ff7"
          emissive="#7b2ff7"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* ─── Layer 3: Outer icosahedron shell ─── */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#f72585"
          emissive="#f72585"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* ─── Orbital ring 1 (horizontal) ─── */}
      <group ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.008, 8, 100]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ─── Orbital ring 2 (tilted) ─── */}
      <group ref={ring2Ref} rotation={[0.6, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[1.7, 0.006, 8, 100]} />
          <meshStandardMaterial color="#7b2ff7" emissive="#7b2ff7" emissiveIntensity={0.6} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* ─── Orbital ring 3 (perpendicular) ─── */}
      <group ref={ring3Ref} rotation={[1.2, 0.8, 0.3]}>
        <mesh>
          <torusGeometry args={[1.9, 0.005, 8, 100]} />
          <meshStandardMaterial color="#f72585" emissive="#f72585" emissiveIntensity={0.5} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* ─── Orbiting particles ─── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00d4ff"
          size={0.04}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

/* ═══════════════════════════════════
   STARS BACKGROUND
   ═══════════════════════════════════ */
const StarField = () => {
  const ref = useRef();
  const count = 2500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
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
    }
    return [positions, colors];
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

/* ═══════════════════════════════════
   FLOATING WIREFRAME SHAPES
   ═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   SECTION-SPECIFIC FLOATING OBJECTS
   ═══════════════════════════════════ */
const SectionObjects = () => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = scrollState.progress * 60;
    }
  });

  return (
    <group ref={groupRef}>
      {/* About */}
      <WireShape geometry={<boxGeometry args={[0.8, 0.8, 0.8]} />} position={[-7, -10, -3]} color="#00d4ff" speed={0.3} scale={1.2} />
      <WireShape geometry={<octahedronGeometry args={[0.5]} />} position={[8, -12, -4]} color="#7b2ff7" speed={0.25} scale={1} rotOffset={1} />
      <WireShape geometry={<octahedronGeometry args={[0.5]} />} position={[-6, -14, -5]} color="#00ffaa" speed={0.35} scale={0.9} rotOffset={2} />

      {/* Experience */}
      <WireShape geometry={<torusGeometry args={[0.6, 0.15, 8, 32]} />} position={[9, -20, -3]} color="#f72585" speed={0.4} scale={1.3} />
      <WireShape geometry={<torusGeometry args={[0.4, 0.12, 8, 24]} />} position={[-8, -22, -4]} color="#00d4ff" speed={0.5} scale={1.1} rotOffset={3} />
      <WireShape geometry={<dodecahedronGeometry args={[0.4]} />} position={[7, -25, -5]} color="#7b2ff7" speed={0.28} scale={1} rotOffset={1.5} />
      <WireShape geometry={<cylinderGeometry args={[0.3, 0.3, 0.8, 6]} />} position={[-5, -27, -3]} color="#00ffaa" speed={0.32} scale={0.9} rotOffset={4} />

      {/* Education */}
      <WireShape geometry={<boxGeometry args={[1, 0.15, 0.7]} />} position={[-7, -32, -4]} color="#4dc9f6" speed={0.2} scale={1.4} />
      <WireShape geometry={<icosahedronGeometry args={[0.5, 0]} />} position={[8, -34, -3]} color="#f72585" speed={0.3} scale={1} rotOffset={2} />
      <WireShape geometry={<tetrahedronGeometry args={[0.5]} />} position={[6, -36, -5]} color="#00d4ff" speed={0.35} scale={1.1} rotOffset={5} />

      {/* Skills */}
      <WireShape geometry={<boxGeometry args={[0.6, 0.6, 0.1]} />} position={[-8, -42, -3]} color="#00d4ff" speed={0.15} scale={1.5} />
      <WireShape geometry={<torusKnotGeometry args={[0.35, 0.1, 64, 8]} />} position={[9, -44, -4]} color="#7b2ff7" speed={0.25} scale={1} rotOffset={1} />
      <WireShape geometry={<sphereGeometry args={[0.4, 8, 8]} />} position={[-6, -48, -5]} color="#f72585" speed={0.3} scale={1.2} rotOffset={3} />

      {/* Projects */}
      <WireShape geometry={<boxGeometry args={[1.2, 0.8, 0.05]} />} position={[-8, -56, -3]} color="#00d4ff" speed={0.12} scale={1.3} />
      <WireShape geometry={<boxGeometry args={[0.9, 0.6, 0.05]} />} position={[9, -58, -4]} color="#7b2ff7" speed={0.18} scale={1.1} rotOffset={0.5} />
      <WireShape geometry={<coneGeometry args={[0.3, 0.6, 4]} />} position={[-5, -61, -5]} color="#f72585" speed={0.28} scale={1} rotOffset={4} />

      {/* Contact */}
      <WireShape geometry={<sphereGeometry args={[0.5, 6, 6]} />} position={[-7, -68, -4]} color="#00d4ff" speed={0.2} scale={1} rotOffset={2} />
      <WireShape geometry={<dodecahedronGeometry args={[0.35]} />} position={[8, -70, -3]} color="#7b2ff7" speed={0.25} scale={1.1} rotOffset={3} />
    </group>
  );
};

/* ═══════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════ */
const GlobalScene = () => {
  return (
    <group>
      <ambientLight intensity={0.08} />
      <pointLight position={[8, 5, 5]} color="#00d4ff" intensity={0.4} distance={30} />
      <pointLight position={[-8, -5, 5]} color="#7b2ff7" intensity={0.3} distance={30} />

      <StarField />
      <SectionObjects />
      <HolographicCore />
    </group>
  );
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
        <ScrollTracker />
        <Suspense fallback={null}>
          <GlobalScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlobalSceneCanvas;
