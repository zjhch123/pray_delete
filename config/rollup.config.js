const eslint = require('rollup-plugin-eslint').eslint
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')

const path = require('path')

module.exports =  {
  input: 'index.js',
  output: {
    file: 'dist/pray.js',
    format: 'iife',
    name: 'pray'
  },
  plugins: [
    alias({
      resolve: ['.mjs', '.es6', '.js', '/index.js']
    }),
    eslint({
      include: [ path.join(__dirname, 'src', '**', '*.js') ]
    }),
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }]],
      runtimeHelpers: true,
      exclude: [
        './node_modules/**',
        '../node_modules/**',
      ],
    }),
  ]
}