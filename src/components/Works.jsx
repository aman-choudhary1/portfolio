import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ACCENTS = ["#00d4ff", "#7b2ff7", "#f72585", "#00ffaa"];

/* Each card sticks, and shrinks/dims as the next one slides over it */
const StackCard = ({ project, index, total }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - index) * 0.04]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.5]);
  const accent = ACCENTS[index % ACCENTS.length];

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} className="stack-card h-[85vh] flex items-start" style={{ top: `${110 + index * 28}px` }}>
      <motion.div
        style={{ scale, transformOrigin: "top center" }}
        onMouseMove={onMove}
        className="spot-card group relative w-full rounded-[28px] overflow-hidden border border-white/[0.08] bg-[#08082a]/90 backdrop-blur-2xl
                   grid md:grid-cols-[1.15fr_1fr] min-h-[460px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* image side */}
        <div className="relative overflow-hidden min-h-[220px]">
          <img
            src={project.image}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08082a] md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08082a] to-transparent md:hidden" />
          <div className="absolute inset-0 mix-blend-color opacity-40" style={{ background: accent }} />
        </div>

        {/* content side */}
        <div className="relative p-7 sm:p-10 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] tracking-[0.3em] uppercase" style={{ color: accent }}>
              Project / {String(index + 1).padStart(2, "0")}
            </span>
            <button
              onClick={() => window.open(project.source_code_link, "_blank")}
              className="flex items-center gap-2 h-10 px-4 rounded-full border border-white/10 bg-white/5 text-[12px] text-white/80
                         hover:bg-white hover:text-black transition-all duration-300"
            >
              <img src={github} alt="" className="w-4 h-4 object-contain group-hover:invert-0" />
              Source
            </button>
          </div>

          <span
            className="absolute right-6 bottom-2 font-display font-black text-[160px] leading-none select-none pointer-events-none outline-text"
            style={{ WebkitTextStroke: `1px ${accent}33` }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="mt-8 font-display font-bold text-white text-[28px] sm:text-[36px] leading-tight">{project.name}</h3>
          <p className="mt-4 text-secondary/70 text-[14px] leading-[26px] max-w-md">{project.description}</p>

          <div className="mt-auto pt-8 flex flex-wrap gap-2 relative">
            {project.tags.map((tag) => (
              <span key={tag.name} className="px-3 py-1 rounded-full text-[12px] font-mono border border-white/10 bg-white/[0.04] text-white/80">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none" />
      </motion.div>
    </div>
  );
};

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Selected work</p>
      <h2 className={styles.sectionHeadText}>
        Projects<span className="text-accent">.</span>
      </h2>
    </motion.div>

    <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-3 text-secondary/60 text-[14px] max-w-3xl leading-[28px]">
      Real-world builds across the full stack. Scroll — they stack.
    </motion.p>

    <div className="mt-12 relative">
      {projects.map((project, index) => (
        <StackCard key={project.name} project={project} index={index} total={projects.length} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "projects");
