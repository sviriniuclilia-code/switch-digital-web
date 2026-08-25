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
  title: "Switch Digital — Tehnologia care îți optimizează afacerea",
  description:
    "Consultanță și implementare de soluții digitale accesibile pentru afaceri. Identificăm instrumentele potrivite și le folosim la maximum, cu costuri minime.",
  metadataBase: new URL("https://switchdigital.md"),
  openGraph: {
    title: "Switch Digital",
    description: "Tehnologia care îți optimizează afacerea.",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
