import React from "react"
import { render } from "react-dom"
import {
  and,
  useBroadcaster,
  useListener,
  getURL,
} from "./broadcasters"
import {
  targetValue,
  map,
  filter,
  share,
  log,
} from "./operators"

import { every, isString, pipe, head } from "lodash/fp"

let wordBroadcaster = pipe(
  map(head),
  log,
  share()
)(getURL(`https://random-word-api.herokuapp.com/word`))

let gameCondition = ([guess, word]) => {
  return Array.from(word)
    .map(letter => (guess.includes(letter) ? letter : "*"))
    .join("")
}
let gameLogic = pipe(
  filter(every(isString)),
  map(gameCondition)
)

let App = () => {
  let onInput = useListener()

  let guessBroadcaster = targetValue(onInput)
  let game = and(guessBroadcaster, wordBroadcaster)

  let word = useBroadcaster(wordBroadcaster)
  let guess = useBroadcaster(gameLogic(game))

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{word}</p>
      <p>{guess}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
