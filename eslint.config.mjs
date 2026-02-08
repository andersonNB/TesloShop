import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 🔧 Reglas propias (ligeras y útiles)
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // TS maneja esto mejor que ESLint base
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // 🔴 imports no usados
      "unused-imports/no-unused-imports": "error",

      // 🟡 warning, no molesta en dev
      "no-console": "warn",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
