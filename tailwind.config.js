/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "sans-serif",
        ],
        logo: [
          "'Rethink Sans'",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "display-lg": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "display-sm": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Sage Green as brand color
        sage: {
          50: "#f4f6f2",
          100: "#e9efe4",
          200: "#cfe0c3",
          300: "#b3cda0",
          400: "#96b87e",
          500: "#7ba55f",
          600: "#62864b",
          700: "#4c683a",
          800: "#384c2b",
          900: "#26321d",
        },
        // Neutral grays for professional look
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          150: "#f0f0f0",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.06)",
        "filter": "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "screen-3xl": "1920px",
        "screen-4xl": "2560px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
