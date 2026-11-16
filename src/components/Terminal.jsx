import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experiences, education, projects, technologies, socialLinks, stats } from "../constants";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const COMMANDS = {
  help: () => [
    "Available commands:",
    "  about      who is Aman",
    "  skills     tech stack",
    "  experience where I work",
    "  projects   things I built",
    "  education  where I studied",
    "  stats      numbers at a glance",
    "  contact    get in touch",
    "  goto <section>  about | work | skills | projects | contact",
    "  clear      clear the screen",
  ],
  about: () => [
    "Aman Choudhary — Full Stack Developer.",
    "Node.js, React, PostgreSQL & Generative AI.",
    "Building government-scale platforms at IIT Bhilai.",
  ],
  skills: () => [technologies.map((t) => t.name).join("  ·  ")],
  experience: () =>
    experiences.flatMap((e) => [`▸ ${e.title} @ ${e.company_name} (${e.date})`, ...e.points.slice(0, 3).map((p) => `   - ${p}`)]),
  projects: () => projects.map((p) => `▸ ${p.name}  ${p.source_code_link}`),
  education: () => education.map((e) => `▸ ${e.degree} — ${e.institution} (${e.period})`),
  stats: () => stats.map((s) => `${s.value.padEnd(6)} ${s.label}`),
  contact: () => [`email    ${socialLinks.email}`, `github   ${socialLinks.github}`, `linkedin ${socialLinks.linkedin}`],
};

const Terminal = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([{ t: "out", v: "Hi! I'm Aman's terminal. Type 'help' to begin." }]);
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    const next = [{ t: "in", v: cmd }];
    if (name === "clear") return setLines([]);
    if (name === "goto") {
      const id = args[0];
      scrollTo(id);
      next.push({ t: "out", v: `Scrolling to ${id || "?"}…` });
    } else if (COMMANDS[name]) {
      COMMANDS[name]().forEach((v) => next.push({ t: "out", v }));
    } else {
      next.push({ t: "err", v: `command not found: ${name}. Try 'help'.` });
    }
    setLines((l) => [...l, ...next]);
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      if (history[i] !== undefined) { setHIdx(i); setInput(history[i]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(i);
      setInput(i >= 0 ? history[i] : "");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[55]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-[min(92vw,420px)] rounded-2xl overflow-hidden border border-accent/20 backdrop-blur-xl"
            style={{ background: "rgba(3,0,20,0.88)", boxShadow: "0 20px 80px rgba(0,212,255,0.18)" }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f72585]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ffaa]" />
              <span className="ml-2 text-[11px] font-mono text-white/40">aman@portfolio ~ </span>
              <button onClick={() => setOpen(false)} className="ml-auto text-white/40 hover:text-white text-sm">✕</button>
            </div>
            <div
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
              className="h-72 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed"
            >
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap break-words ${
                    l.t === "in" ? "text-accent" : l.t === "err" ? "text-accent-pink" : "text-white/70"
                  }`}
                >
                  {l.t === "in" ? "❯ " : ""}
                  {l.v}
                </div>
              ))}
              <div className="flex items-center gap-2 text-accent">
                ❯
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  className="flex-1 bg-transparent outline-none text-white caret-accent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle terminal"
        className="ml-auto flex items-center gap-2 h-12 px-4 rounded-full border border-accent/40 text-accent font-mono text-[12px]
                   bg-[#030014]/80 backdrop-blur-md hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-500"
      >
        <span className="text-base">&gt;_</span> Ask Aman
      </button>
    </div>
  );
};

export default Terminal;
