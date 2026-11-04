import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSpeech from "../utils/useSpeech";

/* ─── Intro text ─── */
const INTRO_TEXT =
  "Hello! I'm Aman, a Full Stack Developer and AI enthusiast. " +
  "I build production-grade platforms using React, Node dot js, PostgreSQL, and Generative AI. " +
  "Currently crafting government-scale systems at IIT Bhilai. " +
  "Welcome to my portfolio. Scroll down to explore my work!";

const SEEN_KEY = "portfolio_intro_seen";

/* ─── Animated sound-bar visualiser ─── */
const SoundBars = ({ isSpeaking }) => {
  const barsRef = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!isSpeaking) {
      barsRef.current.forEach((b) => { if (b) b.style.transform = "scaleY(0.15)"; });
      return;
    }
    let running = true;
    const animate = () => {
      if (!running) return;
      barsRef.current.forEach((b, i) => {
        if (!b) return;
        const t = Date.now() / 1000;
        const h = 0.15 + Math.abs(
          Math.sin(t * 5.5 + i * 0.45) * 0.5 +
          Math.sin(t * 9.1 + i * 0.3) * 0.3 +
          Math.sin(t * 3.3 + i * 0.6) * 0.2
        ) * 0.85;
        b.style.transform = `scaleY(${Math.min(h, 1)})`;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [isSpeaking]);

  const BAR_COUNT = 36;
  return (
    <div className="flex items-center justify-center gap-[3px] h-10 w-72 mx-auto">
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const hue = 185 + (i / BAR_COUNT) * 90;
        return (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            style={{
              width: 3,
              height: "100%",
              borderRadius: 4,
              background: `hsl(${hue}, 90%, 65%)`,
              transform: "scaleY(0.15)",
              transformOrigin: "center",
              transition: "transform 0.05s ease",
              boxShadow: `0 0 4px hsl(${hue}, 90%, 65%)`,
              opacity: isSpeaking ? 1 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
};

/* ─── Word-by-word subtitle ─── */
const SubtitleDisplay = ({ text, isSpeaking, hasStarted }) => {
  const words = text.split(" ");
  const [activeWord, setActiveWord] = useState(-1);
  const intervalRef = useRef(null);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!isSpeaking) { setActiveWord(-1); return; }
    setActiveWord(0);
    let idx = 0;
    const stepMs = (words.length / 150) * 60 * 1000 / words.length; // 150wpm
    intervalRef.current = setInterval(() => {
      idx++;
      setActiveWord(idx);
      if (idx >= words.length) clearInterval(intervalRef.current);
    }, stepMs);
    return () => clearInterval(intervalRef.current);
  }, [isSpeaking]);

  if (!hasStarted && !isSpeaking) return null;

  return (
    <div className="max-w-2xl text-center leading-relaxed select-none px-2 text-[13px]">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mx-[2px] transition-all duration-150"
          style={{
            color:
              i < activeWord
                ? "rgba(0,212,255,0.7)"
                : i === activeWord
                ? "#ffffff"
                : "rgba(255,255,255,0.3)",
            textShadow: i === activeWord ? "0 0 18px rgba(0,212,255,1)" : "none",
            fontWeight: i === activeWord ? 700 : 400,
            transform: i === activeWord ? "scale(1.08)" : "scale(1)",
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

/* ─── Pulsing play button ─── */
const PlayButton = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
    className="relative flex items-center justify-center w-14 h-14 rounded-full cursor-pointer"
    style={{
      background: "linear-gradient(135deg, #00d4ff22, #7b2ff722)",
      border: "1.5px solid rgba(0,212,255,0.4)",
      boxShadow: "0 0 24px rgba(0,212,255,0.25), inset 0 0 12px rgba(0,212,255,0.08)",
    }}
  >
    {/* Ripple rings */}
    {[0, 0.4, 0.8].map((delay, i) => (
      <div
        key={i}
        className="absolute inset-0 rounded-full border border-cyan-400/30"
        style={{ animation: `ring-expand 1.8s ease-out ${delay}s infinite` }}
      />
    ))}
    {/* Play icon */}
    <svg className="w-6 h-6 text-cyan-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </motion.button>
);

/* ─── Main component ─── */
const SpeechIntro = ({ onAmplitudeChange }) => {
  const { speak, stop, isSpeaking, amplitude, hasSpoken, isSupported } = useSpeech();
  const [visible, setVisible]       = useState(false);
  const [dismissed, setDismissed]   = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // user clicked play

  /* Pass amplitude up to Hero → HeroScene */
  useEffect(() => { onAmplitudeChange?.(amplitude); }, [amplitude, onAmplitudeChange]);

  /* Show panel 900ms after load — but DON'T auto-speak */
  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  /* Auto-dismiss 1.5s after speech ends */
  useEffect(() => {
    if (hasSpoken && visible) {
      const t = setTimeout(handleDismiss, 1500);
      return () => clearTimeout(t);
    }
  }, [hasSpoken, visible]);

  /* ── User clicks the Play button ── 
     The click IS the user gesture — Chrome will allow speak() here */
  const handlePlay = useCallback(() => {
    setHasStarted(true);
    speak(INTRO_TEXT, { rate: 0.9, pitch: 1.05, volume: 1 });
  }, [speak]);

  const handleDismiss = useCallback(() => {
    stop();
    setDismissed(true);
    setVisible(false);
    localStorage.setItem(SEEN_KEY, "1");
  }, [stop]);

  if (!isSupported || dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="speech-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-end pointer-events-none"
        >
          <motion.div
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 70, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mb-8 mx-4 w-full max-w-3xl"
          >
            {/* Glass card */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.07] p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(3,0,20,0.94) 0%, rgba(10,10,40,0.96) 100%)",
                backdropFilter: "blur(28px)",
                boxShadow:
                  "0 0 0 1px rgba(0,212,255,0.1), 0 28px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Top glowing border — sweeps when speaking */}
              <div
                className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{
                  backgroundSize: "200% auto",
                  background: isSpeaking
                    ? "linear-gradient(90deg, transparent 0%, #00d4ff 30%, #7b2ff7 60%, #f72585 80%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 20%, rgba(0,212,255,0.4) 50%, transparent 80%)",
                  animation: isSpeaking ? "border-sweep 1.8s linear infinite" : "none",
                }}
              />

              {/* Row: indicator + status + skip */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Live dot */}
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: isSpeaking ? "#00d4ff" : hasStarted ? "#7b2ff7" : "#334",
                        boxShadow: isSpeaking ? "0 0 10px #00d4ff" : "none",
                        animation: isSpeaking ? "ping-glow 1s ease-out infinite" : "none",
                      }}
                    />
                    {isSpeaking && (
                      <div
                        className="absolute inset-0 rounded-full border border-cyan-400/30"
                        style={{ animation: "ring-expand 1.2s ease-out infinite" }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em] leading-none mb-0.5">
                      Portfolio Intro
                    </p>
                    <p className="text-[13px] font-semibold leading-tight"
                      style={{
                        color: isSpeaking ? "#00d4ff" : hasStarted ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)",
                      }}>
                      {isSpeaking
                        ? "Aman is speaking…"
                        : hasSpoken
                        ? "Introduction complete ✓"
                        : "Click ▶ to hear my introduction"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.08]
                             text-white/30 hover:text-white/70 hover:border-white/20 text-[10px] font-mono
                             uppercase tracking-widest transition-all duration-300 hover:bg-white/[0.04]"
                >
                  Skip
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Centre: Play button OR sound bars */}
              <div className="flex items-center justify-center gap-6 my-2">
                {!hasStarted && !isSpeaking ? (
                  <div className="flex flex-col items-center gap-2">
                    <PlayButton onClick={handlePlay} />
                    <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">
                      tap to hear
                    </span>
                  </div>
                ) : (
                  <SoundBars isSpeaking={isSpeaking} />
                )}
              </div>

              {/* Subtitle */}
              <div className="mt-3 min-h-[42px] flex items-center justify-center">
                <SubtitleDisplay
                  text={INTRO_TEXT}
                  isSpeaking={isSpeaking}
                  hasStarted={hasStarted}
                />
              </div>

              {/* Footer rule */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.04]" />
                <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest whitespace-nowrap">
                  {isSpeaking ? "— listening —" : hasSpoken ? "— done —" : "— click play to start —"}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.04]" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechIntro;
