import { toLower } from "lodash"
import { zip, createInterval, forOf, done } from "./broadcasters"
import { map, modify, filter } from "./operators"


let typeGreeting = map(toLower, modify(filter(x => x != ",", map(x => x[1], zip(
  createInterval(100),
  forOf("Hello, John")
)))))

let cancelTypeGreeting = typeGreeting(value => {
  if (value === done) {
    console.log("Shutting down")
    return
  }

  console.log(value)
})

// cancelTypeGreeting()
