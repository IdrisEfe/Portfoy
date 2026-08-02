"use client";

import { useEffect, useRef } from "react";

export type AvatarMode = "face" | "mask";
type Point3 = { x: number; y: number; z: number };
type Point2 = { x: number; y: number; depth: number };

const FACE_ROWS = 19;
const FACE_COLUMNS = 27;

function createFaceSurface(): Point3[] {
  const points: Point3[] = [];
  for (let row = 0; row < FACE_ROWS; row += 1) {
    const latitude = -1.22 + (row / (FACE_ROWS - 1)) * 2.44;
    for (let column = 0; column < FACE_COLUMNS; column += 1) {
      const longitude = -Math.PI + (column / (FACE_COLUMNS - 1)) * Math.PI * 2;
      const taper = Math.cos(latitude);
      const jaw = 1 - Math.max(0, Math.sin(latitude)) * .16;
      points.push({
        x: Math.sin(longitude) * taper * .76 * jaw,
        y: Math.sin(latitude) * 1.08,
        z: Math.cos(longitude) * taper * .68,
      });
    }
  }
  return points;
}

const faceSurface = createFaceSurface();

export function DigitalMask({ compact = false, mode = "face" }: { compact?: boolean; mode?: AvatarMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    let target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    let pulse = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target = { x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 };
    };
    const leave = () => { target = { x: 0, y: 0 }; };
    const activate = () => { pulse = 1; };

    const drawMask = (width: number, height: number, ink: string, glow: string, time: number) => {
      const cx = width / 2 + pointer.x * 15;
      const cy = height / 2 + pointer.y * 10;
      const radius = Math.min(width, height) * .34;
      context.save(); context.translate(cx, cy); context.globalCompositeOperation = "lighter";
      for (let ring = 0; ring < 7; ring += 1) {
        context.beginPath();
        for (let index = 0; index <= 90; index += 1) {
          const angle = (index / 90) * Math.PI * 2;
          const wave = Math.sin(angle * 3 + time * (1 + ring * .07)) * 7 + Math.cos(angle * 5 - time * .7) * 4;
          const radiusAtPoint = radius * (1 - ring * .055) + wave;
          const x = Math.cos(angle) * radiusAtPoint * (.9 + Math.sin(time * .35 + ring) * .035);
          const y = Math.sin(angle) * radiusAtPoint * 1.18;
          if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.closePath(); context.strokeStyle = ring % 2 ? glow : ink; context.globalAlpha = .18 - ring * .012; context.lineWidth = 1.2; context.stroke();
      }
      context.globalAlpha = .72; context.fillStyle = ink;
      for (const side of [-1, 1]) { context.beginPath(); context.ellipse(side * radius * .34 + pointer.x * 8, -radius * .12 + pointer.y * 9, 5, 2.2, pointer.x * .4, 0, Math.PI * 2); context.fill(); }
      context.beginPath(); context.arc(pointer.x * 5, radius * .26, 2.2 + Math.sin(time) * .5, 0, Math.PI * 2); context.fill(); context.restore();
    };

    const drawFace = (width: number, height: number, ink: string, glow: string, time: number) => {
      const scale = Math.min(width, height) * (.38 + pulse * .012);
      const centerX = width / 2;
      const centerY = height / 2 + scale * .02;
      const yaw = pointer.x * .85 + Math.sin(time * .35) * .075;
      const pitch = -pointer.y * .38 + Math.cos(time * .27) * .025;
      const project = (point: Point3): Point2 => {
        const cosYaw = Math.cos(yaw); const sinYaw = Math.sin(yaw);
        const x = point.x * cosYaw + point.z * sinYaw;
        const z = -point.x * sinYaw + point.z * cosYaw;
        const cosPitch = Math.cos(pitch); const sinPitch = Math.sin(pitch);
        const y = point.y * cosPitch - z * sinPitch;
        const depth = point.y * sinPitch + z * cosPitch;
        const perspective = 1 / (1.18 - depth * .16);
        return { x: centerX + x * scale * perspective, y: centerY + y * scale * perspective, depth };
      };
      const projected = faceSurface.map(project);

      context.save(); context.globalCompositeOperation = "lighter";
      context.lineWidth = .7;
      for (let row = 0; row < FACE_ROWS; row += 1) {
        for (let column = 0; column < FACE_COLUMNS; column += 1) {
          const index = row * FACE_COLUMNS + column; const point = projected[index];
          const alpha = Math.max(.035, Math.min(.24, .09 + point.depth * .13));
          context.strokeStyle = `color-mix(in srgb, ${index % 5 ? glow : ink} ${Math.round(alpha * 100)}%, transparent)`;
          if (column < FACE_COLUMNS - 1) { const next = projected[index + 1]; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke(); }
          if (row < FACE_ROWS - 1 && column % 2 === row % 2) { const next = projected[index + FACE_COLUMNS]; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke(); }
        }
      }
      projected.forEach((point, index) => {
        if (point.depth < -.25 && index % 3) return;
        context.globalAlpha = Math.max(.12, Math.min(.78, .35 + point.depth * .5));
        context.fillStyle = index % 7 ? glow : ink;
        context.beginPath(); context.arc(point.x, point.y, index % 11 === 0 ? 1.6 : .85, 0, Math.PI * 2); context.fill();
      });

      const feature = (points: Point3[], color: string, widthAtPoint = 1.8) => {
        context.globalAlpha = .82; context.strokeStyle = color; context.lineWidth = widthAtPoint; context.beginPath();
        points.map(project).forEach((point, index) => { if (index === 0) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y); }); context.stroke();
      };
      for (const side of [-1, 1]) {
        feature(Array.from({ length: 12 }, (_, index) => { const angle = (index / 11) * Math.PI; return { x: side * .29 + Math.cos(angle) * .14, y: -.13 + Math.sin(angle) * .035, z: .64 }; }), ink, 2.2);
        const pupil = project({ x: side * .29 + pointer.x * .035, y: -.11 + pointer.y * .02, z: .67 });
        context.globalAlpha = .92; context.fillStyle = ink; context.beginPath(); context.arc(pupil.x, pupil.y, 2.8 + pulse * 2, 0, Math.PI * 2); context.fill();
      }
      feature([{ x: 0, y: -.03, z: .69 }, { x: -.025, y: .1, z: .76 }, { x: .02, y: .22, z: .78 }, { x: .09, y: .24, z: .69 }], glow, 1.5);
      feature(Array.from({ length: 17 }, (_, index) => { const x = -.2 + index * .025; return { x, y: .42 + Math.cos((x / .2) * Math.PI / 2) * .035, z: .63 + Math.cos((x / .2) * Math.PI / 2) * .04 }; }), ink, 2);
      context.globalAlpha = .16 + pulse * .25; context.strokeStyle = glow; context.lineWidth = 1; context.beginPath(); context.arc(centerX, centerY, scale * (.93 + pulse * .08), 0, Math.PI * 2); context.stroke();
      context.restore();
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const time = reduce ? 2 : frame * .008;
      pointer.x += (target.x - pointer.x) * .055; pointer.y += (target.y - pointer.y) * .055; pulse *= .92;
      const style = getComputedStyle(canvas);
      const ink = style.getPropertyValue("--mask-ink").trim() || "#d7ff64";
      const glow = style.getPropertyValue("--mask-glow").trim() || "#7c5cff";
      if (mode === "face") drawFace(width, height, ink, glow, time); else drawMask(width, height, ink, glow, time);
      frame += 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize(); draw(); addEventListener("resize", resize); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerleave", leave); canvas.addEventListener("pointerdown", activate);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("pointerdown", activate); };
  }, [mode]);

  const label = mode === "face" ? "An interactive three-dimensional point-cloud face" : "A constantly transforming digital mask";
  return <canvas ref={canvasRef} className={compact ? "digital-mask compact" : "digital-mask"} aria-label={label} role="img" />;
}
