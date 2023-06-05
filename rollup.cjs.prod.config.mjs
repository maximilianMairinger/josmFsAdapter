import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'


export default {
  input: './app/src/josmFsAdapter.ts',
  output: {
    file: 'app/dist/cjs/josmFsAdapter.js',
    format: 'cjs',
    sourcemap: false
  },
  plugins: [
    typescript({tsconfig: "./tsconfig.cjs.json", noEmitOnError: false, sourceMap: false}), 
    resolve({modulesOnly: true, preferBuiltins: true}),
    commonJS({
      include: 'node_modules/**'
    }),
    json()
  ]
};
