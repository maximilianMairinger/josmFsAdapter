import josmFsAdapter from "../../app/src/josmFsAdapter"
//const testElem = document.querySelector("#test")
import { Data, DataBase } from "josm"
import clone from "circ-clone"
import inq from "./inq"

console.log("start");


(async () => {
  const store = await josmFsAdapter("test.json", {
    lel: "qew",
    lel2: () => inq("lel2"),
    lel3: () => inq("lel3")
  })

  console.log("log", clone(store()))
})()



// console.log(e.get(), init)

// setInterval(() => {
//   e.set(+new Date())
// }, 1000)
