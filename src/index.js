import { pipe, compose } from "lodash/fp"

let i = 0
let callback = event => {
  return i++
}

let multiply = value => {
  console.log(value * 2)
}

let twos = pipe(callback, multiply)

twos()
twos()
twos()
