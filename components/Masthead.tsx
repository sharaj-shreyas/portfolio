"use client";

import { useCallback, useRef, useState } from "react";
import { masthead } from "@/content/data";
import { MenuOverlay } from "./MenuOverlay";
import { SmoothLink } from "./SmoothLink";

export function Masthead() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="masthead">
        <div className="masthead__bar wrap">
          <p className="masthead__place">{masthead.location}</p>
          <SmoothLink className="masthead__name" href="#top">
            {masthead.name}
          </SmoothLink>
          <button
            ref={buttonRef}
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span>{masthead.menu}</span>
            <span className="menu-button__icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>
      <MenuOverlay open={open} onClose={closeMenu} opener={buttonRef} />
    </>
  );
}
