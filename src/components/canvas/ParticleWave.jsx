import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";

const WaveMesh = ({ color, speed, amplitude, yOffset }) => {
  const ref = useRef();
  const segments = 80;

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(16, 3, segments, segments);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const waveX = Math.sin(x * 0.5 + time * speed) * amplitude;
      const waveY = Math.cos(y * 0.8 + time * speed * 0.7) * amplitude * 0.5;
      const ripple = Math.sin(Math.sqrt(x * x + y * y) * 0.6 - time * speed * 1.2) * amplitude * 0.3;
      pos.setZ(i, waveX + waveY + ripple);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, yOffset, 0]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const ParticleWaveCanvas = ({ height = "200px", className = "" }) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <WaveMesh color="#00d4ff" speed={0.8} amplitude={0.4} yOffset={0} />
          <WaveMesh color="#7b2ff7" speed={0.6} amplitude={0.3} yOffset={-0.3} />
          <WaveMesh color="#f72585" speed={1.0} amplitude={0.2} yOffset={-0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticleWaveCanvas;
