import josmFsAdapter from "../../app/src/josmFsAdapter"
//const testElem = document.querySelector("#test")
import { Data, DataBase } from "josm"
import clone from "circ-clone"


console.log("start")


let d = new DataBase({lel: 2})

const init = josmFsAdapter("test3.json", d).then((e) => {
  console.log("log", e)
  
  d({lel: undefined})
})



// console.log(e.get(), init)

// setInterval(() => {
//   e.set(+new Date())
// }, 1000)
