import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        className="sm:w-[380px] w-full"
      >
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0c2e]/80 backdrop-blur-xl
                        hover:border-accent/20 transition-all duration-500 group">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-accent/50 to-transparent" />
          <div className="absolute top-0 left-0 h-8 w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
          <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gradient-to-l from-accent-pink/50 to-transparent" />
          <div className="absolute bottom-0 right-0 h-8 w-[1px] bg-gradient-to-t from-accent-pink/50 to-transparent" />

          {/* Image */}
          <div className="relative w-full h-[230px] overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c2e] via-transparent to-transparent" />
            {/* HUD scan line on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute left-0 right-0 h-[1px] bg-accent/20" style={{ animation: "scan-line 3s linear infinite" }} />
            </div>
            {/* GitHub button */}
            <div className="absolute top-3 right-3">
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className="w-9 h-9 rounded-lg bg-black/50 backdrop-blur-md border border-white/10
                           flex justify-center items-center cursor-pointer
                           hover:border-accent/40 hover:shadow-[0_0_12px_rgba(0,212,255,0.2)] transition-all duration-300"
              >
                <img src={github} alt="github" className="w-4 h-4 object-contain" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-white font-bold text-[20px] font-display">
              {name}
            </h3>
            <p className="mt-2 text-secondary/50 text-[13px] leading-relaxed">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] ${tag.color}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Work</p>
        <h2 className={styles.sectionHeadText}>
          Projects<span className="text-accent">.</span>
        </h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary/60 text-[14px] max-w-3xl leading-[28px]"
        >
          Real-world projects showcasing my skills across the full stack.
          Each features links to source code and demonstrates problem-solving
          with modern technologies.
        </motion.p>
      </div>

      <div className="mt-16 flex flex-wrap gap-7 justify-center">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");