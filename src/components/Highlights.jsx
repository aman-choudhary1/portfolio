import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { technologies, stats } from "../constants";

/* ── Count-up number ── */
const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseFloat(value);
  const suffix = value.replace(/[0-9.]/g, "");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      setN(num * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num]);

  const shown = Number.isInteger(num) ? Math.round(n) : n.toFixed(1);
  return <span ref={ref}>{shown}{suffix}</span>;
};

/* ── Card with cursor-following spotlight ── */
const SpotCard = ({ className = "", children, delay = 0 }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className={`spot-card relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Highlights = () => (
  <section className="relative z-0 max-w-7xl mx-auto sm:px-16 px-6 py-16">
    <p className="text-accent uppercase tracking-[0.2em] text-[13px] font-display font-medium">At a glance</p>
    <h2 className="font-display font-black text-white md:text-[48px] sm:text-[38px] text-[30px] mb-8">
      Numbers <span className="accent-text-gradient">&amp;</span> Craft
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px]">
      {/* Big statement */}
      <SpotCard className="col-span-2 row-span-2 flex flex-col justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent/70">Currently</span>
        <div>
          <h3 className="font-display font-bold text-white text-[26px] sm:text-[32px] leading-tight">
            Shipping government-scale platforms at <span className="accent-text-gradient">IIT Bhilai</span>
          </h3>
          <p className="text-secondary/60 text-sm mt-3">Node.js · React · PostgreSQL · GenAI</p>
        </div>
      </SpotCard>

      {stats.map((s, i) => (
        <SpotCard key={s.label} delay={0.1 * (i + 1)} className="flex flex-col justify-center">
          <div className="font-display font-black text-[34px] text-white">
            <CountUp value={s.value} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-secondary/60 mt-1">{s.label}</div>
        </SpotCard>
      ))}

      {/* Stack tile */}
      <SpotCard className="col-span-2 flex flex-col justify-center" delay={0.5}>
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent/70 mb-3">Daily drivers</span>
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 8).map((t) => (
            <span key={t.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80">
              <img src={t.icon} alt="" className="w-3.5 h-3.5 object-contain" />
              {t.name}
            </span>
          ))}
        </div>
      </SpotCard>
    </div>

    {/* Marquee */}
    <div className="marquee mt-12 -mx-6 sm:-mx-16">
      <div className="marquee-track">
        {[...technologies, ...technologies].map((t, i) => (
          <span key={i} className="flex items-center gap-3 mx-8 text-white/30 font-display font-bold text-[28px] whitespace-nowrap">
            <img src={t.icon} alt="" className="w-7 h-7 object-contain opacity-60" />
            {t.name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Highlights;
