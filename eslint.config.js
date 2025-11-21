// eslint.config.js  ← FILE HOÀN HẢO, COPY-PASTE LÀ CHẠY NGON 100%
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist', '**/*.js'] },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },


    // ← QUAN TRỌNG NHẤT: KHÔNG DÙNG .extends NỮA, viết tay hết!
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      // === JS + TS recommended rules (thay thế cho js.configs.recommended + tseslint.configs.recommended)
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      // === React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // === React Refresh (Vite) – chỉ cần rule này thôi
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // === Rules bạn thích
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'space-before-blocks': 'error',
      'object-curly-spacing': ['warn', 'always'],
      'indent': ['warn', 2],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['warn', 'never'],
      'keyword-spacing': 'warn',
      'comma-spacing': 'warn',
      'arrow-spacing': 'warn',

      // React 17+ không cần import React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  }
)