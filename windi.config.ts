import { defineConfig } from "windicss/helpers";

export default defineConfig({
  darkMode: "class",

  extract: {
    include: ["**/*.{tsx,css}"],
    exclude: ["node_modules", ".git", ".next"],
  },
});
