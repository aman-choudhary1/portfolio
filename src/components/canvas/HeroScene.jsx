import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import CanvasLoader from "../Loader";
import AvatarBot from "./AvatarBot";

/* ─── Morphing Sphere Core — now amplitude-aware ─── */
const MorphingSphere = ({ amplitude = 0 }) => {
  const meshRef = useRef();
  const coreRef = useRef();
  const outerRef = useRef();
  const originalPositions = useRef(null);
  const ampRef = useRef(0);

  /* smooth amplitude with lerp to avoid jitter */
  useEffect(() => {
    ampRef.current = amplitude;
  }, [amplitude]);

  useEffect(() => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      originalPositions.current = geo.attributes.position.array.slice();
    }
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !originalPositions.current) return;

    /* lerp toward target amplitude */
    const targetAmp = ampRef.current;
    const smoothedAmp = meshRef.current.userData.smoothedAmp ?? 0;
    const newAmp = smoothedAmp + (targetAmp - smoothedAmp) * 0.08;
    meshRef.current.userData.smoothedAmp = newAmp;

    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position;
    const orig = originalPositions.current;
    const time = state.clock.elapsedTime;

    /* base morph + extra distortion when speaking */
    const speakBoost = newAmp * 1.8;

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;
      const ox = orig[i3], oy = orig[i3 + 1], oz = orig[i3 + 2];
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len, ny = oy / len, nz = oz / len;

      const baseNoise =
        Math.sin(nx * 3 + time * 0.8) *
        Math.cos(ny * 4 + time * 0.6) *
        Math.sin(nz * 3.5 + time * 0.7) *
        0.25;

      /* voice ripple: high-freq noise driven by amplitude */
      const voiceRipple =
        Math.sin(nx * 10 + time * 15) *
        Math.cos(ny * 12 + time * 13) *
        0.35 *
        newAmp;

      const pulse = Math.sin(time * 0.4) * 0.05;
      const scale = 1 + baseNoise + pulse + voiceRipple + speakBoost * 0.12;

      pos.array[i3]     = ox * scale;
      pos.array[i3 + 1] = oy * scale;
      pos.array[i3 + 2] = oz * scale;
    }
    pos.needsUpdate = true;

    /* rotation — faster when speaking */
    const rotSpeed = 0.1 + newAmp * 0.4;
    meshRef.current.rotation.y = time * rotSpeed;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;

    /* inner core: pulse emissive with amplitude */
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = 0.8 + newAmp * 2.5;
      coreRef.current.material.opacity = 0.15 + newAmp * 0.4;
    }

    /* outer ring: scale pulse */
    if (outerRef.current) {
      const outerScale = 1 + newAmp * 0.2;
      outerRef.current.scale.setScalar(outerScale);
      outerRef.current.material.opacity = 0.12 + newAmp * 0.25;
    }
  });

  return (
    <group>
      {/* Inner glowing core */}
      <mesh ref={coreRef}>
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
      <mesh ref={outerRef}>
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

/* ─── Voice Waveform Rings — pulse out when speaking ─── */
const VoiceRings = ({ amplitude = 0 }) => {
  const ringsRef = useRef([]);
  const ampRef = useRef(0);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  const RING_COUNT = 5;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const amp = ampRef.current;

    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const offset = i / RING_COUNT;
      const wave = Math.abs(Math.sin(time * 4 + offset * Math.PI * 2)) * amp;
      const baseRadius = 2.2 + i * 0.5;
      const expandedRadius = baseRadius + wave * 1.2;

      ring.scale.setScalar(expandedRadius / baseRadius);
      ring.material.opacity = (0.08 + wave * 0.35) * (amp > 0.01 ? 1 : 0.3);
      ring.material.emissiveIntensity = 0.3 + wave * 1.5;
    });
  });

  return (
    <>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (ringsRef.current[i] = el)}
          rotation={[Math.PI / 2 + i * 0.3, 0, i * 0.5]}
        >
          <torusGeometry args={[2.2 + i * 0.5, 0.008, 8, 128]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
};

/* ─── Particle Burst — fires on speech start ─── */
const SpeechParticles = ({ amplitude = 0 }) => {
  const ref = useRef();
  const ampRef = useRef(0);

  const COUNT = 300;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.6 + Math.random() * 0.4;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const speed = 0.4 + Math.random() * 1.2;
      vel[i * 3]     = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }
    return [pos, vel];
  }, []);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  useFrame((state) => {
    if (!ref.current) return;
    const amp = ampRef.current;
    const time = state.clock.elapsedTime;
    const geo = ref.current.geometry;
    const pos = geo.attributes.position;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      /* orbit around sphere + push outward with amplitude */
      const angle = time * (0.3 + i * 0.001) + i;
      const radius = (1.8 + i * 0.015) + amp * 1.5;
      pos.array[i3]     = Math.cos(angle) * radius * 0.5 + velocities[i3]     * amp * 2;
      pos.array[i3 + 1] = Math.sin(angle * 0.7) * radius * 0.3 + velocities[i3 + 1] * amp * 2;
      pos.array[i3 + 2] = Math.sin(angle * 0.5) * radius * 0.5 + velocities[i3 + 2] * amp * 2;
    }
    pos.needsUpdate = true;
    ref.current.material.opacity = 0.3 + amp * 0.7;
    ref.current.material.size = 0.025 + amp * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.025}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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

      positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const color = palette[Math.floor(Math.random() * palette.length)];
      const mixedColor = color.clone();
      mixedColor.lerp(new THREE.Color("#ffffff"), Math.random() * 0.3);
      colors[i3]     = mixedColor.r;
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
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
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

/* ─── Orbital Rings ─── */
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
const HeroScene = ({ amplitude = 0 }) => {
  /* Anchor the avatar on the right on desktop, bottom-centre on mobile */
  const { viewport } = useThree();
  const wide = viewport.width > 11;
  const anchor = wide ? [viewport.width * 0.12, -0.2, 0] : [0, -3.1, 0];
  const s = wide ? 1 : 0.65;

  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]}   color="#00d4ff" intensity={1.5} distance={20} />
      <pointLight position={[-5, -5, 5]} color="#7b2ff7" intensity={1.2} distance={20} />
      <pointLight position={[0, 5, -5]}  color="#f72585" intensity={0.8} distance={20} />
      <pointLight position={[3, -3, -3]} color="#00ffaa" intensity={0.5} distance={15} />

      <CameraRig />
      <group position={anchor} scale={s}>
        <AvatarBot amplitude={amplitude} position={[0, 0.2, 0]} />
      </group>
    </group>
  );
};

const HeroSceneCanvas = ({ amplitude = 0 }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <HeroScene amplitude={amplitude} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default HeroSceneCanvas;
