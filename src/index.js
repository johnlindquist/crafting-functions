import { addListener, forOf, done } from "./broadcasters"
import {
  map,
  targetValue,
  applyOperator,
  stringConcat,
  filter,
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

let doneCondition = condition => broadcaster => listener => {
  let cancel = filter(condition)(broadcaster)(value => {
    listener(done)
    cancel()
  })

  return cancel
}

let mapDone = doneValue => broadcaster => listener => {
  broadcaster(value => {
    if (value === done) {
      listener(doneValue)
    } else {
      listener(value)
    }
  })
}

let winPipe = pipe(
  doneCondition(string => !string.includes("*")),
  mapDone("You win!")
)

let play = hangman(inputValue)
let win = winPipe(play)

let cancelWhen = cancelBroadcaster => broadcaster => listener => {
  let cancel = broadcaster(listener)

  let cancel2 = cancelBroadcaster(value => {
    cancel()
  })

  return () => {
    cancel()
    cancel2()
  }
}

let rules = pipe(cancelWhen(win))
let playWithWin = rules(play)

playWithWin(console.log)
win(console.log)
