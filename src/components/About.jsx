import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services, stats } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon, description }) => {
  return (
    <Tilt className="xs:w-[250px] w-full" tiltMaxAngleX={15} tiltMaxAngleY={15}>
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px]"
      >
        <div className="bg-tertiary rounded-[20px] py-6 px-8 min-h-[280px] flex justify-evenly items-center flex-col glass-card">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <img
              src={icon}
              alt={title}
              className="w-10 h-10 object-contain"
            />
          </div>
          <h3 className="text-white text-[20px] font-bold text-center font-display">
            {title}
          </h3>
          <p className="text-secondary text-[13px] text-center mt-2 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </Tilt>
  );
};

const StatCard = ({ value, label, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", 0.3 * index, 0.6)}
    className="flex flex-col items-center"
  >
    <span className="stat-value text-[36px] sm:text-[48px]">{value}</span>
    <span className="text-secondary text-[13px] sm:text-[14px] mt-1 font-medium tracking-wide">
      {label}
    </span>
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
        className="mt-4 text-secondary text-[16px] max-w-3xl leading-[28px]"
      >
        Full Stack Developer with 1.8+ years of experience building scalable
        frontend and backend systems using Node.js, Express.js, React.js, and
        PostgreSQL. Currently developing production-grade government platforms at
        IIT Bhilai used by thousands of users statewide. Skilled in REST API
        development, frontend dashboards, and database optimization. Actively
        expanding expertise in Artificial Intelligence, NLP, and Generative AI.
      </motion.p>

      {/* Stats */}
      <div className="mt-16 flex flex-wrap justify-center gap-10 sm:gap-16">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} index={index} {...stat} />
        ))}
      </div>

      {/* Service Cards */}
      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");