// Vitest/Vite loads this file during unit tests; Tailwind v4 PostCSS shape is not a classic plugin there.
const isVitest = process.env.VITEST === "true";

const config = {
  plugins: isVitest ? [] : ["@tailwindcss/postcss"],
};

export default config;
