import { toLower, compose, pipe } from "lodash/fp"
import { zip, createInterval, forOf, done } from "./broadcasters"
import { map, modify, filter } from "./operators"

let operators = pipe(
  map(x => x[1]),
  filter(x => x != ","),
  modify,
  map(toLower),
)

let myZip = (broadcaster1, broadcaster2) => (...operators) => {
  return pipe(...operators)(zip(broadcaster1, broadcaster2))
}

let typeGreeting = operators(zip(
  createInterval(100),
  forOf("My Zip")
))

let cancelTypeGreeting = typeGreeting(value => {
  if (value === done) {
    console.log("Shutting down")
    return
  }

  console.log(value)
})

// cancelTypeGreeting()
