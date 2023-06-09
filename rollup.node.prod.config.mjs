import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/josmFsAdapter.ts',
  output: {
    file: 'dist/cjs/josmFsAdapter.js',
    format: 'cjs'
  },
})