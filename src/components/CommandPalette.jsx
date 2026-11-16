import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, socialLinks } from "../constants";

/* Ctrl/Cmd+K quick-navigation palette + top scroll progress bar */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    return [
      { label: "Go to top", hint: "Home", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      ...navLinks.map((l) => ({ label: `Go to ${l.title}`, hint: "Section", run: go(l.id) })),
      { label: "Open GitHub", hint: "Link", run: () => window.open(socialLinks.github, "_blank") },
      { label: "Open LinkedIn", hint: "Link", run: () => window.open(socialLinks.linkedin, "_blank") },
      { label: "Send an email", hint: "Link", run: () => (window.location.href = `mailto:${socialLinks.email}`) },
    ];
  }, []);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const run = (item) => {
    setOpen(false);
    item?.run();
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") run(filtered[index]);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[3px] z-[60] pointer-events-none"
        style={{
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg,#00d4ff,#7b2ff7,#f72585)",
          boxShadow: "0 0 12px rgba(0,212,255,0.7)",
        }}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center pt-[18vh] px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-accent/20 overflow-hidden"
              style={{ background: "rgba(6,6,32,0.95)", boxShadow: "0 0 60px rgba(0,212,255,0.15)" }}
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
                onKeyDown={onInputKey}
                placeholder="Jump to a section or link…"
                className="w-full bg-transparent px-5 py-4 text-white text-[15px] outline-none border-b border-white/[0.06] placeholder:text-white/30"
              />
              <ul className="max-h-72 overflow-y-auto p-2">
                {filtered.length === 0 && <li className="px-3 py-4 text-sm text-white/40">No results</li>}
                {filtered.map((item, i) => (
                  <li
                    key={item.label}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                    className={`flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                      i === index ? "bg-accent/10 text-accent" : "text-white/70"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{item.hint}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
