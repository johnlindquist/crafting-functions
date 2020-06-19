let createTimeout = (time) => (callback) => {
  let id = setTimeout(callback, time)

  return () => {
    clearTimeout(id)
  }
}

let oneSecond = createTimeout(1000)
let twoSeconds = createTimeout(2000)
let threeSeconds = createTimeout(3000)

let cancelOne = oneSecond(() => {
  console.log("one")
})

cancelOne()


let cancelTwo = twoSeconds(() => {
  console.log("two")
})

cancelTwo()

threeSeconds(() => {
  console.log("three")
})