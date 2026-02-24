import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn, fadeIn } from "../utils/motion";
import { socialLinks } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
        "service_xxxxx",
        "template_xxxxx",
        {
          from_name: form.name,
          to_name: "Aman",
          from_email: form.email,
          to_email: socialLinks.email,
          message: form.message,
        },
        "xxxxx"
      )
      .then(() => {
        setLoading(false);
        alert("Message sent! I'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0c2e]/80 backdrop-blur-xl p-8"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-[1px] bg-gradient-to-r from-accent/60 to-transparent" />
        <div className="absolute top-0 left-0 h-16 w-[1px] bg-gradient-to-b from-accent/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-16 h-[1px] bg-gradient-to-l from-accent-pink/60 to-transparent" />
        <div className="absolute bottom-0 right-0 h-16 w-[1px] bg-gradient-to-t from-accent-pink/60 to-transparent" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>
          Contact<span className="text-accent">.</span>
        </h3>

        {/* Direct contact */}
        <div className="flex flex-wrap items-center gap-4 mt-3 mb-8">
          <a
            href={`mailto:${socialLinks.email}`}
            className="flex items-center gap-2 text-secondary/40 text-[12px] font-mono hover:text-accent transition-colors duration-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            {socialLinks.email}
          </a>
          <a
            href={`tel:${socialLinks.phone}`}
            className="flex items-center gap-2 text-secondary/40 text-[12px] font-mono hover:text-accent transition-colors duration-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            {socialLinks.phone}
          </a>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <label className="flex flex-col">
            <span className="text-white/60 font-mono text-[12px] mb-2 uppercase tracking-wider">
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-white/[0.03] border border-white/[0.06] py-3 px-4 rounded-lg text-white text-[14px]
                         placeholder:text-secondary/30 font-mono
                         focus:border-accent/40 focus:shadow-[0_0_15px_rgba(0,212,255,0.08)] focus:outline-none
                         transition-all duration-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white/60 font-mono text-[12px] mb-2 uppercase tracking-wider">
              Your Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="bg-white/[0.03] border border-white/[0.06] py-3 px-4 rounded-lg text-white text-[14px]
                         placeholder:text-secondary/30 font-mono
                         focus:border-accent/40 focus:shadow-[0_0_15px_rgba(0,212,255,0.08)] focus:outline-none
                         transition-all duration-300"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white/60 font-mono text-[12px] mb-2 uppercase tracking-wider">
              Your Message
            </span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to say?"
              className="bg-white/[0.03] border border-white/[0.06] py-3 px-4 rounded-lg text-white text-[14px]
                         placeholder:text-secondary/30 font-mono resize-none
                         focus:border-accent/40 focus:shadow-[0_0_15px_rgba(0,212,255,0.08)] focus:outline-none
                         transition-all duration-300"
            />
          </label>

          <button
            type="submit"
            className="py-3 px-8 rounded-lg font-mono text-[13px] uppercase tracking-[0.15em] font-bold
                       bg-accent/10 border border-accent/30 text-accent
                       hover:bg-accent/20 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]
                       active:scale-95 transition-all duration-300 w-fit"
          >
            {loading ? "Sending..." : "Send Message"}
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