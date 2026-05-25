import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gochujang: "#b3261e",
        ssamjang: "#f2b705",
        "soy-sauce": "#1f1510",
      },
    },
  },
  plugins: [],
};

export default config;
