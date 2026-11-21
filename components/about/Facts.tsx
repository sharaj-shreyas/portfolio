import type { Fact } from "@/content/data";

export function Facts({ items }: { items: Fact[] }) {
  return (
    <dl className="facts">
      {items.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
