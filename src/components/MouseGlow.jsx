import React, { useEffect, useState } from "react";

const MouseGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-8);
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main glow */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full transition-transform duration-75 ease-out"
        style={{
          left: position.x - 150,
          top: position.y - 150,
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, rgba(123,47,247,0.03) 40%, transparent 70%)",
        }}
      />
      {/* Small cursor dot */}
      <div
        className="absolute w-3 h-3 rounded-full transition-transform duration-75 ease-out"
        style={{
          left: position.x - 6,
          top: position.y - 6,
          background: "rgba(0,212,255,0.6)",
          boxShadow: "0 0 12px rgba(0,212,255,0.5), 0 0 24px rgba(0,212,255,0.2)",
        }}
      />
      {/* Trail dots */}
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="absolute rounded-full"
          style={{
            left: point.x - 2,
            top: point.y - 2,
            width: 4 - (i * 0.3),
            height: 4 - (i * 0.3),
            background: `rgba(0,212,255,${0.15 + (i / trail.length) * 0.2})`,
            boxShadow: `0 0 ${4 + i}px rgba(0,212,255,${0.1 + (i / trail.length) * 0.15})`,
          }}
        />
      ))}
    </div>
  );
};

export default MouseGlow;
