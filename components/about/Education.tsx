import type { EducationItem } from "@/content/data";

type EducationProps = {
  title: string;
  items: EducationItem[];
};

export function Education({ title, items }: EducationProps) {
  return (
    <div>
      <h3 className="side-title" id="education-title">
        {title}
      </h3>
      <ol className="edu">
        {items.map((item) => (
          <li key={`${item.when}-${item.what}`}>
            <p className="edu__when">{item.when}</p>
            <p className="edu__what">{item.what}</p>
            <p className="edu__where">{item.where}</p>
            {item.score && <p className="edu__score">{item.score}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
