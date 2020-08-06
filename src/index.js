let callback = event => {
  console.log("click")
}

let anotherFunction = fn => {
  fn()
  fn()
  fn()
}

anotherFunction(callback)
