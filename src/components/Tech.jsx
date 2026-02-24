import React from "react";
import { motion } from "framer-motion";
import { NeuralNetworkCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";

const skillCategories = [
  {
    title: "Programming",
    skills: ["JavaScript", "Python", "SQL", "Java", "C++"],
    color: "#00d4ff",
  },
  {
    title: "Frontend",
    skills: ["React.js", "Next.js", "HTML", "CSS", "Tailwind"],
    color: "#7b2ff7",
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs"],
    color: "#f72585",
  },
  {
    title: "Database",
    skills: ["PostgreSQL", "MongoDB", "MySQL"],
    color: "#00d4ff",
  },
  {
    title: "AI / ML",
    skills: ["TensorFlow", "PyTorch", "NLP", "Transformers"],
    color: "#7b2ff7",
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Postman", "Docker"],
    color: "#f72585",
  },
];

/* ─── CSS Tech Icon (replaces WebGL Ball canvas) ─── */
const TechIcon = ({ name, icon, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.08, 0.5)}
    className="group relative"
  >
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black-100/50 border border-white/5 flex items-center justify-center
                    hover:border-accent/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-500
                    hover:scale-110 cursor-pointer"
    >
      <img
        src={icon}
        alt={name}
        className="w-14 h-14 sm:w-16 sm:h-16 object-contain
                   group-hover:scale-110 transition-transform duration-500
                   drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]"
      />
    </div>
    <p className="text-center text-secondary/60 text-[11px] mt-2 font-medium group-hover:text-accent transition-colors duration-300">
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

      {/* Neural Network 3D Visualization */}
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.75)}
        className="mt-8"
      >
        <p className="text-center text-secondary/50 text-[12px] uppercase tracking-[0.3em] font-display mb-2">
          Neural Network Visualization
        </p>
        <NeuralNetworkCanvas />
      </motion.div>

      {/* Tech Icons (CSS-based, no WebGL) */}
      <div className="mt-10 flex flex-row flex-wrap justify-center gap-8">
        {technologies.map((technology, index) => (
          <TechIcon key={technology.name} index={index} name={technology.name} icon={technology.icon} />
        ))}
      </div>

      {/* Skill Categories Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            variants={fadeIn("up", "spring", catIndex * 0.15, 0.75)}
            className="glass-card rounded-2xl p-6"
          >
            <h3
              className="skill-category mb-4"
              style={{ color: category.color }}
            >
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-white-100 text-[13px] px-3 py-1.5 rounded-full font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    background: `${category.color}15`,
                    border: `1px solid ${category.color}30`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");