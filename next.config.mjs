/** @type {import('next').NextConfig} */

// next dev  → NODE_ENV = "development"
// next build / next start → NODE_ENV = "production"
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // Next.js foloseşte eval() în modul dezvoltare, pentru Fast Refresh.
  // În producţie rămâne fără 'unsafe-eval', exact ca până acum.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self'",
  // Reîmprospătarea automată din dezvoltare merge pe websocket.
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};
export default nextConfig;