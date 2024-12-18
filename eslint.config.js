import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import nodePlugin from "eslint-plugin-node";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        console: "readonly",
      },
    },
  },
  {
    ignores: [
      "**/coverage",
      "**/*.snap",
      "**/fixtures",
      "**/assets/**",
      "**/*.d.ts",
      "**/dist/",
      "**/build/",
      "**/node_modules/",
      "**/.turbo/",
      "**/.next/",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-undef": "error",
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["/packages/**/*.ts", "/packages/**/*.js"],
    plugins: {
      node: nodePlugin,
    },
    rules: {
      "node/no-unsupported-features/node-builtins": ["error", { version: ">=18.0.0" }],
      "node/no-missing-import": "off",
      "no-console": "off",
    },
  },
  {
    ...prettierConfig,
    rules: {
      ...prettierConfig.rules,
      "max-len": ["error", { code: 120, ignoreComments: true }],
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info", "debug", "log"],
        },
      ],
      "no-undef": "error",
    },
  },
];
