import React, { useEffect, useRef, useState, useCallback } from "react";

const FuturisticCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const cursor = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const trails = useRef([]);
  const rafId = useRef(null);

  const animate = useCallback(() => {
    // Smooth follow for dot
    cursor.current.x += (mouse.current.x - cursor.current.x) * 0.15;
    cursor.current.y += (mouse.current.y - cursor.current.y) * 0.15;

    // Slower follow for ring
    ring.current.x += (mouse.current.x - ring.current.x) * 0.08;
    ring.current.y += (mouse.current.y - ring.current.y) * 0.08;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursor.current.x}px, ${cursor.current.y}px)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) scale(${isHovering ? 1.8 : isClicking ? 0.8 : 1})`;
    }

    // Draw particle trail
    const canvas = trailCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Add new trail particle
      trails.current.push({
        x: cursor.current.x,
        y: cursor.current.y,
        life: 1,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });

      // Limit trail length
      if (trails.current.length > 30) {
        trails.current = trails.current.slice(-30);
      }

      // Update and draw trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trails.current = trails.current.filter((p) => {
        p.life -= 0.035;
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.life * 0.4})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.life * 0.08})`;
        ctx.fill();

        return true;
      });
    }

    rafId.current = requestAnimationFrame(animate);
  }, [isHovering, isClicking]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9998 }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 9999,
          width: "36px",
          height: "36px",
          marginLeft: "-18px",
          marginTop: "-18px",
          border: `1.5px solid ${isHovering ? "#00d4ff" : "rgba(0, 212, 255, 0.4)"}`,
          borderRadius: "50%",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease",
          boxShadow: isHovering
            ? "0 0 15px rgba(0, 212, 255, 0.4), inset 0 0 15px rgba(0, 212, 255, 0.1)"
            : "0 0 8px rgba(0, 212, 255, 0.15)",
          background: isHovering ? "rgba(0, 212, 255, 0.05)" : "transparent",
        }}
      />

      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 10000,
          width: isClicking ? "4px" : "6px",
          height: isClicking ? "4px" : "6px",
          marginLeft: isClicking ? "-2px" : "-3px",
          marginTop: isClicking ? "-2px" : "-3px",
          backgroundColor: "#00d4ff",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.4)",
          transition: "width 0.15s, height 0.15s, margin 0.15s",
        }}
      />

      {/* Hide default cursor */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
};

export default FuturisticCursor;
