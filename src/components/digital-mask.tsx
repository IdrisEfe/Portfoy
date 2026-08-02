"use client";

import { useEffect, useRef } from "react";

export function DigitalMask({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    let pointer = { x: 0, y: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
    };
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const time = reduce ? 2 : frame * 0.008;
      const cx = width / 2 + pointer.x * 15;
      const cy = height / 2 + pointer.y * 10;
      const radius = Math.min(width, height) * 0.34;
      const style = getComputedStyle(canvas);
      const ink = style.getPropertyValue("--mask-ink").trim() || "#d7ff64";
      const glow = style.getPropertyValue("--mask-glow").trim() || "#7c5cff";

      context.save();
      context.translate(cx, cy);
      context.globalCompositeOperation = "lighter";
      for (let ring = 0; ring < 7; ring += 1) {
        context.beginPath();
        const points = 90;
        for (let i = 0; i <= points; i += 1) {
          const a = (i / points) * Math.PI * 2;
          const wave = Math.sin(a * 3 + time * (1 + ring * .07)) * 7 + Math.cos(a * 5 - time * .7) * 4;
          const squash = .9 + Math.sin(time * .35 + ring) * .035;
          const r = radius * (1 - ring * .055) + wave;
          const x = Math.cos(a) * r * squash;
          const y = Math.sin(a) * r * 1.18;
          if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle = ring % 2 ? glow : ink;
        context.globalAlpha = .18 - ring * .012;
        context.lineWidth = 1.2;
        context.stroke();
      }

      context.globalAlpha = .72;
      context.fillStyle = ink;
      const eyeY = -radius * .12 + pointer.y * 9;
      for (const side of [-1, 1]) {
        context.beginPath();
        context.ellipse(side * radius * .34 + pointer.x * 8, eyeY, 5, 2.2, pointer.x * .4, 0, Math.PI * 2);
        context.fill();
      }
      context.beginPath();
      context.arc(pointer.x * 5, radius * .26, 2.2 + Math.sin(time) * .5, 0, Math.PI * 2);
      context.fill();
      context.restore();
      frame += 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    addEventListener("resize", resize);
    canvas.addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); };
  }, []);

  return <canvas ref={canvasRef} className={compact ? "digital-mask compact" : "digital-mask"} aria-label="A constantly transforming digital mask" />;
}
