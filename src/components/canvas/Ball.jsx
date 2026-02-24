import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2.5}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 0, 0.05]} />
      <pointLight position={[1, 1, 1]} color="#00d4ff" intensity={0.5} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0a0a2e"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
          roughness={0.3}
          metalness={0.6}
          emissive="#0a0a2e"
          emissiveIntensity={0.1}
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
      {/* Outer wireframe glow */}
      <mesh scale={3}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.05}
          emissive="#00d4ff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;