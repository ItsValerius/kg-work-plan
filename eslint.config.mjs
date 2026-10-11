import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import drizzle from "eslint-plugin-drizzle";

// A delete or update without .where() would hit every row of the table.
const drizzleObjects = { drizzleObjectName: ["db", "tx"] };

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { drizzle },
    rules: {
      "drizzle/enforce-delete-with-where": ["error", drizzleObjects],
      "drizzle/enforce-update-with-where": ["error", drizzleObjects],
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
