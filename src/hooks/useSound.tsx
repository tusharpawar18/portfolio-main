import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type SoundKind = "click" | "hover" | "ignition" | "rev";

interface SoundAPI {
  enabled: boolean;
  toggle: () => void;
  play: (kind: SoundKind) => void;
  stop: () => void;
  isPlaying: boolean;
}

const SoundCtx = createContext<SoundAPI | null>(null);

/**
 * Premium, synth-based sound system using the Web Audio API.
 * - Zero network calls, zero assets
 * - Muted by default; only plays after user toggles on
 * - Short, subtle, cinematic — no loops, no game-y effects
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const activeRef = useRef<{ stop: () => void } | null>(null);

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return { ctx: ctxRef.current, master: masterRef.current! };
  };

  const fadeMaster = (target: number, ms = 400) => {
    const { ctx, master } = ensureCtx();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + ms / 1000);
  };

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      ensureCtx();
      if (next) {
        fadeMaster(0.7, 500);
      } else {
        fadeMaster(0, 300);
        // Also stop any one-shot that's currently playing
        activeRef.current?.stop();
        activeRef.current = null;
      }
      return next;
    });
  };

  const stop = () => {
    activeRef.current?.stop();
    activeRef.current = null;
    setIsPlaying(false);
  };

  const play = (kind: SoundKind) => {
    if (!enabled) return;
    const { ctx, master } = ensureCtx();
    const t = ctx.currentTime;

    if (kind === "click") {
      // Short high tick
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(1400, t);
      o.frequency.exponentialRampToValueAtTime(700, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.12);
    } else if (kind === "hover") {
      // Whisper-soft high shimmer
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(2200, t);
      o.frequency.exponentialRampToValueAtTime(2600, t + 0.09);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.04, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.14);
    } else if (kind === "ignition" || kind === "rev") {
      // Stop any previously active one-shot first (re-trigger safety)
      activeRef.current?.stop();
      activeRef.current = null;

      // Car ignition: low rumble sweep + noise burst, then rev
      const dur = kind === "ignition" ? 1.6 : 0.9;
      const fadeIn = 0.2;
      const fadeOut = 0.3;

      // Per-sound bus so we can fade-out and hard-stop independently
      const bus = ctx.createGain();
      bus.gain.setValueAtTime(0.0001, t);
      bus.gain.linearRampToValueAtTime(1, t + fadeIn);
      bus.connect(master);

      // Low oscillator sweep (engine core)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(40, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.4);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.9);
      osc.frequency.exponentialRampToValueAtTime(70, t + dur);
      oscGain.gain.setValueAtTime(0.0001, t);
      oscGain.gain.exponentialRampToValueAtTime(0.25, t + 0.2);
      oscGain.gain.exponentialRampToValueAtTime(0.15, t + dur - 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(400, t);
      lp.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
      lp.frequency.exponentialRampToValueAtTime(600, t + dur);
      lp.Q.value = 6;

      osc.connect(oscGain);
      oscGain.connect(lp);
      lp.connect(bus);

      // Noise burst (ignition crackle)
      const bufferSize = Math.floor(ctx.sampleRate * dur);
      const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.15, t + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.02, t + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const nlp = ctx.createBiquadFilter();
      nlp.type = "bandpass";
      nlp.frequency.value = 700;
      nlp.Q.value = 1.2;
      noise.connect(nlp);
      nlp.connect(noiseGain);
      noiseGain.connect(bus);

      osc.start(t);
      osc.stop(t + dur + 0.05);
      noise.start(t);
      noise.stop(t + dur);

      setIsPlaying(true);
      const endTimer = setTimeout(() => {
        setIsPlaying(false);
        activeRef.current = null;
      }, (dur + 0.1) * 1000);

      activeRef.current = {
        stop: () => {
          clearTimeout(endTimer);
          const now = ctx.currentTime;
          bus.gain.cancelScheduledValues(now);
          bus.gain.setValueAtTime(bus.gain.value, now);
          bus.gain.linearRampToValueAtTime(0, now + fadeOut);
          try { osc.stop(now + fadeOut + 0.02); } catch { /* noop */ }
          try { noise.stop(now + fadeOut + 0.02); } catch { /* noop */ }
          setIsPlaying(false);
        },
      };
    }
  };

  useEffect(() => {
    return () => {
      activeRef.current?.stop();
      ctxRef.current?.close().catch(() => undefined);
    };
  }, []);

  return <SoundCtx.Provider value={{ enabled, toggle, play, stop, isPlaying }}>{children}</SoundCtx.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundCtx);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}