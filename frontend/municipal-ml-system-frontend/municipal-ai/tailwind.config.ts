import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0A0B0F",
          900: "#10121A",
          800: "#181C27",
          700: "#222738",
          600: "#2E3448",
        },
        civic: {
          blue: "#3B82F6",
          cyan: "#06B6D4",
          accent: "#38BDF8",
        },
        priority: {
          high: "#EF4444",
          medium: "#F97316",
          low: "#22C55E",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
