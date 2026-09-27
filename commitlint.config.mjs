// Convención de commits del proyecto (documento de metodología, sección 3):
//   <tipo>(<scope>): <descripción en inglés>
//   scope = itNNhXX (iteración y historia) o itNN (trabajo de la iteración sin historia)
export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'scope-iteracion-historia': ({ scope }) => [
          /^it\d{2}(h\d{2})?$/.test(scope ?? ''),
          'el scope debe ser itNNhXX (p. ej. it01h02) o itNN (p. ej. it00)',
        ],
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', ['test', 'feat', 'refactor', 'fix', 'chore', 'docs', 'ci']],
    'scope-empty': [2, 'never'],
    'scope-iteracion-historia': [2, 'always'],
    'subject-case': [0],
  },
};
