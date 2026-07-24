import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "ui-sans-serif", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c0d0ff",
          400: "#6b8cff",
          500: "#4f6fff",
          600: "#3a54e0",
          700: "#2b3fb5",
          800: "#1e2d8a",
          900: "#111d5e"
        },
        ink: {
          50: "#f8fafc",
          100: "#eef2f6",
          200: "#d8e0e8",
          300: "#b0bdc8",
          400: "#8896a8",
          500: "#667085",
          600: "#475467",
          700: "#334155",
          800: "#1e293b",
          900: "#101828",
          950: "#070d17"
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.85)",
          dark: "rgba(18,24,36,0.85)"
        }
      },
      boxShadow: {
        soft: "0 4px 24px rgba(15, 23, 42, 0.08)",
        glow: "0 0 32px rgba(79, 111, 255, 0.25)",
        "glow-emerald": "0 0 32px rgba(16, 185, 129, 0.20)",
        card: "0 1px 4px rgba(15,23,42,0.06), 0 8px 32px rgba(15,23,42,0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(79, 111, 255, 0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(79, 111, 255, 0.5)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.4s ease forwards",
        "fade-in": "fade-in 0.3s ease forwards",
        "slide-in-left": "slide-in-left 0.3s ease forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2s ease infinite",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #4f6fff 0%, #7c3aed 100%)",
        "emerald-gradient": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "amber-gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "rose-gradient": "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
        "violet-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        "cyan-gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
      }
    }
  },
  plugins: []
};

export default config;
