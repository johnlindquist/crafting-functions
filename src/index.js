import { addListener, forOf, done } from "./broadcasters"
import { map, targetValue } from "./operators"
import { pipe } from "lodash/fp"

let inputValue = targetValue(addListener("#input", "input"))

let word = forOf("honeycomb")

let mapBroadcaster = (createBroadcaster) => (
  broadcaster
) => (listener) => {
  return broadcaster((value) => {
    let newBroadcaster = createBroadcaster(value)
    newBroadcaster(listener)
  })
}

let applyOperator = (broadcaster) =>
  mapBroadcaster((operator) => operator(broadcaster))

let stringConcat = (broadcaster) => (listener) => {
  let result = ""
  return broadcaster((value) => {
    if (value === done) {
      listener(result)
      result = ""
      return
    }
    result += value
  })
}

let hangmanLogic = (value) => {
  return map((letter) =>
    value.includes(letter) ? letter : "*"
  )
}

let hangman = pipe(
  map(hangmanLogic),
  applyOperator(word),
  stringConcat
)

hangman(inputValue)(console.log)
