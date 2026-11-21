"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/data";

type CopyButtonProps = {
  value: string;
  valueId: string;
  ariaLabel: string;
};

export function CopyButton({ value, valueId, ariaLabel }: CopyButtonProps) {
  const [label, setLabel] = useState<string>(ui.copy);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const flash = (next: string) => {
    setLabel(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel(ui.copy), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      flash(ui.copied);
    } catch {
      // Older browsers, or a denied clipboard permission: select the value so
      // the visitor can copy it with the keyboard.
      const target = document.getElementById(valueId);
      if (target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      flash(ui.selected);
    }
  };

  return (
    <button
      className="copy"
      type="button"
      aria-label={ariaLabel}
      aria-live="polite"
      onClick={copy}
    >
      {label}
    </button>
  );
}
