import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAME = "AMAN CHOUDHARY";

/* Cinematic intro: counter 0→100, name rises letter by letter, curtain splits open */
const Preloader = () => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / 2200, 1);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  const ease = [0.76, 0, 0.24, 1];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="preloader" className="fixed inset-0 z-[100] pointer-events-none" exit={{ transition: { duration: 1 } }}>
          {/* two curtain halves */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#030014]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#030014]"
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex overflow-hidden">
              {NAME.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.8, ease }}
                  className="font-display font-black text-white text-[clamp(28px,7vw,96px)] tracking-tight leading-none"
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </div>

            <div className="mt-8 w-[min(70vw,420px)] h-px bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${count}%`, background: "linear-gradient(90deg,#00d4ff,#7b2ff7,#f72585)", boxShadow: "0 0 12px #00d4ff" }}
              />
            </div>
            <div className="mt-4 w-[min(70vw,420px)] flex justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              <span>Full Stack · AI</span>
              <span className="text-accent tabular-nums">{String(count).padStart(3, "0")}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
