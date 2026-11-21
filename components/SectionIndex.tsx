import { indexNav } from "@/content/data";
import { SmoothLink } from "./SmoothLink";

export function SectionIndex() {
  return (
    <nav className="index wrap" aria-label="Sections">
      <p>{indexNav.kicker}</p>
      <ul className="index__links">
        {indexNav.links.map((link) => (
          <li key={link.href}>
            <SmoothLink href={link.href}>{link.label}</SmoothLink>
          </li>
        ))}
      </ul>
      <p className="index__edition">{indexNav.edition}</p>
    </nav>
  );
}
