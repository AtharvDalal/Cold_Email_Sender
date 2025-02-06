import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [addVariablesForColors],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = theme("colors") as Record<string, any>;

  function flattenColors(colors: Record<string, any>, prefix = "") {
    return Object.entries(colors).reduce((acc, [key, value]) => {
      if (typeof value === "object") {
        Object.assign(acc, flattenColors(value, `${prefix}${key}-`));
      } else {
        acc[`--${prefix}${key}`] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  let newVars = flattenColors(allColors);

  addBase({
    ":root": newVars,
  });
}
