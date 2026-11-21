import type { SVGProps } from "react";

export function Star({
  className = "icon-star",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 0l2.6 8.4L23.4 6l-6.2 6 6.2 6-8.8-2.4L12 24l-2.6-8.4L.6 18l6.2-6L.6 6l8.8 2.4z" />
    </svg>
  );
}
