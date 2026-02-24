import React, { useState } from "react";
import { motion } from "framer-motion";
import { NeuralNetworkCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";

const skillCategories = [
  {
    title: "Languages",
    icon: "⚡",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "SQL", level: 85 },
      { name: "Java", level: 70 },
      { name: "C++", level: 65 },
    ],
    color: "#00d4ff",
    gradient: "from-[#00d4ff]/20 to-[#0891b2]/10",
  },
  {
    title: "Frontend",
    icon: "🎨",
    skills: [
      { name: "React.js", level: 92 },
      { name: "Next.js", level: 80 },
      { name: "Tailwind CSS", level: 88 },
      { name: "Three.js", level: 70 },
      { name: "Framer Motion", level: 75 },
    ],
    color: "#7b2ff7",
    gradient: "from-[#7b2ff7]/20 to-[#6d28d9]/10",
  },
  {
    title: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 88 },
      { name: "REST APIs", level: 92 },
      { name: "WebSockets", level: 72 },
    ],
    color: "#f72585",
    gradient: "from-[#f72585]/20 to-[#db2777]/10",
  },
  {
    title: "Database",
    icon: "🗄️",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 82 },
      { name: "MySQL", level: 78 },
      { name: "Redis", level: 60 },
    ],
    color: "#00ffaa",
    gradient: "from-[#00ffaa]/20 to-[#10b981]/10",
  },
  {
    title: "AI / ML",
    icon: "🧠",
    skills: [
      { name: "TensorFlow", level: 65 },
      { name: "PyTorch", level: 60 },
      { name: "NLP", level: 55 },
      { name: "Transformers", level: 50 },
    ],
    color: "#ff6b35",
    gradient: "from-[#ff6b35]/20 to-[#f59e0b]/10",
  },
  {
    title: "DevOps & Tools",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "Docker", level: 72 },
      { name: "Linux", level: 75 },
      { name: "Postman", level: 85 },
    ],
    color: "#4dc9f6",
    gradient: "from-[#4dc9f6]/20 to-[#06b6d4]/10",
  },
];

/* ─── Skill Progress Bar ─── */
const SkillBar = ({ name, level, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group"
  >
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-white/80 text-[13px] font-medium group-hover:text-white transition-colors">
        {name}
      </span>
      <span
        className="text-[11px] font-mono font-bold"
        style={{ color }}
      >
        {level}%
      </span>
    </div>
    <div className="w-full h-[6px] rounded-full bg-white/5 overflow-hidden backdrop-blur-sm">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
        className="h-full rounded-full relative"
        style={{
          background: `linear-gradient(90deg, ${color}40, ${color})`,
          boxShadow: `0 0 12px ${color}40, 0 0 4px ${color}20`,
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
            animation: "shimmer 2s infinite",
          }}
        />
      </motion.div>
    </div>
  </motion.div>
);

/* ─── Holographic Skill Category Card ─── */
const SkillCategoryCard = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.12, 0.75)}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow background on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${category.color}30, transparent, ${category.color}20)`,
        }}
      />

      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 bg-[#0c0c2e]/80 backdrop-blur-xl">
        {/* Animated corner accents */}
        <div
          className="absolute top-0 left-0 w-12 h-[2px] rounded-full"
          style={{ background: `linear-gradient(90deg, ${category.color}, transparent)` }}
        />
        <div
          className="absolute top-0 left-0 h-12 w-[2px] rounded-full"
          style={{ background: `linear-gradient(180deg, ${category.color}, transparent)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-12 h-[2px] rounded-full"
          style={{ background: `linear-gradient(270deg, ${category.color}, transparent)` }}
        />
        <div
          className="absolute bottom-0 right-0 h-12 w-[2px] rounded-full"
          style={{ background: `linear-gradient(0deg, ${category.color}, transparent)` }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${category.color}20 1px, transparent 1px), linear-gradient(90deg, ${category.color}20 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `${category.color}15`,
                border: `1px solid ${category.color}25`,
                boxShadow: isHovered ? `0 0 20px ${category.color}15` : "none",
              }}
            >
              {category.icon}
            </div>
            <div>
              <h3
                className="text-[16px] font-bold font-display tracking-wide"
                style={{ color: category.color }}
              >
                {category.title}
              </h3>
              <p className="text-secondary/40 text-[11px] font-mono">
                {category.skills.length} skills
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            {category.skills.map((skill, i) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                color={category.color}
                delay={index * 0.1 + i * 0.06}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Floating Tech Icon ─── */
const TechIcon = ({ name, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.15, y: -8 }}
    className="group relative cursor-pointer"
  >
    {/* Glow ring */}
    <div className="absolute -inset-1 rounded-xl bg-accent/0 group-hover:bg-accent/10 transition-all duration-500 blur-md" />
    <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-xl bg-[#0c0c2e]/80 border border-white/[0.06]
                    group-hover:border-accent/30 flex items-center justify-center transition-all duration-500
                    group-hover:shadow-[0_0_25px_rgba(0,212,255,0.12)]"
    >
      <img
        src={icon}
        alt={name}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-all duration-500
                   group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
      />
    </div>
    <p className="text-center text-secondary/40 text-[10px] mt-1.5 font-mono group-hover:text-accent/70 transition-colors duration-300">
      {name}
    </p>
  </motion.div>
);

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I work with</p>
        <h2 className={styles.sectionHeadText}>
          Skills<span className="text-accent">.</span>
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary/60 text-[14px] max-w-2xl leading-relaxed"
      >
        A comprehensive toolkit refined through real-world projects and production systems.
      </motion.p>

      {/* Neural Network 3D Visualization */}
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.75)}
        className="mt-8"
      >
        <p className="text-center text-secondary/30 text-[11px] uppercase tracking-[0.4em] font-mono mb-2">
          ◆ Neural Network Visualization ◆
        </p>
        <NeuralNetworkCanvas />
      </motion.div>

      {/* Tech Icons Row */}
      <div className="mt-6 flex flex-row flex-wrap justify-center gap-5">
        {technologies.map((technology, index) => (
          <TechIcon key={technology.name} index={index} name={technology.name} icon={technology.icon} />
        ))}
      </div>

      {/* Holographic Skill Cards Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {skillCategories.map((category, index) => (
          <SkillCategoryCard key={category.title} category={category} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");