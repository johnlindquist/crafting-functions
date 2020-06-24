import { curry } from "lodash"
import { zip, createInterval, forOf, done } from "./broadcasters"

let modify = curry((broadcaster, listener) => {
  let string = ""

  return broadcaster(value => {
    if (value === done) {
      listener(done)
      return
    }

    listener(string += value[1])
  })
})

let typeGreeting = modify(zip(
  createInterval(100),
  forOf("Hello, John")
))

let cancelTypeGreeting = typeGreeting(value => {
  if (value === done) {
    console.log("Shutting down")
    return
  }

  console.log(value)
})

// cancelTypeGreeting()
