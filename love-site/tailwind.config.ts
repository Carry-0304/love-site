import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          soft: "#FFE4E1",
          warm: "#FFF0F5",
          dried: "#C48B8B",
          peach: "#FFDAB9",
          deep: "#B56576",
        },
      },
      fontFamily: {
        script: ["var(--font-script)", "'Dancing Script'", "cursive"],
        sans: ["var(--font-sans)", "'Noto Sans SC'", "sans-serif"],
        serif: ["var(--font-serif)", "'Noto Serif SC'", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "fall": "fall linear infinite",
        "heartbeat": "heartbeat 1.2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0.3" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.15)" },
          "70%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 182, 193, 0.3), 0 0 10px rgba(255, 182, 193, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 182, 193, 0.6), 0 0 40px rgba(255, 182, 193, 0.4)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;