

let createTimeout = (time) => (callback) => {
  setTimeout(callback, time)
}

let oneSecond = createTimeout(1000)
let twoSeconds = createTimeout(2000)
let threeSeconds = createTimeout(3000)

oneSecond(() => {
  console.log("one")
})
twoSeconds(() => {
  console.log("two")
})
threeSeconds(() => {
  console.log("three")
})