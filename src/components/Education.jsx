import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { education, certifications } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const EducationCard = ({ index, degree, institution, period, score, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.3, 0.75)}
    className="flex-1 min-w-[280px] max-w-[500px] group"
  >
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0c2e]/80 backdrop-blur-xl
                    hover:border-accent/20 transition-all duration-500 p-6 sm:p-8">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-10 h-[1px] bg-gradient-to-r from-accent/50 to-transparent" />
      <div className="absolute top-0 left-0 h-10 w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-gradient-to-l from-accent-purple/50 to-transparent" />
      <div className="absolute bottom-0 right-0 h-10 w-[1px] bg-gradient-to-t from-accent-purple/50 to-transparent" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />

      <div className="flex items-start gap-4 relative z-10">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <div className="flex-1">
          <h3 className="text-white text-[17px] sm:text-[19px] font-bold font-display leading-tight">
            {degree}
          </h3>
          <p className="text-secondary/50 text-[13px] mt-1 font-mono">
            {institution}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-accent text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-accent/10 border border-accent/20">
              {period}
            </span>
            <span className="text-accent-pink text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-accent-pink/10 border border-accent-pink/20">
              {score}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const CertificationCard = ({ index, name, issuer, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.3 + 0.6, 0.75)}
    className="group"
  >
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/[0.06] bg-[#0c0c2e]/80
                    hover:border-accent/20 transition-all duration-500 min-w-[250px]">
      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div>
        <h4 className="text-white text-[14px] font-semibold">{name}</h4>
        <p className="text-secondary/40 text-[12px] font-mono">{issuer}</p>
      </div>
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

      <div className="mt-14 flex flex-wrap gap-8 justify-center">
        {education.map((edu, index) => (
          <EducationCard key={edu.degree} index={index} {...edu} />
        ))}
      </div>

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
