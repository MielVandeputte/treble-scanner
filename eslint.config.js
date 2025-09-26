import tsParser from '@typescript-eslint/parser';
import tsEslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import unicornPlugin from 'eslint-plugin-unicorn';

export default defineConfig([
  globalIgnores(['**/dist', './vite.config.ts', './playwright.config.ts']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      typescript: tsEslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      unicorn: unicornPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefreshPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      ...importPlugin.configs.recommended.rules,
      ...unicornPlugin.configs.recommended.rules,

      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      eqeqeq: 'error',
      'no-param-reassign': 'error',

      'react/no-array-index-key': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/react-in-jsx-scope': 'off',

      'typescript/explicit-function-return-type': ['warn', { allowExpressions: true }],
      'typescript/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'warn',

      'import/no-cycle': 'error',
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], ['internal'], ['sibling', 'parent'], ['index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],

      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
    },
  },
]);
