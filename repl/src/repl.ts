import josmFsAdapter from "../../app/src/josmFsAdapter"
//const testElem = document.querySelector("#test")
import { Data } from "josm"

console.log("start")


let d = new Data(3)
const init = josmFsAdapter("test3.js", d).then((e) => {
  console.log(e)
  d.set(e)

})



// console.log(e.get(), init)

// setInterval(() => {
//   e.set(+new Date())
// }, 1000)
