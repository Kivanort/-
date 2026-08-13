import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yandex: {
          red: "#FC3F1D",
          "red-bright": "#FF0000",
          "red-hover": "#E03518",
          "red-light": "#FFF0ED",
          dark: "#000000",
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E8E8E8",
            300: "#CCCCCC",
            400: "#999999",
            500: "#666666",
            600: "#333333",
          },
        },
      },
      fontFamily: {
        sans: [
          "YS Text",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 16px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.12)",
        header: "0 1px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
