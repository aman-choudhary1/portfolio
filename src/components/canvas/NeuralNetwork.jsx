import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

/* ─── Neural Network Nodes ─── */
const NeuralNetwork = () => {
  const groupRef = useRef();
  
  const { nodes, connectionPoints } = useMemo(() => {
    const nodes = [];
    const connectionPoints = [];
    
    const layers = [
      { count: 4, x: -3, color: "#00d4ff" },
      { count: 6, x: -1, color: "#4dc9f6" },
      { count: 8, x: 1, color: "#7b2ff7" },
      { count: 6, x: 3, color: "#f72585" },
      { count: 4, x: 5, color: "#00ffaa" },
    ];

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        nodes.push({
          position: [
            layer.x + (Math.random() - 0.5) * 0.3,
            (i - layer.count / 2) * 0.6 + (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 2,
          ],
          color: layer.color,
          layer: layerIndex,
          index: i,
        });
      }
    });

    // Create connection midpoints as particles (instead of lineSegments)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[j].layer === nodes[i].layer + 1 && Math.random() > 0.5) {
          // Add several points along the line between connected nodes
          const steps = 5;
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            connectionPoints.push(
              nodes[i].position[0] + (nodes[j].position[0] - nodes[i].position[0]) * t,
              nodes[i].position[1] + (nodes[j].position[1] - nodes[i].position[1]) * t,
              nodes[i].position[2] + (nodes[j].position[2] - nodes[i].position[2]) * t,
            );
          }
        }
      }
    }

    return { nodes, connectionPoints: new Float32Array(connectionPoints) };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <NodeSphere key={i} position={node.position} color={node.color} index={i} />
      ))}

      {/* Connections as particle dots along lines */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connectionPoints.length / 3}
            array={connectionPoints}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00d4ff"
          size={0.03}
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const NodeSphere = ({ position, color, index }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + index * 0.5) * 0.1;
      const pulse = 1 + Math.sin(t * 2 + index * 0.7) * 0.2;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

/* ─── Data Pulses ─── */
const DataPulses = () => {
  const count = 25;
  const ref = useRef();

  const pulseData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      startPos: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
      speed: Math.random() * 0.5 + 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const pulse = pulseData[i];
      const progress = ((t * pulse.speed + pulse.offset) % 6) / 6;
      positions[i * 3] = pulse.startPos[0] + Math.sin(progress * Math.PI * 2) * 2;
      positions[i * 3 + 1] = pulse.startPos[1] + Math.cos(progress * Math.PI * 2) * 1.5;
      positions[i * 3 + 2] = pulse.startPos[2] + Math.sin(progress * Math.PI) * 1;
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
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
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.08}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const NeuralNetworkCanvas = () => {
  return (
    <div className="w-full h-[350px] sm:h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[3, 3, 3]} color="#00d4ff" intensity={0.8} />
          <pointLight position={[-3, -3, 3]} color="#7b2ff7" intensity={0.6} />
          <NeuralNetwork />
          <DataPulses />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default NeuralNetworkCanvas;
