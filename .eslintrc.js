// .eslintrc.cjs (Utilisation de cjs pour les configs en Node.js)
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended' // Doit être la dernière extension
    ],
    env: {
        node: true,
        es2021: true
    },
    rules: {
        'prettier/prettier': 'error', // Fait de Prettier une erreur de linting
    }
};