"use client";

import { useEffect, useRef } from "react";
import { projectsSection } from "@/content/data";

let assetsPromise: Promise<void> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.appendChild(script);
  });
}

function loadStageAssets() {
  if (!assetsPromise) {
    assetsPromise = loadScript("/assets/models.js").then(() =>
      loadScript("/assets/stage.js"),
    );
  }
  return assetsPromise;
}

export function ProjectStage() {
  const stageRef = useRef<HTMLElement>(null);
  const { stage } = projectsSection;

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;

    let cancelled = false;
    const boot = () => {
      void loadStageAssets().catch(() => {
        if (cancelled) return;
        root
          .querySelector<HTMLElement>(".stage__frame")
          ?.classList.add("is-unsupported");
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      boot();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          boot();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <figure className="stage" ref={stageRef}>
      <div className="stage__frame">
        <canvas
          id="stage-canvas"
          tabIndex={0}
          role="img"
          aria-label={stage.ariaLabel}
        />
        <div className="stage__hud" aria-hidden="true">
          <span>{stage.hud[0]}</span>
          <span>{stage.hud[1]}</span>
        </div>
        {stage.labels.map((label) => (
          <p
            className="stage__label"
            data-anchor={label.anchor}
            aria-hidden="true"
            hidden
            key={label.anchor}
          >
            <strong>{label.title}</strong>
            {label.caption}
          </p>
        ))}
        <p className="stage__status" aria-hidden="true">
          <span className="stage__loading">{stage.loading}</span>
          <span className="stage__fallback">{stage.fallback}</span>
        </p>
      </div>
      <figcaption className="plate__caption">
        <span className="plate__title">{stage.title}</span>
        <span className="caption">{stage.caption}</span>
      </figcaption>
    </figure>
  );
}
