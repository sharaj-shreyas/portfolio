import { footer } from "@/content/data";
import { SmoothLink } from "./SmoothLink";

export function Footer() {
  return (
    <footer className="footer wrap">
      <p>{footer.copyright}</p>
      <p>{footer.colophon}</p>
      <SmoothLink href="#top">
        {footer.backToTop} <span aria-hidden="true">↑</span>
      </SmoothLink>
    </footer>
  );
}
