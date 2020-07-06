import {
  addListener,
  forOf,
  done,
  merge,
} from "./broadcasters"
import {
  map,
  targetValue,
  applyOperator,
  stringConcat,
  cancelWhen,
  doneCondition,
  mapDone,
  filter,
} from "./operators"
import { pipe, last } from "lodash/fp"

let share = () => {
  let listeners = []
  let cancel
  return broadcaster => listener => {
    if (!listeners.length) {
      cancel = broadcaster(value => {
        listeners.forEach(listener => listener(value))
      })
    }
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(
        list => list !== listener
      )
      if (!listeners.length) cancel()
    }
  }
}

let inputValue = pipe(
  targetValue
  // share()
)(addListener("#input", "input"))

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
  // share()
)
let play = hangman(inputValue)

let winPipe = pipe(
  doneCondition(string => !string.includes("*")),
  mapDone("You win!")
)
let win = winPipe(play)

let find = broadcaster => listener => {
  let cancel = broadcaster(value => {
    let found = false
    word(letter => {
      if (letter === done) {
        listener(found)
        found = false
        return
      }
      if (value === letter) {
        found = true
      }
    })
  })
  return () => {
    console.log("cancel on find")
    cancel()
  }
}

let trackScore = broadcaster => listener => {
  let score = 5
  return broadcaster(value => {
    // console.log({ value })
    if (!value) score--
    listener(score)
  })
}

let scorePipe = pipe(
  //get current letter
  map(last),
  //check for letter in word
  find,
  //-1 from score
  trackScore
  // share()
)

let losePipe = pipe(
  doneCondition(value => value === 0),
  mapDone("You lose!")
)

let score = scorePipe(inputValue)
let lose = losePipe(score)

let rules = cancelWhen(merge(win, lose))

// win(console.log)
// lose(console.log)
rules(score)(console.log)
rules(play)(console.log)
