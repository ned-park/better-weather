import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        tableclamp: "clamp(0.75rem, 2vw, 1.25rem)",
      },
    },
  },
  plugins: [],
} satisfies Config;
