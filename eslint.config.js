// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';   // Import plugins explicitly
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    plugins: {
      // Define plugins as an object (key: plugin name, value: imported plugin)
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    rules: {
      // Your rules here (e.g., 'react/jsx-uses-react': 'error')
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        React: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
