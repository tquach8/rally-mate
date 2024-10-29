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
        tertiary: {
          DEFAULT: '#f8f2f2', 100: '#402222', 200: '#7f4545', 300: '#b37272', 400: '#d6b2b2', 500: '#f8f2f2', 600: '#f9f4f4', 700: '#fbf7f7', 800: '#fcfafa', 900: '#fefcfc'
        },
        primary: {
          DEFAULT: '#87d68d', 100: '#123415', 200: '#236729', 300: '#359b3e', 400: '#52c45b', 500: '#87d68d', 600: '#9edea3', 700: '#b6e6ba', 800: '#ceeed1', 900: '#e7f7e8'
        },
        secondary: {
          DEFAULT: '#f2c078', 100: '#422907', 200: '#84520d', 300: '#c67b14', 400: '#eba037', 500: '#f2c078', 600: '#f4cc93', 700: '#f7d9ae', 800: '#fae5c9', 900: '#fcf2e4' 
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
