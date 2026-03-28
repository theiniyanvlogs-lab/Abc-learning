import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        wiggleSlow: "wiggleSlow 2s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        wiggleSlow: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" }
        },
        pulseGlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" }
        }
      }
    }
  },
  plugins: []
};

export default config;
