import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Poppins self-hosted (fără dependență de Google Fonts la runtime).
const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://switchdigital.md"),
  // `template` se aplică paginilor viitoare (FAQ, blog): titlul lor + „· Switch Digital".
  // Paginile care vor titlu complet propriu folosesc `title: { absolute: "..." }`.
  title: {
    default: "Switch Digital — Tehnologia care îți optimizează afacerea",
    template: "%s · Switch Digital",
  },
  description:
    "Consultanță și implementare de soluții digitale accesibile pentru afaceri. Identificăm instrumentele potrivite și le folosim la maximum, cu costuri minime.",
  openGraph: {
    title: "Switch Digital",
    description: "Tehnologia care îți optimizează afacerea.",
    locale: "ro_RO",
    type: "website",
    siteName: "Switch Digital",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
