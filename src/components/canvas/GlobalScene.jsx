import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

/* ═══════════════════════════════════════════════════════════
   SCROLL STATE — mutable ref for 60fps, no React re-renders
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

/* Mouse state for camera reactivity (works through pointer-events-none) */
const mouseState = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════════════
   SCROLL KEYFRAMES — the computer glides left↔right at each section
   ═══════════════════════════════════════════════════════════════════ */
const keyframes = [
  { at: 0,    pos: [7, -2.6, -3],     rot: [0, -0.4, 0],       s: 0.32 },
  { at: 0.13, pos: [-5, -1.5, -1.5],  rot: [0.05, -0.7, 0],    s: 0.38 },
  { at: 0.28, pos: [5.2, -2, -1.5],   rot: [0.08, 0.35, 0.03], s: 0.35 },
  { at: 0.42, pos: [-6.5, -1.5, -3.5], rot: [-0.03, -0.6, 0],   s: 0.3 },
  // Skills — far right, deep background
  { at: 0.57, pos: [6.5, -2, -3],      rot: [0, 0.3, -0.02],    s: 0.28 },
  { at: 0.74, pos: [-5, -1.5, -1],    rot: [0.06, -0.5, 0.05], s: 0.4 },
  { at: 0.92, pos: [3.5, 0.5, -4],    rot: [0.15, 0.5, 0.08],  s: 0.25 },
];

/* ═══════════════════════════════════════════════════════════════
   SCROLL-DRIVEN COMPUTER — desktop_pc GLTF + holographic effects
   ═══════════════════════════════════════════════════════════════ */
const ScrollComputer = () => {
  const { scene } = useGLTF("./desktop_pc/scene.gltf");
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  const particleCount = 40;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 1.5;
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

    let fromIdx = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (t >= keyframes[i].at) fromIdx = i;
    }
    const toIdx = Math.min(fromIdx + 1, keyframes.length - 1);
    const from = keyframes[fromIdx];
    const to = keyframes[toIdx];
    const range = to.at - from.at;
    const lt = range > 0 ? smoothstep(Math.max(0, Math.min(1, (t - from.at) / range))) : 0;

    groupRef.current.position.x = lerp(from.pos[0], to.pos[0], lt);
    groupRef.current.position.y = lerp(from.pos[1], to.pos[1], lt) + Math.sin(time * 0.5) * 0.1;
    groupRef.current.position.z = lerp(from.pos[2], to.pos[2], lt);

    groupRef.current.rotation.x = lerp(from.rot[0], to.rot[0], lt);
    groupRef.current.rotation.y = lerp(from.rot[1], to.rot[1], lt);
    groupRef.current.rotation.z = lerp(from.rot[2], to.rot[2], lt);

    const s = lerp(from.s, to.s, lt);
    groupRef.current.scale.setScalar(s);

    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.3;
    if (ring2Ref.current) ring2Ref.current.rotation.x = time * 0.25;
    if (ring3Ref.current) ring3Ref.current.rotation.y = time * 0.2;
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.x = Math.sin(time * 0.08) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <hemisphereLight intensity={0.2} groundColor="#0a0a2e" />
      <spotLight position={[-10, 30, 10]} angle={0.2} penumbra={1} intensity={1.8} castShadow color="#00d4ff" />
      <pointLight position={[1, 2, 3]} intensity={1} color="#00d4ff" />
      <pointLight position={[-2, -1, 2]} intensity={0.5} color="#7b2ff7" />

      <primitive object={scene} scale={1} position={[0, 0, 0]} rotation={[0, Math.PI + 0.3, 0]} />

      {/* Holographic rings orbiting the computer */}
      <group ref={ring1Ref} position={[0, -2.3, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[3, 0.008, 8, 100]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} transparent opacity={0.25} />
        </mesh>
      </group>
      <group ref={ring2Ref} position={[0, -1, -0.5]} rotation={[0.5, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[3.5, 0.006, 8, 80]} />
          <meshStandardMaterial color="#7b2ff7" emissive="#7b2ff7" emissiveIntensity={0.6} transparent opacity={0.18} />
        </mesh>
      </group>
      <group ref={ring3Ref} position={[0, -1, -0.5]} rotation={[1.2, 0.7, 0.2]}>
        <mesh>
          <torusGeometry args={[4, 0.005, 8, 80]} />
          <meshStandardMaterial color="#f72585" emissive="#f72585" emissiveIntensity={0.5} transparent opacity={0.12} />
        </mesh>
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO MORPHING SPHERE (merged from HeroScene — no extra canvas)
   ═══════════════════════════════════════════════════════════ */
const HeroMorphingSphere = () => {
  const meshRef = useRef();
  const originalPositions = useRef(null);
  const groupRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      originalPositions.current = meshRef.current.geometry.attributes.position.array.slice();
    }
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !originalPositions.current) return;
    const time = state.clock.elapsedTime;

    // Fade out as user scrolls past hero
    const heroOpacity = Math.max(0, 1 - scrollState.progress * 6);
    if (groupRef.current) {
      groupRef.current.visible = heroOpacity > 0.01;
      groupRef.current.position.y = -scrollState.progress * 5;
    }
    if (heroOpacity <= 0.01) return;

    // Morph vertices
    const pos = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.current;
    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const ox = orig[i3], oy = orig[i3 + 1], oz = orig[i3 + 2];
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len, ny = oy / len, nz = oz / len;
      const noise = Math.sin(nx * 3 + time * 0.8) * Math.cos(ny * 4 + time * 0.6) * Math.sin(nz * 3.5 + time * 0.7) * 0.25;
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
    <group ref={groupRef}>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} transparent opacity={0.15} />
      </mesh>
      {/* Morphing wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} wireframe transparent opacity={0.5} />
      </mesh>
      {/* Outer shell */}
      <mesh>
        <icosahedronGeometry args={[1.8, 2]} />
        <meshStandardMaterial color="#7b2ff7" emissive="#7b2ff7" emissiveIntensity={0.3} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════
   HERO GALAXY PARTICLES (merged from HeroScene)
   ═══════════════════════════════════════════════ */
