import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "rgba(10, 10, 46, 0.6)",
      color: "#fff",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0, 212, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    }}
    contentArrowStyle={{ borderRight: "7px solid rgba(0, 212, 255, 0.2)" }}
    date={experience.date}
    iconStyle={{
      background: experience.iconBg,
      boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
    }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={experience.icon}
          alt={experience.company_name}
          className="w-[60%] h-[60%] object-contain"
        />
      </div>
    }
  >
    <div>
      <h3 className="text-white text-[22px] font-bold font-display">
        {experience.title}
      </h3>
      <p
        className="text-accent text-[15px] font-semibold"
        style={{ margin: 0 }}
      >
        {experience.company_name}
      </p>
    </div>

    <ul className="mt-5 list-disc ml-5 space-y-2">
      {experience.points.map((point, index) => (
        <li
          key={`experience-point-${index}`}
          className="text-white-100 text-[13px] pl-1 tracking-wider leading-relaxed"
        >
          {point}
        </li>
      ))}
    </ul>

    {/* Key Projects */}
    {experience.keyProjects && (
      <div className="mt-6 pt-4 border-t border-accent/10">
        <h4 className="text-accent text-[14px] font-display font-semibold mb-3 tracking-wide uppercase">
          Key Projects
        </h4>
        {experience.keyProjects.map((project, index) => (
          <div key={index} className="mb-3">
            <h5 className="text-white font-semibold text-[14px]">
              {project.name}
            </h5>
            <p className="text-secondary text-[12px] leading-relaxed mt-1">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    )}
  </VerticalTimelineElement>
);

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I have done so far</p>
        <h2 className={styles.sectionHeadText}>
          Work Experience<span className="text-accent">.</span>
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");