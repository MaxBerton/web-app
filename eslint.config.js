// eslint.config.js
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import prettierConfig from "eslint-config-prettier"

export default [
  { ignores: ["dist", "node_modules", "eslint.config.js"] },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  prettierConfig,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React hooks
      ...reactHooks.configs.recommended.rules,

      // Vite HMR (évite des exports qui cassent le refresh)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Strict TS
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },
]