const HeroGalaxy = () => {
  const ref = useRef();
  const groupRef = useRef();
  const count = 3000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#00d4ff"), new THREE.Color("#7b2ff7"),
      new THREE.Color("#f72585"), new THREE.Color("#00ffaa"), new THREE.Color("#4dc9f6"),
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
      const color = palette[Math.floor(Math.random() * palette.length)].clone();
      color.lerp(new THREE.Color("#ffffff"), Math.random() * 0.3);
      colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    // Fade out as user scrolls
    if (groupRef.current) {
      const heroOpacity = Math.max(0, 1 - scrollState.progress * 6);
      groupRef.current.visible = heroOpacity > 0.01;
      groupRef.current.position.y = -scrollState.progress * 5;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

/* ═══════════════════════════════════════════
   HERO ORBITAL RINGS (merged from HeroScene)
   ═══════════════════════════════════════════ */
const HeroOrbitalRing = ({ radius, color, speed, tilt }) => {
  const ref = useRef();
  useFrame((state) => { if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * speed; });
  return (
    <group ref={ref} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 8, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const HeroRings = () => {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      const heroOpacity = Math.max(0, 1 - scrollState.progress * 6);
      groupRef.current.visible = heroOpacity > 0.01;
      groupRef.current.position.y = -scrollState.progress * 5;
    }
  });
  return (
    <group ref={groupRef}>
      <HeroOrbitalRing radius={3} color="#00d4ff" speed={0.15} tilt={[0.3, 0, 0]} />
      <HeroOrbitalRing radius={4.2} color="#7b2ff7" speed={-0.1} tilt={[0.9, 0.2, 0]} />
      <HeroOrbitalRing radius={5.5} color="#f72585" speed={0.07} tilt={[1.3, 0.5, 0]} />
      <HeroOrbitalRing radius={7} color="#00ffaa" speed={-0.05} tilt={[0.5, 1, 0.3]} />
    </group>
  );
};

/* ═══════════════════════════════════
   STARS BACKGROUND
   ═══════════════════════════════════ */
const StarField = () => {
  const ref = useRef();
  const count = 2000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#00d4ff"), new THREE.Color("#7b2ff7"),
      new THREE.Color("#f72585"), new THREE.Color("#ffffff"), new THREE.Color("#00ffaa"),
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
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
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe transparent opacity={0.25} />
    </mesh>
  );
};

