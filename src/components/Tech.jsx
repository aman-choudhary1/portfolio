import React from "react";
import { motion } from "framer-motion";
import { BallCanvas } from "./canvas";
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

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I work with</p>
        <h2 className={styles.sectionHeadText}>
          Skills<span className="text-accent">.</span>
        </h2>
      </motion.div>

      {/* 3D Tech Balls */}
      <div className="mt-14 flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology) => (
          <div className="w-28 h-28" key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>

      {/* Skill Categories Grid */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="text-white-100 text-[13px] px-3 py-1.5 rounded-full font-medium"
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