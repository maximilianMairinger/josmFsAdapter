import josmFsAdapter from "../../app/src/josmFsAdapter"
//const testElem = document.querySelector("#test")

console.log("start")

const e = josmFsAdapter("test.js", {lel: 2})

setInterval(() => {
  e({lol: +new Date()})
}, 1000)
