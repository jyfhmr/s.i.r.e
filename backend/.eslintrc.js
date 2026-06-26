module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'], // Añadimos prettier
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Conecta prettier con eslint
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 'error', // Si el formato está mal, es un error
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Aquí subimos los estándares empresariales:
    '@typescript-eslint/no-explicit-any': 'warn', // Te avisa si usas 'any', no lo bloquea pero te hace sentir culpable xd
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }], // Bloquea código basura, ignora variables que empiecen con _
    'no-console': ['warn', { 'allow': ['warn', 'error'] }], // En backend se usa el Logger, no console.log
  },
};