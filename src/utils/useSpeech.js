import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useSpeech — Web Speech API hook
 * speak() MUST be called from a user-gesture handler (click/tap)
 * to satisfy Chrome's autoplay policy.
 */
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [amplitude,  setAmplitude]    = useState(0);
  const [hasSpoken,  setHasSpoken]    = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const animFrameRef   = useRef(null);
  const startTimeRef   = useRef(null);
  const durationRef    = useRef(0);
  const isMountedRef   = useRef(true);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      window.speechSynthesis?.cancel();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* ── Organic amplitude simulation ── */
  const runAmplitudeLoop = useCallback((totalMs) => {
    startTimeRef.current = performance.now();
    durationRef.current  = totalMs;

    const tick = () => {
      if (!isMountedRef.current) return;
      const elapsed  = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / durationRef.current, 1);

      const envelope =
        progress < 0.07 ? progress / 0.07
        : progress > 0.90 ? (1 - progress) / 0.10
        : 1;

      const t    = elapsed / 1000;
      const wave =
        Math.abs(Math.sin(t * 6.5))             * 0.40 +
        Math.abs(Math.sin(t * 11.3 + 1.1))      * 0.30 +
        Math.abs(Math.sin(t * 19.7 + 2.4))      * 0.15 +
        Math.abs(Math.sin(t *  3.2 + 0.8))      * 0.15;

      setAmplitude(Math.min(wave * envelope, 1));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setAmplitude(0);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Estimate duration from word count ── */
  const estimateDuration = (text, rate) => {
    const words     = text.trim().split(/\s+/).length;
    const wpm       = 150 * rate;
    return Math.max((words / wpm) * 60 * 1000, 2500);
  };

  /* ── Wait for voices to load (Chrome loads async) ── */
  const getVoices = () =>
    new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) { resolve(voices); return; }
      const handler = () => { resolve(window.speechSynthesis.getVoices()); };
      window.speechSynthesis.addEventListener("voiceschanged", handler, { once: true });
      /* Fallback if event never fires */
      setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000);
    });

  const pickBestVoice = (voices) => {
    const preferred = [
      "Google UK English Male",
      "Google US English",
      "Microsoft David - English (United States)",
      "Microsoft Mark - English (United States)",
      "Alex",
      "Daniel",
      "Google UK English Female",
    ];
    for (const name of preferred) {
      const v = voices.find((v) => v.name === name);
      if (v) return v;
    }
    return (
      voices.find((v) => v.lang.startsWith("en") && !v.localService) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0] ||
      null
    );
  };

  /* ── speak() — call this from a click handler ── */
  const speak = useCallback(
    async (text, { rate = 0.9, pitch = 1.05, volume = 1 } = {}) => {
      if (!("speechSynthesis" in window)) return;

      /* Cancel any ongoing speech */
      window.speechSynthesis.cancel();
      cancelAnimationFrame(animFrameRef.current);
      await new Promise((r) => setTimeout(r, 80)); // tiny pause after cancel

      const voices = await getVoices();
      const voice  = pickBestVoice(voices);

      const utter     = new SpeechSynthesisUtterance(text);
      utter.rate      = rate;
      utter.pitch     = pitch;
      utter.volume    = volume;
      if (voice) utter.voice = voice;

      utter.onstart = () => {
        if (!isMountedRef.current) return;
        setIsSpeaking(true);
        runAmplitudeLoop(estimateDuration(text, rate));
      };

      utter.onend = () => {
        if (!isMountedRef.current) return;
        setIsSpeaking(false);
        setAmplitude(0);
        setHasSpoken(true);
        cancelAnimationFrame(animFrameRef.current);
      };

      utter.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e.error);
        if (!isMountedRef.current) return;
        setIsSpeaking(false);
        setAmplitude(0);
        cancelAnimationFrame(animFrameRef.current);
      };

      /* Chrome sometimes needs a micro-delay after cancel before speaking */
      window.speechSynthesis.speak(utter);

      /* Chrome bug: speech stalls if tab is backgrounded — keep alive */
      const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);

      utter.onend   = (...args) => { clearInterval(keepAlive); utter.onend = null; };
      /* Re-attach real handler */
      window.speechSynthesis.speak = window.speechSynthesis.speak; // noop to avoid closure issue
      utter.addEventListener("end",   () => { if (!isMountedRef.current) return; setIsSpeaking(false); setAmplitude(0); setHasSpoken(true); cancelAnimationFrame(animFrameRef.current); clearInterval(keepAlive); });
      utter.addEventListener("error", (e) => { console.warn(e.error); setIsSpeaking(false); setAmplitude(0); clearInterval(keepAlive); });
    },
    [runAmplitudeLoop]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    cancelAnimationFrame(animFrameRef.current);
    setIsSpeaking(false);
    setAmplitude(0);
    setHasSpoken(true);
  }, []);

  return { speak, stop, isSpeaking, amplitude, hasSpoken, isSupported };
};

export default useSpeech;
