import josmFsAdapter from "../../app/src/josmFsAdapter"
//const testElem = document.querySelector("#test")
import { Data } from "josm"

console.log("start")

const e = new Data()

const init = josmFsAdapter("test.js", e)


console.log(e.get(), init)

setInterval(() => {
  e.set(+new Date())
}, 1000)
