import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette matching the Logo
        cream: "#F9F7F3",
        terracotta: { // Mapped to the Logo's elegant Taupe-Bronze text
          DEFAULT: "#A69279",
          50: "#F8F6F4",
          100: "#EBE6DE",
          200: "#D6CAB8",
          300: "#C0AF92",
          400: "#B39D7A",
          500: "#A69279",
          600: "#89765D",
          700: "#6B5B42",
          800: "#4D4028",
          900: "#2F2512",
        },
        mustard: { // Mapped to the Logo's softer Golden Leaf
          DEFAULT: "#D4A351",
          50: "#FDFBEF",
          100: "#F9F0C9",
          200: "#EED789",
          300: "#E3BE4A",
          400: "#DCAE3A",
          500: "#D4A351",
          600: "#B4883E",
          700: "#936C2B",
          800: "#714F18",
          900: "#4F3305",
        },
        ink: { // Real Espresso for maximum contrast over Gold
          DEFAULT: "#4A3F35",
          50: "#F3F1EF",
          100: "#DFD9D3",
          200: "#BBAE9F",
          300: "#97836A",
          400: "#7B6651",
          500: "#4A3F35",
          600: "#3D3228",
          700: "#2F251B",
          800: "#221910",
          900: "#140D05",
        },
        // ShadCN HSL tokens (mapped via CSS vars)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
