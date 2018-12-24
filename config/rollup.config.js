const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint').eslint
const alias = require('rollup-plugin-alias')
const autoprefixer = require('autoprefixer')
const babel = require('rollup-plugin-babel')

const path = require('path')
const paths = require('../scripts/paths')

module.exports = function (_params) {
  return {
    input: _params,
    output: {
      format: 'umd',
      name: 'pray'
    },
    allowRealFiles: true,
    plugins: [
      alias({
        resolve: ['.mjs', '.es6', '.js', '/index.js'],
        '@src': paths.srcDir,
      }),
      resolve({
        module: true,
        jsnext: true,
        main: true,
        browser: true,
        extensions: ['.mjs', '.es6', '.js'],
      }),
      commonjs({
        include: 'node_modules/**',
        exclude: [],
      }),
      eslint({
        include: [ path.join(paths.srcDir, '**', '*.js') ]
      }),
      babel({
        runtimeHelpers: true,
        exclude: [
          './node_modules/**',
          '../node_modules/**',
        ],
      }),
    ]
  }
}