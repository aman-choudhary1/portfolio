import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks, socialLinks } from "../constants";
import { logo } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-all duration-500
        ${scrolled
          ? "bg-[#030014]/80 backdrop-blur-xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
        }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <div className="flex items-center gap-1.5">
            <span className="text-white text-[16px] font-bold font-display tracking-tight">
              Aman
            </span>
            <span className="text-accent text-[16px] font-bold font-display tracking-tight">
              Choudhary
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="list-none hidden sm:flex flex-row items-center gap-1">
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <a
                href={`#${nav.id}`}
                className={`relative px-4 py-2 text-[13px] font-mono uppercase tracking-[0.1em] rounded-lg transition-all duration-300
                  ${active === nav.title
                    ? "text-accent"
                    : "text-secondary/50 hover:text-white"
                  }`}
                onClick={() => setActive(nav.title)}
              >
                {active === nav.title && (
                  <span className="absolute inset-0 rounded-lg bg-accent/[0.06] border border-accent/[0.15]" />
                )}
                <span className="relative z-10">{nav.title}</span>
              </a>
            </li>
          ))}
          {/* Resume button */}
          <li className="ml-3">
            <a
              href={socialLinks.resume}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-[12px] font-mono uppercase tracking-[0.1em] rounded-lg
                         bg-accent/10 border border-accent/20 text-accent
                         hover:bg-accent/20 hover:border-accent/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]
                         transition-all duration-300"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setToggle(!toggle)}
            className="w-9 h-9 rounded-lg bg-[#0c0c2e]/80 border border-white/[0.06] flex flex-col items-center justify-center gap-1.5
                       hover:border-accent/30 transition-all duration-300"
          >
            <span className={`w-4 h-[1.5px] bg-accent transition-all duration-300 ${toggle ? "rotate-45 translate-y-[4.5px]" : ""}`} />
            <span className={`w-4 h-[1.5px] bg-accent transition-all duration-300 ${toggle ? "opacity-0" : ""}`} />
            <span className={`w-4 h-[1.5px] bg-accent transition-all duration-300 ${toggle ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${!toggle ? "hidden" : "flex"} absolute top-16 right-4 mx-4 my-2 min-w-[200px] z-30
                      bg-[#0a0a2e]/95 backdrop-blur-xl border border-white/[0.06] rounded-xl p-5 flex-col gap-3
                      shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
        >
          {navLinks.map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className={`text-[13px] font-mono uppercase tracking-[0.1em] py-2 px-3 rounded-lg transition-all duration-300
                ${active === nav.title
                  ? "text-accent bg-accent/[0.06] border border-accent/[0.15]"
                  : "text-secondary/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              onClick={() => {
                setActive(nav.title);
                setToggle(false);
              }}
            >
              {nav.title}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;