import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services, stats } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon, description }) => (
  <Tilt
    tiltMaxAngleX={12}
    tiltMaxAngleY={12}
    className="xs:w-[250px] w-full"
  >
    <motion.div
      variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-[#0a0a2e] rounded-[20px] py-6 px-6 min-h-[240px] flex flex-col justify-start items-center relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <img src={icon} alt={title} className="w-16 h-16 object-contain relative z-10" />
        <h3 className="text-white text-[17px] font-bold text-center mt-3 font-display relative z-10">
          {title}
        </h3>
        <p className="text-secondary/50 text-[12px] text-center mt-2 leading-relaxed relative z-10">
          {description}
        </p>
      </div>
    </motion.div>
  </Tilt>
);

const StatItem = ({ value, label, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.5)}
    className="text-center group"
  >
    <div className="stat-value text-[36px] sm:text-[44px] mb-1 transition-all duration-300 group-hover:scale-105">
      {value}
    </div>
    <p className="text-secondary/40 text-[12px] font-mono uppercase tracking-[0.15em]">{label}</p>
  </motion.div>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>
          Overview<span className="text-accent">.</span>
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary/70 text-[15px] max-w-3xl leading-[28px]"
      >
        Full Stack Developer with 1.8+ years of experience building scalable
        frontend and backend systems using Node.js, Express.js, React.js, and
        PostgreSQL. Currently developing production-grade government platforms at
        IIT Bhilai used by thousands of users statewide. Skilled in REST API
        development, frontend dashboards, and database optimization. Actively
        expanding expertise in Artificial Intelligence, NLP, and Generative AI.
      </motion.p>

      {/* Stats */}
      <div className="mt-12 flex flex-wrap gap-10 sm:gap-16 justify-center">
        {stats.map((stat, index) => (
          <StatItem key={stat.label} index={index} {...stat} />
        ))}
      </div>

      {/* Service Cards */}
      <div className="mt-16 flex flex-wrap gap-8 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");