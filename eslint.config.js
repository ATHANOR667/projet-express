// eslint.config.js (Nouveau format 'Flat Config')
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    files: ['**/*.{js,ts}'],
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      globals: globals.node,
    },
    // Règles de base pour JS/TS
    extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Règle Prettier pour forcer le formatage lors du linting
      'prettier/prettier': 'error',
      //  (variable inutilisée)
      '@typescript-eslint/no-unused-vars': 'error',

      // "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Doit être en dernier pour s'assurer que Prettier est la source de vérité pour le style
  prettierConfig,
);
