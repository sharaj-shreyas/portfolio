import type { Plate } from "@/content/data";

export function PlateArt({ plate }: { plate: Plate }) {
  return (
    <figure className="plate">
      <div className="plate__art" aria-hidden="true">
        {plate.lines.map((line, index) => (
          <span key={`${line.text}-${index}`}>
            {line.italic ? <i>{line.text}</i> : line.text}
            {line.sub &&
              (line.subStyle === "sup" ? (
                <sup>{line.sub}</sup>
              ) : (
                <i>{line.sub}</i>
              ))}
          </span>
        ))}
      </div>
      <figcaption className="plate__caption">
        <span className="plate__title">{plate.title}</span>
        <span className="caption">{plate.caption}</span>
      </figcaption>
    </figure>
  );
}
