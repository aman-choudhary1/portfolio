import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { HeroSceneCanvas } from "./canvas";
import { socialLinks } from "../constants";

const roles = [
  "Full Stack Developer",
  "Backend Engineer",
  "Frontend Developer",
  "AI / ML Enthusiast",
];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout;
    if (!isDeleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
    } else if (!isDeleting && text.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* HUD grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Radial glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_40%,rgba(0,212,255,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_75%_60%,rgba(123,47,247,0.06),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary to-transparent z-10" />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <HeroSceneCanvas />
      </div>

      {/* Content */}
      <div
        className={`${styles.paddingX} absolute inset-0 top-[100px] max-w-7xl mx-auto flex flex-row items-start gap-5 z-10`}
      >
        {/* Accent line */}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-accent shadow-[0_0_20px_rgba(0,212,255,0.6)]" />
          <div className="w-1 sm:h-60 h-40 bg-gradient-to-b from-accent via-accent-purple to-transparent" />
        </div>

        <div className="mt-3">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-emerald-400/80 text-[11px] font-mono uppercase tracking-[0.15em]">
              Available for Work
            </span>
          </div>

          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm{" "}
            <span className="accent-text-gradient text-glow">Aman</span>
          </h1>

          <div className="mt-2 flex items-center gap-1">
            <span className="text-[18px] sm:text-[22px] text-white/60 font-light">
              I'm a{" "}
            </span>
            <span className="text-[18px] sm:text-[22px] text-accent font-semibold font-display">
              {text}
            </span>
            <span
              className="inline-block w-[2px] h-[22px] bg-accent ml-0.5"
              style={{ animation: "typing-cursor 1s steps(1) infinite" }}
            />
          </div>

          <p className="mt-3 text-secondary/60 text-[14px] max-w-lg leading-relaxed">
            Building production-grade government platforms at IIT Bhilai.
            <br />
            Specializing in Node.js, React.js, PostgreSQL & GenAI.
          </p>

          {/* Social links */}
          <div className="flex gap-3 mt-6">
            {[
              { href: socialLinks.github, label: "GH", icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              )},
              { href: socialLinks.linkedin, label: "LI", icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              )},
              { href: `mailto:${socialLinks.email}`, label: "EM", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              )},
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "EM" ? "_blank" : undefined}
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0c0c2e]/80 border border-white/[0.06] flex items-center justify-center
                           text-secondary/50 hover:text-accent hover:border-accent/30
                           hover:shadow-[0_0_20px_rgba(0,212,255,0.12)] transition-all duration-500"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute xs:bottom-10 bottom-8 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[28px] h-[48px] rounded-full border-2 border-accent/30 flex justify-center items-start p-1.5">
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(0,212,255,0.6)]"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;