import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { education, certifications } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const EducationCard = ({ index, degree, institution, period, score, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.3, 0.75)}
    className="glass-card rounded-2xl p-6 sm:p-8 flex-1 min-w-[280px] max-w-[500px]"
  >
    <div className="flex items-start gap-4">
      <div className="text-4xl">{icon}</div>
      <div className="flex-1">
        <h3 className="text-white text-[18px] sm:text-[20px] font-bold font-display leading-tight">
          {degree}
        </h3>
        <p className="text-secondary text-[13px] sm:text-[14px] mt-1">
          {institution}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="text-accent text-[13px] font-semibold font-display bg-accent/10 px-3 py-1 rounded-full">
            {period}
          </span>
          <span className="text-accent-pink text-[13px] font-semibold font-display bg-accent-pink/10 px-3 py-1 rounded-full">
            {score}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const CertificationCard = ({ index, name, issuer, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.3 + 0.6, 0.75)}
    className="glass-card rounded-xl p-4 sm:p-5 flex items-center gap-3 min-w-[250px]"
  >
    <div className="text-2xl">{icon}</div>
    <div>
      <h4 className="text-white text-[14px] sm:text-[15px] font-semibold">
        {name}
      </h4>
      <p className="text-secondary text-[12px] sm:text-[13px]">{issuer}</p>
    </div>
  </motion.div>
);

const Education = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Academic Journey</p>
        <h2 className={styles.sectionHeadText}>
          Education<span className="text-accent">.</span>
        </h2>
      </motion.div>

      {/* Education Cards */}
      <div className="mt-14 flex flex-wrap gap-8 justify-center">
        {education.map((edu, index) => (
          <EducationCard key={edu.degree} index={index} {...edu} />
        ))}
      </div>

      {/* Certifications */}
      <motion.div variants={textVariant(0.5)} className="mt-16">
        <h3 className="text-white text-[24px] sm:text-[28px] font-bold font-display">
          Certifications<span className="text-accent">.</span>
        </h3>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-6 justify-center">
        {certifications.map((cert, index) => (
          <CertificationCard key={cert.name} index={index} {...cert} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Education, "education");
