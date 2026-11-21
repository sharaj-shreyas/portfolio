"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { scrollToHash } from "@/lib/smooth-scroll";

type SmoothLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/** An anchor that hands `#hash` links to Lenis (or native smooth scroll). */
export function SmoothLink({
  href,
  children,
  onClick,
  ...props
}: SmoothLinkProps) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (href.startsWith("#")) {
          event.preventDefault();
          scrollToHash(href);
        }
      }}
    >
      {children}
    </a>
  );
}
