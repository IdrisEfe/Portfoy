"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, Droplets, Sparkles, X } from "lucide-react";

type Experiment = "target" | "fluid" | "fireworks";
const choices = [
  { id: "target" as const, title: "Signal / target", body: "A quiet test of timing and precision.", icon: Crosshair },
  { id: "fluid" as const, title: "Liquid cursor", body: "Pull a field of light through digital fluid.", icon: Droplets },
  { id: "fireworks" as const, title: "Night signals", body: "Build a sky from particles, rhythm, and light.", icon: Sparkles },
];

function ExperimentCanvas({ type }: { type: Experiment }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0; let t = 0; let pointer = { x: 0, y: 0, active: false }; let score = 0;
    const particles = Array.from({ length: type === "fluid" ? 120 : 80 }, () => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, life: Math.random() }));
    const resize = () => { const r = canvas.getBoundingClientRect(); const d = Math.min(devicePixelRatio, 2); canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const move = (event: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer = { x: event.clientX - r.left, y: event.clientY - r.top, active: true }; };
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect(); t += .016;
      ctx.fillStyle = "rgba(5,7,12,.12)"; ctx.fillRect(0, 0, width, height);
      if (type === "target") {
        const x = width * (.5 + Math.sin(t * .7) * .31); const y = height * (.5 + Math.cos(t * 1.1) * .27);
        ctx.strokeStyle = "#d7ff64"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 28 + Math.sin(t * 3) * 6, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 38, y); ctx.lineTo(x + 38, y); ctx.moveTo(x, y - 38); ctx.lineTo(x, y + 38); ctx.stroke();
        ctx.fillStyle = "#f6f7fb"; ctx.font = "12px monospace"; ctx.fillText(`SIGNALS ${score.toString().padStart(2, "0")}`, 20, 28);
      } else {
        particles.forEach((p, index) => {
          if (type === "fluid") {
            const px = p.x * width; const py = p.y * height; const dx = pointer.x - px; const dy = pointer.y - py; const dist = Math.max(30, Math.hypot(dx, dy));
            if (pointer.active) { p.vx += dx / dist * .012; p.vy += dy / dist * .012; }
            p.x = (p.x + p.vx / width + 1) % 1; p.y = (p.y + p.vy / height + 1) % 1; p.vx *= .985; p.vy *= .985;
            ctx.fillStyle = index % 3 ? "#7c5cff" : "#d7ff64"; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(p.x * width, p.y * height, 1.5 + index % 4, 0, Math.PI * 2); ctx.fill();
          } else {
            p.life -= .006; if (p.life <= 0) { p.x = pointer.active ? pointer.x / width : Math.random(); p.y = pointer.active ? pointer.y / height : .35 + Math.random() * .3; p.vx = (Math.random() - .5) * 3; p.vy = (Math.random() - .5) * 3; p.life = 1; }
            p.vy += .018; p.x += p.vx / width; p.y += p.vy / height;
            ctx.fillStyle = index % 3 === 0 ? "#ff6b86" : index % 3 === 1 ? "#d7ff64" : "#7c5cff"; ctx.globalAlpha = p.life; ctx.fillRect(p.x * width, p.y * height, 2, 2);
          }
        }); ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };
    const hit = () => { if (type === "target") score += 1; };
    resize(); draw(); addEventListener("resize", resize); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerdown", hit);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerdown", hit); };
  }, [type]);
  return <canvas ref={canvasRef} className="experiment-canvas" aria-label={`${type} interactive experiment`} />;
}

export function LabExperiments() {
  const [active, setActive] = useState<Experiment | null>(null);
  return <div className="lab-grid">
    {choices.map(({ id, title, body, icon: Icon }) => <button key={id} className="lab-card" onClick={() => setActive(id)}><Icon size={24} /><span>LOAD EXPERIMENT</span><h3>{title}</h3><p>{body}</p></button>)}
    {active && <div className="experiment-stage"><button onClick={() => setActive(null)}><X size={18} /> Unload</button><ExperimentCanvas type={active} /></div>}
  </div>;
}
