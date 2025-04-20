import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  globalIgnores(['**/dist', './vite.config.ts']),

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
      typescript: tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      import: importPlugin,
      unicorn: eslintPluginUnicorn,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      ...eslintPluginUnicorn.configs.recommended.rules,

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
    },
  },
]);
