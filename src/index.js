import { toLower, compose, pipe } from "lodash/fp"
import { zip, createInterval, forOf, done } from "./broadcasters"
import { map, modify, filter, split, join } from "./operators"

let operators = pipe(
  map(x => x[1]),
  filter(x => x != ","),
  map(toLower),
  split(" "),
  join("")
)

let typeGreeting = operators(zip(
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
