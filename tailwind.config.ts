import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16211f",
        field: "#f6f3ec",
        moss: "#49685a",
        clay: "#bb7356",
        tide: "#3d7587",
        gold: "#d4a83f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(22, 33, 31, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
