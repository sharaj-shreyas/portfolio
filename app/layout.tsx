import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Pirata_One,
  Source_Serif_4,
} from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { site, ui } from "@/content/data";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-source-serif",
});

const pirata = Pirata_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pirata",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Sharaj Shreyas",
    "IIT Gandhinagar",
    "Civil Engineering",
    "robotics",
    "hardware",
    "CAD",
    "prototyping",
    "battlebots",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/assets/sharaj-shreyas.jpg",
        width: 359,
        height: 478,
        alt: "Sharaj Shreyas",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
    images: ["/assets/sharaj-shreyas.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e2dedb",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${sourceSerif.variable} ${pirata.variable}`}
    >
      <body>
        <Providers>
          <a className="skip-link" href="#main">
            {ui.skipToContent}
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
