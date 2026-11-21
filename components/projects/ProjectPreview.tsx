"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Project } from "@/content/data";
import { Star } from "../Star";

type ProjectPreviewProps = {
  projects: Project[];
  listRef: RefObject<HTMLOListElement | null>;
};

export function ProjectPreview({ projects, listRef }: ProjectPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    const root = rootRef.current;
    const card = cardRef.current;
    if (!list || !root || !card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let shown = false;
    let active = -1;

    const hide = () => {
      if (!shown) return;
      shown = false;
      setVisible(false);
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const tick = () => {
      frame = 0;
      if (!shown) return;
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      root.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;

      if (
        Math.abs(target.x - current.x) + Math.abs(target.y - current.y) >
        0.15
      ) {
        frame = requestAnimationFrame(tick);
      }
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const eventTarget = event.target as Element | null;
      const entry = eventTarget?.closest<HTMLElement>(".entry");

      if (
        !entry ||
        entry.hidden ||
        eventTarget?.closest(".entry__body")
      ) {
        hide();
        return;
      }

      const next = Number(entry.dataset.index);
      if (!Number.isFinite(next)) return;

      const rect = card.getBoundingClientRect();
      const gap = 30;
      let x = event.clientX + gap;
      let y = event.clientY + gap;

      if (x + rect.width > window.innerWidth - 16) {
        x = event.clientX - rect.width - gap;
      }
      y = Math.max(16, Math.min(y, window.innerHeight - rect.height - 16));

      target.x = x;
      target.y = y;

      if (!shown) {
        current.x = x;
        current.y = y;
        root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        shown = true;
        setVisible(true);
      }

      if (next !== active) {
        active = next;
        setIndex(next);
      }

      if (!reduce) {
        const tiltX = Math.max(
          -1,
          Math.min(1, (event.clientY - (y + rect.height / 2)) / 340),
        );
        const tiltY = Math.max(
          -1,
          Math.min(1, (event.clientX - (x + rect.width / 2)) / 340),
        );
        card.style.setProperty("--tilt-x", `${(tiltX * 6).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(tiltY * 8).toFixed(2)}deg`);
      }

      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => hide();

    list.addEventListener("pointermove", move);
    list.addEventListener("pointerleave", onLeave);

    return () => {
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [listRef]);

  const project = projects[index] ?? projects[0];
  if (!project) return null;

  return (
    <div
      ref={rootRef}
      className={`preview${visible ? " is-visible" : ""}`}
      aria-hidden="true"
    >
      <div ref={cardRef} className="preview__card">
        <div className="preview__plate">
          <p className="preview__cat">
            <Star />
            <span>{project.categoryLabel}</span>
          </p>
          <p className="preview__no">{String(index + 1).padStart(2, "0")}</p>
          <p className="preview__title">{project.title}</p>
        </div>
      </div>
    </div>
  );
}
