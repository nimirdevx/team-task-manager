import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#010102",
        surface: {
          1: "#0f1011",
          2: "#171513",
          3: "#18191a",
          4: "#191a1b",
        },
        ink: {
          DEFAULT: "#f7f8f8",
          muted: "#d0d6e0",
          subtle: "#8a8f98",
          tertiary: "#62666d",
        },
        hairline: {
          DEFAULT: "#23252a",
          strong: "#34343a",
          tertiary: "#3e3e44",
        },
        primary: {
          DEFAULT: "#5e6ad2",
          hover: "#828fff",
          focus: "#5e69d1",
        },
        onprimary: "#ffffff",
        success: "#27a644",
        inverse: {
          canvas: "#ffffff",
          ink: "#000000",
        },
        cream: {
          DEFAULT: "#f6f3ec",
          warm: "#efe9df",
          border: "#e0d9cf",
          muted: "#8a8479",
        },
        oncream: {
          DEFAULT: "#141413",
          muted: "#4a4744",
          subtle: "#6b6560",
        },
        /* Light shell — soft slate rail + page (no pure black chrome) */
        rail: {
          DEFAULT: "#e8e6e1",
          muted: "#ddd9d2",
          border: "#d0cbc2",
        },
        page: {
          DEFAULT: "#f3f1ec",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      fontSize: {
        headline: ["28px", { lineHeight: "1.2", letterSpacing: "-0.6px", fontWeight: "600" }],
        "card-title": ["22px", { lineHeight: "1.25", letterSpacing: "-0.4px", fontWeight: "500" }],
        body: ["16px", { lineHeight: "1.5", letterSpacing: "-0.05px" }],
        "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0" }],
        caption: ["12px", { lineHeight: "1.4", letterSpacing: "0" }],
      },
      boxShadow: {
        none: "0 0 #0000",
      },
      ringOffsetColor: {
        canvas: "#010102",
        "surface-1": "#0f1011",
        "surface-2": "#171513",
        cream: "#f6f3ec",
        rail: "#e8e6e1",
        page: "#f3f1ec",
      },
    },
  },
  plugins: [],
};

export default config;
