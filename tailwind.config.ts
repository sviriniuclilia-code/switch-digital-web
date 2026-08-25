import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        ink2: "#1e293b",
        cyan: { DEFAULT: "#06b6d4", dark: "#0891b2", light: "#22d3ee" },
        muted: "#64748b",
        muted2: "#94a3b8",
        ground: "#f6f8fb",
        line: "#e2e8f0",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
