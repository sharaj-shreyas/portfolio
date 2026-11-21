"use client";

import { closingBanner, openingBanner } from "@/content/data";
import { FitWord } from "./FitWord";
import { Star } from "./Star";

export function Banner() {
  return (
    <section className="banner" id="top" aria-labelledby="site-title">
      <div className="wrap">
        <h1 className="banner__word" id="site-title">
          <span className="visually-hidden">{openingBanner.hiddenTitle}</span>
          <FitWord
            text={openingBanner.word}
            descender
            animation="load"
            ariaHidden
          />
        </h1>
        <div className="banner__meta">
          <p>{openingBanner.left}</p>
          <Star />
          <p>{openingBanner.right}</p>
        </div>
      </div>
    </section>
  );
}

export function ClosingBanner() {
  return (
    <div className="banner" aria-hidden="true">
      <div className="wrap">
        <p className="banner__word">
          <FitWord
            text={closingBanner.word}
            animation="scroll"
            ariaHidden
          />
        </p>
      </div>
    </div>
  );
}
