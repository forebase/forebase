import antfu, { GLOB_SRC } from "@antfu/eslint-config";

export default antfu(
  {
    react: true,
    vue: true,
    // Disable tests rules because we need to test with various setup
    test: false,
    // This replaces the old `.gitignore`
    ignores: [
      "**/dist/",
      "**/forebase-dist/",
      "**/coverage",
      "**/*.snap",
      "**/fixtures",
      "**/assets/**",
      "**/*.d.ts",
    ],
  },
  {
    rules: {
      // prefer global Buffer to not initialize the whole module
      "node/prefer-global/buffer": "off",
      "node/prefer-global/process": "off",
      "no-empty-pattern": "off",
      "antfu/indent-binary-ops": "off",
      "unused-imports/no-unused-imports": "error",
      "style/member-delimiter-style": [
        "error",
        {
          multiline: { delimiter: "none" },
          singleline: { delimiter: "semi" },
        },
      ],
      // let TypeScript handle this
      "no-undef": "off",
      "ts/no-invalid-this": "off",
      "eslint-comments/no-unlimited-disable": "off",
      curly: ["error", "all"],

      // TODO: migrate and turn it back on
      "ts/ban-types": "off",
      "ts/no-unsafe-function-type": "off",

      "no-restricted-imports": [
        "error",
        {
          paths: ["path"],
        },
      ],

      "import/no-named-as-default": "off",
    },
  },
  {
    files: [`packages/**/*.{jsx,tsx}`],
    rules: {
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".tsx", ".jsx"] },
      ],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
  {
    files: [`packages/**/*.{vue}`],
    rules: {
      "vue/valid-template-root": "error",
      "vue/no-unused-vars": "error",
    },
  },
);
