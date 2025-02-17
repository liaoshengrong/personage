import type { Config } from "tailwindcss";
const BASE = 16;
const rem = (px: number) => `${px / BASE}rem`;

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        en: ["Enfont"],
      },
      fontWeight: {
        100: "100",
        200: "200",
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
        900: "900",
      },
      fontSize: {
        xss: rem(10),
        lg: rem(18),
      },
    },
  },
  plugins: [],
} satisfies Config;
