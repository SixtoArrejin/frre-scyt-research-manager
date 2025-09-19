import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default [
  // Configuración base para todos los .js/.mjs
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // habilitar jsx globalmente
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Backend (Node.js)
  {
    files: ['scyt-api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // permitir console.log en el back
    },
  },

  // Frontend (React)
  {
    files: ['scyt-web/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      semi: ['error', 'always'],
      'no-console': 'off',
      
      // Reglas de espaciado y formato
      'object-curly-spacing': ['error', 'always'], // { foo } en lugar de {foo}
      'array-bracket-spacing': ['error', 'never'], // [foo] en lugar de [ foo ]
      'computed-property-spacing': ['error', 'never'], // obj[key] en lugar de obj[ key ]
      'space-before-function-paren': ['error', 'never'], // function() en lugar de function ()
      'space-in-parens': ['error', 'never'], // (foo) en lugar de ( foo )
      'space-infix-ops': 'error', // a + b en lugar de a+b
      'space-unary-ops': 'error', // ++foo en lugar de ++ foo
      'keyword-spacing': 'error', // if (condition) en lugar de if(condition)
      'comma-spacing': ['error', { before: false, after: true }], // a, b en lugar de a,b
      'brace-style': ['error', '1tbs', { allowSingleLine: true }], // { } estilo consistente
      'indent': ['error', 2], // Indentación de 2 espacios
      'no-trailing-spaces': 'error', // Sin espacios al final de las líneas
      'eol-last': 'error', // Línea vacía al final del archivo
      
      'no-unused-vars': 'off', // Desactivar la regla nativa
      'unused-imports/no-unused-imports': 'error', // Eliminar imports no usados automáticamente
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/no-unescaped-entities': 'off', // Permitir comillas y entidades sin escapar en JSX
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Ignorar directorios
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'database/**',
      '**/.git/**',
      'scyt-web/public/**',
    ],
  },
];
