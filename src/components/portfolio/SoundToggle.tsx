import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      className="group fixed right-4 top-20 z-[60] grid h-11 w-11 place-items-center rounded-full glass transition-all hover:scale-[1.06] md:right-6"
      style={{
        boxShadow: enabled
          ? "0 0 18px oklch(0.82 0.14 200 / 0.45), 0 0 40px oklch(0.82 0.14 200 / 0.18)"
          : "0 4px 20px oklch(0 0 0 / 0.4)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.span
            key="on"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.22 }}
            className="grid place-items-center"
            style={{ color: "var(--neon-cyan)" }}
          >
            <Volume2 className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.22 }}
            className="grid place-items-center text-muted-foreground"
          >
            <VolumeX className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="pointer-events-none absolute -bottom-5 right-0 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {enabled ? "sound on" : "sound off"}
      </span>
    </button>
  );
}