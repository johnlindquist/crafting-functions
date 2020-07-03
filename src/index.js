import { addListener, forOf, done } from "./broadcasters"
import {
  map,
  targetValue,
  applyOperator,
  stringConcat,
} from "./operators"
import { pipe } from "lodash/fp"

let inputValue = targetValue(addListener("#input", "input"))

let word = forOf("honeycomb")

let hangmanLogic = value => {
  return map(letter =>
    value.includes(letter) ? letter : "*"
  )
}

let hangman = pipe(
  map(hangmanLogic),
  applyOperator(word),
  stringConcat
)

hangman(inputValue)(console.log)
