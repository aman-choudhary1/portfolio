import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

const CYAN = "#00d4ff";
const PURPLE = "#7b2ff7";
const PINK = "#f72585";
const MOUTH_BARS = 9;

/* radial-gradient texture for an additive glow behind the avatar */
const GLOW_TEX = (() => {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(123,47,247,0.55)");
  grd.addColorStop(0.35, "rgba(0,212,255,0.18)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();

const glow = (color, intensity = 1.2) => ({
  color,
  emissive: color,
  emissiveIntensity: intensity,
  toneMapped: false,
});

/**
 * Procedural AI avatar. It reads the intro out loud:
 *  - mouth bars are driven by speech amplitude (lip-sync style)
 *  - head and eyes follow the cursor
 *  - random blinking, antenna pulse, waving hand while talking
 */
const AvatarBot = ({ amplitude = 0, ...props }) => {
  const root = useRef();
  const head = useRef();
  const eyeL = useRef();
  const eyeR = useRef();
  const pupils = useRef();
  const antenna = useRef();
  const chest = useRef();
  const handR = useRef();
  const handL = useRef();
  const halo = useRef();
  const mouth = useRef([]);

  const amp = useRef(0);
  const target = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const blink = useRef({ next: 2, t: -1 });

  useEffect(() => {
    target.current = amplitude;
  }, [amplitude]);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    amp.current += (target.current - amp.current) * Math.min(1, delta * 12);
    const a = amp.current;

    /* head follows cursor */
    if (head.current) {
      head.current.rotation.y += (mouse.current.x * 0.5 - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (mouse.current.y * 0.3 - head.current.rotation.x) * 0.08;
      head.current.rotation.z = Math.sin(t * 0.8) * 0.03 + a * Math.sin(t * 9) * 0.03;
    }
    if (pupils.current) {
      pupils.current.position.x += (mouse.current.x * 0.05 - pupils.current.position.x) * 0.15;
      pupils.current.position.y += (-mouse.current.y * 0.03 - pupils.current.position.y) * 0.15;
    }

    /* blinking */
    const b = blink.current;
    if (t > b.next && b.t < 0) b.t = 0;
    let eyeScale = 1;
    if (b.t >= 0) {
      b.t += delta * 9;
      eyeScale = Math.max(0.08, Math.abs(Math.cos(b.t * Math.PI * 0.5)));
      if (b.t >= 2) {
        b.t = -1;
        b.next = t + 1.5 + Math.random() * 3.5;
      }
    }
    if (eyeL.current) eyeL.current.scale.y = eyeScale;
    if (eyeR.current) eyeR.current.scale.y = eyeScale;

    /* mouth: a row of bars acting as a voice equaliser */
    mouth.current.forEach((m, i) => {
      if (!m) return;
      const centre = 1 - Math.abs(i - (MOUTH_BARS - 1) / 2) / (MOUTH_BARS / 2);
      const wave = 0.5 + 0.5 * Math.sin(t * 16 + i * 1.7) * Math.sin(t * 7.3 + i);
      const h = 0.025 + a * (0.1 + 0.55 * wave) * (0.35 + 0.65 * centre);
      m.scale.y = h / 0.1;
    });

    /* antenna + chest core pulse */
    if (antenna.current) {
      antenna.current.material.emissiveIntensity = 1 + Math.sin(t * 3) * 0.4 + a * 3;
      antenna.current.scale.setScalar(1 + a * 0.6);
    }
    if (chest.current) {
      chest.current.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.3 + a * 2.5;
    }

    /* hands: right one waves while speaking, left floats */
    if (handR.current) {
      const wave = a > 0.04 ? 1 : 0.15;
      handR.current.position.y = 0.2 + Math.sin(t * 2) * 0.05 + wave * (0.85 + Math.sin(t * 7) * 0.18);
      handR.current.position.x = 1.25 + wave * Math.sin(t * 7) * 0.12;
    }
    if (handL.current) {
      handL.current.position.y = -0.1 + Math.sin(t * 1.6 + 1) * 0.07;
    }

    if (halo.current) {
      halo.current.rotation.z = t * 0.5;
      halo.current.scale.setScalar(1 + a * 0.15);
    }
    if (root.current) {
      /* subtle lean toward the viewer while speaking */
      root.current.rotation.x += ((a > 0.04 ? 0.06 : 0) - root.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={root} {...props}>
      {/* studio lighting: key + coloured rims */}
      <directionalLight position={[2, 4, 6]} intensity={1.4} />
      <pointLight position={[-3.5, 1.5, 1.5]} color={CYAN} intensity={6} distance={9} />
      <pointLight position={[3.5, 1, 1]} color={PINK} intensity={5} distance={9} />
      <pointLight position={[0, 3.5, -2.5]} color={PURPLE} intensity={6} distance={9} />

      {/* soft glow behind the avatar */}
      <mesh position={[0, 0.8, -1.6]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial map={GLOW_TEX} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.5}>
        {/* ─── Head ─── */}
        <group ref={head} position={[0, 1.55, 0]}>
          <RoundedBox args={[1.7, 1.35, 1.3]} radius={0.38} smoothness={6}>
            <meshPhysicalMaterial color="#eef1ff" metalness={0.15} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {/* rim accents */}
          <mesh position={[0, 0.69, 0]}>
            <boxGeometry args={[0.9, 0.03, 0.9]} />
            <meshStandardMaterial {...glow(PURPLE, 1.5)} />
          </mesh>
          {/* ear discs */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[0.28, 0.28, 0.16, 32]} />
                <meshStandardMaterial color="#141a4a" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, s * 0.09, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
                <meshStandardMaterial {...glow(CYAN, 1.4)} />
              </mesh>
            </group>
          ))}
          {/* visor */}
          <RoundedBox args={[1.45, 1.0, 0.1]} radius={0.3} smoothness={6} position={[0, 0.02, 0.62]}>
            <meshStandardMaterial color="#02030d" metalness={1} roughness={0.05} />
          </RoundedBox>

          <group position={[0, 0.02, 0.69]}>
            {/* eyes */}
            <group ref={pupils}>
              <mesh ref={eyeL} position={[-0.32, 0.17, 0]}>
                <capsuleGeometry args={[0.09, 0.14, 8, 16]} />
                <meshStandardMaterial {...glow(CYAN, 2.2)} />
              </mesh>
              <mesh ref={eyeR} position={[0.32, 0.17, 0]}>
                <capsuleGeometry args={[0.09, 0.14, 8, 16]} />
                <meshStandardMaterial {...glow(CYAN, 2.2)} />
              </mesh>
            </group>
            {/* mouth equaliser */}
            <group position={[0, -0.25, 0]}>
              {Array.from({ length: MOUTH_BARS }, (_, i) => (
                <mesh
                  key={i}
                  ref={(el) => (mouth.current[i] = el)}
                  position={[(i - (MOUTH_BARS - 1) / 2) * 0.1, 0, 0]}
                >
                  <boxGeometry args={[0.05, 0.1, 0.03]} />
                  <meshStandardMaterial {...glow(i % 2 ? PINK : CYAN, 2)} />
                </mesh>
              ))}
            </group>
          </group>

          {/* antenna */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
            <meshStandardMaterial color="#8892b0" metalness={1} roughness={0.2} />
          </mesh>
          <mesh ref={antenna} position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial {...glow(PINK, 1.5)} />
          </mesh>
        </group>

        {/* ─── Neck ─── */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.22, 0.3, 0.28, 24]} />
          <meshStandardMaterial color="#1a2060" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* ─── Torso ─── */}
        <group position={[0, -0.1, 0]}>
          <RoundedBox args={[1.5, 1.35, 0.95]} radius={0.4} smoothness={6}>
            <meshPhysicalMaterial color="#eef1ff" metalness={0.15} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          <mesh ref={chest} position={[0, 0.1, 0.48]}>
            <circleGeometry args={[0.24, 6]} />
            <meshStandardMaterial {...glow(CYAN, 1.5)} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.1, 0.475]}>
            <ringGeometry args={[0.28, 0.33, 6]} />
            <meshStandardMaterial {...glow(PURPLE, 1.5)} side={THREE.DoubleSide} />
          </mesh>
          {/* "AC" badge lines */}
          {[-0.3, -0.42].map((y, i) => (
            <mesh key={i} position={[0, y, 0.48]}>
              <boxGeometry args={[0.6 - i * 0.25, 0.03, 0.01]} />
              <meshStandardMaterial {...glow(i ? PINK : CYAN, 1.2)} />
            </mesh>
          ))}
        </group>

        {/* ─── Floating hands ─── */}
        <mesh ref={handR} position={[1.25, 0.2, 0.2]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshPhysicalMaterial color="#eef1ff" metalness={0.1} roughness={0.2} clearcoat={1} emissive={CYAN} emissiveIntensity={0.15} />
        </mesh>
        <mesh ref={handL} position={[-1.25, -0.1, 0.2]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshPhysicalMaterial color="#eef1ff" metalness={0.1} roughness={0.2} clearcoat={1} emissive={PURPLE} emissiveIntensity={0.15} />
        </mesh>
      </Float>

      {/* holographic base + halo ring */}
      <group position={[0, -1.7, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 64]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 64]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.08} />
        </mesh>
      </group>
      <mesh ref={halo} position={[0, 0.7, -1]}>
        <torusGeometry args={[2.6, 0.012, 8, 120]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default AvatarBot;