/* ═══════════════════════════════════
   SECTION-SPECIFIC FLOATING OBJECTS
   ═══════════════════════════════════ */
const SectionObjects = () => {
  const groupRef = useRef();
  useFrame(() => { if (groupRef.current) groupRef.current.position.y = scrollState.progress * 60; });
  return (
    <group ref={groupRef}>
      <WireShape geometry={<boxGeometry args={[0.8, 0.8, 0.8]} />} position={[-7, -10, -3]} color="#00d4ff" speed={0.3} scale={1.2} />
      <WireShape geometry={<octahedronGeometry args={[0.5]} />} position={[8, -12, -4]} color="#7b2ff7" speed={0.25} scale={1} rotOffset={1} />
      <WireShape geometry={<octahedronGeometry args={[0.5]} />} position={[-6, -14, -5]} color="#00ffaa" speed={0.35} scale={0.9} rotOffset={2} />
      <WireShape geometry={<torusGeometry args={[0.6, 0.15, 8, 32]} />} position={[9, -20, -3]} color="#f72585" speed={0.4} scale={1.3} />
      <WireShape geometry={<dodecahedronGeometry args={[0.4]} />} position={[-8, -22, -4]} color="#00d4ff" speed={0.5} scale={1.1} rotOffset={3} />
      <WireShape geometry={<dodecahedronGeometry args={[0.4]} />} position={[7, -25, -5]} color="#7b2ff7" speed={0.28} scale={1} rotOffset={1.5} />
      <WireShape geometry={<boxGeometry args={[1, 0.15, 0.7]} />} position={[-7, -32, -4]} color="#4dc9f6" speed={0.2} scale={1.4} />
      <WireShape geometry={<icosahedronGeometry args={[0.5, 0]} />} position={[8, -34, -3]} color="#f72585" speed={0.3} scale={1} rotOffset={2} />
      <WireShape geometry={<tetrahedronGeometry args={[0.5]} />} position={[6, -36, -5]} color="#00d4ff" speed={0.35} scale={1.1} rotOffset={5} />
      <WireShape geometry={<torusKnotGeometry args={[0.35, 0.1, 64, 8]} />} position={[9, -44, -4]} color="#7b2ff7" speed={0.25} scale={1} rotOffset={1} />
      <WireShape geometry={<sphereGeometry args={[0.4, 8, 8]} />} position={[-6, -48, -5]} color="#f72585" speed={0.3} scale={1.2} rotOffset={3} />
      <WireShape geometry={<boxGeometry args={[1.2, 0.8, 0.05]} />} position={[-8, -56, -3]} color="#00d4ff" speed={0.12} scale={1.3} />
      <WireShape geometry={<coneGeometry args={[0.3, 0.6, 4]} />} position={[9, -58, -4]} color="#f72585" speed={0.28} scale={1} rotOffset={4} />
      <WireShape geometry={<sphereGeometry args={[0.5, 6, 6]} />} position={[-7, -68, -4]} color="#00d4ff" speed={0.2} scale={1} rotOffset={2} />
      <WireShape geometry={<dodecahedronGeometry args={[0.35]} />} position={[8, -70, -3]} color="#7b2ff7" speed={0.25} scale={1.1} rotOffset={3} />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════
   MOUSE-REACTIVE CAMERA (works through pointer-events-none)
   ═══════════════════════════════════════════════════════ */
const MouseReactiveCam = () => {

  useEffect(() => {
    const onMove = (e) => {
      mouseState.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ camera }) => {
    // Subtle camera sway based on mouse position
    camera.position.x += (mouseState.x * 1.2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseState.y * 0.6 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

/* ═══════════════════════════════════
   MAIN SCENE — everything in ONE canvas
   ═══════════════════════════════════ */
const GlobalScene = () => {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={0.8} distance={20} />
      <pointLight position={[-5, -5, 5]} color="#7b2ff7" intensity={0.5} distance={20} />

      <MouseReactiveCam />
      <SectionObjects />
      <ScrollComputer />
    </group>
  );
};

const GlobalSceneCanvas = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        dpr={[1, 1.5]}
        shadows
        style={{ background: "transparent" }}
      >
        <ScrollTracker />
        <Suspense fallback={null}>
          <GlobalScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlobalSceneCanvas;
