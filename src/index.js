import { pipe, compose } from "lodash/fp"

let i = 0
let callback = event => {
  return i++
}

let multiply = value => {
  console.log(value * 2)
}

let twosCallback = pipe(callback, multiply)

twosCallback()
twosCallback()
twosCallback()

document.addEventListener("click", twosCallback)
