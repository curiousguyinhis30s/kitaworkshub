import { Inter, Space_Grotesk } from "next/font/google";

/**
 * Body Font: Inter
 * Clean, modern, highly readable for all body text and UI
 */
export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

/**
 * Display Font: Space Grotesk
 * Distinctive, modern headlines with character
 */
export const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const fonts = {
  body: bodyFont.variable,
  display: displayFont.variable,
};
