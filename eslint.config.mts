import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import path from "path";

const rootDir = import.meta.dirname;

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {...globals.browser, ...globals.node},
    } 
  },
  {
    files: ["apps/frontend-mvc/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.join(rootDir, "apps/frontend-mvc"),
      },
    },
  },
  {
    files: ["apps/frontend-mvp/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.join(rootDir, "apps/frontend-mvp"),
      },
    },
  },
  {
    files: ["apps/frontend-mvvm/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.join(rootDir, "apps/frontend-mvvm"),
      },
    },
  },
  {
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: rootDir,
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
