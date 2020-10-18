module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  // parser: "@typescript-eslint/parser",
  // plugins: ["@typescript-eslint"],
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  },
  overrides: [
    {
      files: ["**/*.spec.ts"],
      env: {
        jest: true
      }
    }
  ]
};
