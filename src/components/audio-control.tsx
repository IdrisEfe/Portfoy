"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioControl() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);

  useEffect(() => () => { audioRef.current?.context.close(); }, []);

  const toggle = async () => {
    if (enabled && audioRef.current) {
      audioRef.current.gain.gain.setTargetAtTime(0, audioRef.current.context.currentTime, .35);
      setEnabled(false);
      return;
    }
    if (!audioRef.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      const oscillators = [110, 164.81, 220].map((frequency, index) => {
        const oscillator = context.createOscillator();
        const toneGain = context.createGain();
        oscillator.type = index === 1 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        toneGain.gain.value = .11 / (index + 1);
        oscillator.connect(toneGain).connect(gain);
        oscillator.start();
        return oscillator;
      });
      audioRef.current = { context, gain, oscillators };
    }
    await audioRef.current.context.resume();
    audioRef.current.gain.gain.setTargetAtTime(.12, audioRef.current.context.currentTime, .8);
    setEnabled(true);
  };

  return <button className="icon-button" onClick={toggle} aria-label={enabled ? "Mute ambient audio" : "Play ambient audio"}>{enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>;
}
