"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { menu, ui } from "@/content/data";
import { menuLink, menuList, menuNumber, menuPanel } from "@/lib/motion";
import {
  scrollToHash,
  startScroll,
  stopScroll,
} from "@/lib/smooth-scroll";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  opener: RefObject<HTMLButtonElement | null>;
};

export function MenuOverlay({ open, onClose, opener }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    document.body.classList.add("menu-open");
    stopScroll();

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]',
        ),
      );

    const frame = requestAnimationFrame(() => {
      panel.querySelector<HTMLElement>(".menu__list a")?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
      startScroll();
    };
  }, [open, onClose]);

  const navigate = (href: string) => {
    onClose();
    window.setTimeout(() => {
      startScroll();
      scrollToHash(href);
    }, 80);
  };

  return (
    <AnimatePresence
      onExitComplete={() => opener.current?.focus()}
      initial={false}
    >
      {open && (
        <motion.div
          ref={panelRef}
          key="site-menu"
          id="site-menu"
          className="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site sections"
          variants={reduce ? undefined : menuPanel}
          initial={reduce ? false : "closed"}
          animate={reduce ? undefined : "open"}
          exit={reduce ? undefined : "exit"}
        >
          <div className="menu__inner wrap">
            <div className="menu__top">
              <p>{ui.menuSections}</p>
              <button
                className="menu__close"
                type="button"
                onClick={onClose}
              >
                {ui.closeMenu}
              </button>
            </div>

            <motion.ol
              className="menu__list"
              variants={reduce ? undefined : menuList}
            >
              {menu.links.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    variants={reduce ? undefined : menuLink}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(link.href);
                    }}
                  >
                    <motion.span
                      className="menu__num"
                      variants={reduce ? undefined : menuNumber}
                    >
                      {link.number}
                    </motion.span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </motion.ol>

            <p className="menu__foot">{menu.email}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
