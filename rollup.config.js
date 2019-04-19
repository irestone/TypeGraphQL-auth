import _ from 'lodash'

import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import ts from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const base = {
  input: 'src/index.ts',
  output: { format: 'cjs' },
  plugins: [resolve(), cjs(), ts(), babel({ exclude: 'node_modules/**' })],
  external: Object.keys(pkg.dependencies),
  watch: { clearScreen: true },
}

const createConfig = (env) => {
  if (!env) throw new Error('Build environment has not been set.')

  const config = _.cloneDeep(base)

  switch (env) {
    case 'development':
      config.output.file = 'build/index.js'
      break
    case 'production':
      config.output.file = 'dist/index.js'
      config.plugins.push(terser())
      break
    default:
      throw new Error(`Invalid build environment: "${env}"`)
  }

  return config
}

export default createConfig(process.env.BUILD_ENV)
