import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      'dist/',
      'build/',
      '*.min.js',
      'public/',
      'coverage/',
      '*.config.js',
    ],
  },
];

export default eslintConfig;
