import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, Square } from "lucide-react";
import type { TopicSection } from "@/data/topics";

interface VoiceReaderProps {
  title: string;
  sections: TopicSection[];
}

type ReadState = "idle" | "playing" | "paused";

export function VoiceReader({ title, sections }: VoiceReaderProps) {
  const [state, setState] = useState<ReadState>("idle");
  const [supported, setSupported] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const buildText = useCallback(() => {
    const parts = [title];
    for (const section of sections) {
      parts.push(section.title + ". " + section.content.replace(/\n+/g, " "));
    }
    return parts.join(". ");
  }, [title, sections]);

  const play = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(buildText());
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.lang = "en-US";
    // Prefer a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium"))
    ) ?? voices.find(v => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setState("playing");
  }, [supported, buildText]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setState("playing");
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  if (!supported) return null;

  return (
    <div className="p-4 rounded-md border border-border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Listen</p>
      </div>

      {state === "idle" ? (
        <button
          onClick={play}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted transition-all"
        >
          <Play className="w-3.5 h-3.5" />Read Aloud
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {state === "playing" ? (
            <button
              onClick={pause}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-primary/30 bg-primary/6 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Pause className="w-3 h-3" />Pause
            </button>
          ) : (
            <button
              onClick={resume}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-primary/30 bg-primary/6 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Play className="w-3 h-3" />Resume
            </button>
          )}
          <button
            onClick={stop}
            className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      )}

      {state !== "idle" && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-0.5 rounded-full bg-primary transition-all ${state === "playing" ? "animate-bounce" : ""}`}
                style={{
                  height: state === "playing" ? `${6 + (i % 2) * 4}px` : "3px",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {state === "playing" ? "Reading..." : "Paused"}
          </span>
        </div>
      )}
    </div>
  );
}
