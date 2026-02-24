import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { socialLinks } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_ev4kcaj",
        "template_gx0031k",
        {
          from_name: form.name,
          to_name: "Aman Choudhary",
          from_email: form.email,
          to_email: "aman.choudhary7722@gmail.com",
          message: form.message,
        },
        "AXtdXQLq5jKPmtq3b"
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you! I will get back to you as soon as possible.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] glass-card p-8 rounded-2xl"
      >
        <p className={`${styles.sectionSubText}`}>Get in touch</p>
        <h3 className={`${styles.sectionHeadText}`}>
          Contact<span className="text-accent">.</span>
        </h3>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          <a
            href={`mailto:${socialLinks.email}`}
            className="flex items-center gap-2 text-secondary text-[13px] hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {socialLinks.email}
          </a>
          <a
            href={`tel:${socialLinks.phone}`}
            className="flex items-center gap-2 text-secondary text-[13px] hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +91 {socialLinks.phone}
          </a>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[14px]">
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-black-100/50 py-4 px-6 placeholder:text-secondary/50 text-white rounded-xl outline-none border border-white/5 font-medium focus:border-accent/30 transition-colors duration-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[14px]">
              Your Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-black-100/50 py-4 px-6 placeholder:text-secondary/50 text-white rounded-xl outline-none border border-white/5 font-medium focus:border-accent/30 transition-colors duration-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[14px]">
              Your Message
            </span>
            <textarea
              rows="5"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-black-100/50 py-4 px-6 placeholder:text-secondary/50 text-white rounded-xl outline-none border border-white/5 font-medium resize-none focus:border-accent/30 transition-colors duration-300"
            />
          </label>

          <button type="submit" className="btn-primary w-fit">
            <span>{loading ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");