import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";

const FloatingElements = () => {
  const groupRef = useRef();
  
  const shapes = useMemo(() => [
    { type: "torus", position: [-6, 2, -5], color: "#00d4ff", scale: 0.4, speed: 0.3 },
    { type: "octahedron", position: [7, -1, -4], color: "#7b2ff7", scale: 0.35, speed: 0.25 },
    { type: "tetrahedron", position: [-5, -3, -6], color: "#f72585", scale: 0.3, speed: 0.35 },
    { type: "dodecahedron", position: [6, 3, -5], color: "#00ffaa", scale: 0.28, speed: 0.2 },
    { type: "icosahedron", position: [-3, 4, -7], color: "#4dc9f6", scale: 0.32, speed: 0.28 },
    { type: "torusKnot", position: [4, -4, -6], color: "#00d4ff", scale: 0.25, speed: 0.22 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <FloatingGeo key={i} {...shape} index={i} />
      ))}
    </group>
  );
};

const FloatingGeo = ({ type, position, color, scale, speed, index }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = t * speed;
      ref.current.rotation.y = t * speed * 0.7;
      ref.current.position.y = position[1] + Math.sin(t * speed * 2 + index) * 0.8;
      ref.current.position.x = position[0] + Math.cos(t * speed * 1.5 + index) * 0.3;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case "torus": return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "octahedron": return <octahedronGeometry args={[1]} />;
      case "tetrahedron": return <tetrahedronGeometry args={[1]} />;
      case "dodecahedron": return <dodecahedronGeometry args={[1]} />;
      case "icosahedron": return <icosahedronGeometry args={[1, 0]} />;
      case "torusKnot": return <torusKnotGeometry args={[0.8, 0.3, 64, 8]} />;
      default: return <sphereGeometry args={[1]} />;
    }
  };

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  );
};

const FloatingElementsCanvas = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <FloatingElements />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FloatingElementsCanvas;
