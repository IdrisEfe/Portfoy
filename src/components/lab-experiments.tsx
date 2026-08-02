"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, Droplets, Sparkles, X } from "lucide-react";
import { useSite } from "./site-provider";

type Experiment = "target" | "fluid" | "fireworks";
const choices = [
  { id: "target" as const, title: { en: "Signal / target", tr: "Sinyal / hedef" }, body: { en: "A quiet test of timing and precision.", tr: "Zamanlama ve hassasiyet için sakin bir test." }, icon: Crosshair },
  { id: "fluid" as const, title: { en: "Liquid cursor", tr: "Akışkan imleç" }, body: { en: "Pull a field of light through digital fluid.", tr: "Dijital bir akışkanın içinden ışık alanını sürükle." }, icon: Droplets },
  { id: "fireworks" as const, title: { en: "Night signals", tr: "Gece sinyalleri" }, body: { en: "Build a sky from particles, rhythm, and light.", tr: "Parçacıklar, ritim ve ışıktan bir gökyüzü kur." }, icon: Sparkles },
];

function ExperimentCanvas({ type }: { type: Experiment }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    let score = 0;
    let misses = 0;
    let flash = 0;
    let pointer = { x: 0, y: 0, dx: 0, dy: 0, active: false };
    let target = { x: .5, y: .5, radius: 34, phase: Math.random() * Math.PI * 2 };
    let renderedTarget = { x: 0, y: 0 };
    const particles = Array.from({ length: type === "fluid" ? 360 : 110 }, () => ({
      x: Math.random(), y: Math.random(), px: 0, py: 0, vx: 0, vy: 0, life: Math.random(), hue: Math.random(),
    }));
    const resize = () => {
      const r = canvas.getBoundingClientRect(); const d = Math.min(devicePixelRatio, 2);
      canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect(); const x = event.clientX - r.left; const y = event.clientY - r.top;
      pointer = { x, y, dx: x - pointer.x, dy: y - pointer.y, active: true };
    };
    const leave = () => { pointer.active = false; pointer.dx = 0; pointer.dy = 0; };
    const newTarget = () => {
      target = { x: .16 + Math.random() * .68, y: .18 + Math.random() * .64, radius: 25 + Math.random() * 18, phase: Math.random() * Math.PI * 2 };
    };
    const shoot = (x: number, y: number) => {
      if (type !== "target") return;
      const tx = renderedTarget.x; const ty = renderedTarget.y;
      if (Math.hypot(x - tx, y - ty) <= target.radius + 8) { score += 1; flash = 1; newTarget(); }
      else { misses += 1; flash = -1; }
    };
    const press = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect(); shoot(event.clientX - r.left, event.clientY - r.top);
      if (type === "fireworks") pointer.active = true;
    };
    const key = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      event.preventDefault(); const r = canvas.getBoundingClientRect(); shoot(pointer.active ? pointer.x : r.width / 2, pointer.active ? pointer.y : r.height / 2);
    };
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect(); t += .016;
      ctx.fillStyle = type === "fluid" ? "rgba(5,7,12,.065)" : "rgba(5,7,12,.16)"; ctx.fillRect(0, 0, width, height);
      if (type === "target") {
        const x = target.x * width + Math.sin(t * 1.3 + target.phase) * 10;
        const y = target.y * height + Math.cos(t * .9 + target.phase) * 8;
        renderedTarget = { x, y };
        const pulse = target.radius + Math.sin(t * 4) * 4;
        ctx.strokeStyle = flash > 0 ? "#ffffff" : "#d7ff64"; ctx.lineWidth = 2;
        [1, .65, .32].forEach((scale) => { ctx.beginPath(); ctx.arc(x, y, pulse * scale, 0, Math.PI * 2); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(x - pulse - 12, y); ctx.lineTo(x + pulse + 12, y); ctx.moveTo(x, y - pulse - 12); ctx.lineTo(x, y + pulse + 12); ctx.stroke();
        if (pointer.active) { ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 9, 0, Math.PI * 2); ctx.stroke(); }
        ctx.fillStyle = "#f6f7fb"; ctx.font = "12px monospace";
        ctx.fillText(`SIGNALS ${score.toString().padStart(2, "0")}   MISSES ${misses.toString().padStart(2, "0")}`, 20, 28);
        ctx.fillStyle = "rgba(246,247,251,.55)"; ctx.fillText("CLICK / TAP TARGET · SPACE TO FIRE", 20, height - 22);
        flash *= .9;
      } else {
        particles.forEach((p, index) => {
          if (type === "fluid") {
            const x = p.x * width; const y = p.y * height; p.px = x; p.py = y;
            const angle = Math.sin(p.x * 7 + t * .45) * 2.1 + Math.cos(p.y * 6 - t * .3) * 1.7;
            p.vx += Math.cos(angle) * .045; p.vy += Math.sin(angle) * .045;
            if (pointer.active) {
              const dx = x - pointer.x; const dy = y - pointer.y; const distance = Math.max(22, Math.hypot(dx, dy));
              if (distance < 180) {
                const influence = (1 - distance / 180) * 1.5;
                p.vx += (-dy / distance) * influence + pointer.dx * .018 * influence;
                p.vy += (dx / distance) * influence + pointer.dy * .018 * influence;
              }
            }
            p.vx *= .965; p.vy *= .965; p.x += p.vx / width; p.y += p.vy / height;
            if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) { p.x = Math.random(); p.y = Math.random(); p.vx = 0; p.vy = 0; }
            ctx.strokeStyle = index % 5 ? "rgba(124,92,255,.38)" : "rgba(215,255,100,.62)"; ctx.lineWidth = index % 7 === 0 ? 1.6 : .8;
            ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x * width, p.y * height); ctx.stroke();
          } else {
            p.life -= .006; if (p.life <= 0) { p.x = pointer.active ? pointer.x / width : Math.random(); p.y = pointer.active ? pointer.y / height : .35 + Math.random() * .3; p.vx = (Math.random() - .5) * 3; p.vy = (Math.random() - .5) * 3; p.life = 1; }
            p.vy += .018; p.x += p.vx / width; p.y += p.vy / height;
            ctx.fillStyle = index % 3 === 0 ? "#ff6b86" : index % 3 === 1 ? "#d7ff64" : "#7c5cff"; ctx.globalAlpha = p.life; ctx.fillRect(p.x * width, p.y * height, 2, 2);
          }
        }); ctx.globalAlpha = 1; pointer.dx *= .76; pointer.dy *= .76;
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener("resize", resize); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerleave", leave); canvas.addEventListener("pointerdown", press); canvas.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("pointerdown", press); canvas.removeEventListener("keydown", key); };
  }, [type]);
  return <canvas ref={canvasRef} className="experiment-canvas" aria-label={`${type} interactive experiment`} role="application" tabIndex={0} />;
}

export function LabExperiments() {
  const [active, setActive] = useState<Experiment | null>(null);
  const { locale } = useSite();
  return <div className="lab-grid">
    {choices.map(({ id, title, body, icon: Icon }) => <button key={id} className="lab-card" onClick={() => setActive(id)}><Icon size={24} /><span>{locale === "en" ? "LOAD EXPERIMENT" : "DENEYİ YÜKLE"}</span><h3>{title[locale]}</h3><p>{body[locale]}</p></button>)}
    {active && <div className="experiment-stage"><button onClick={() => setActive(null)}><X size={18} /> {locale === "en" ? "Unload" : "Kapat"}</button><ExperimentCanvas type={active} /></div>}
  </div>;
}
