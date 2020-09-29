import React from "react"
import { render } from "react-dom"

//`https://random-word-api.herokuapp.com/word`

import { pipe, head, every, isString } from "lodash/fp"
import {
  combine,
  getURL,
  useBroadcaster,
  useListener,
} from "./broadcasters"
import {
  doneIf,
  filter,
  map,
  mapBroadcaster,
  repeat,
  share,
  targetValue,
} from "./operators"

let getWord = pipe(
  map(head),
  share()
)(getURL(`https://random-word-api.herokuapp.com/word`))

let thenCombine = secondBroadcaster => {
  return mapBroadcaster(firstValue =>
    map(secondValue => [firstValue, secondValue])(
      secondBroadcaster
    )
  )
}

let gameLogic = pipe(
  filter(every(isString)),
  map(([word, guess]) =>
    Array.from(word)
      .map(letter =>
        guess.includes(letter) ? letter : "*"
      )
      .join("")
  ),
  doneIf(guess => guess && !guess.includes("*")),
  repeat
)

let init = value => broadcaster => listener => {
  listener(value)
  return broadcaster(listener)
}

let guessPipe = pipe(targetValue, init(""))

let App = () => {
  let onInput = useListener()

  let word = useBroadcaster(getWord)
  let guessBroadcaster = guessPipe(onInput)
  let guess = useBroadcaster(guessBroadcaster, "")

  let gameBroadcaster = gameLogic(
    thenCombine(guessBroadcaster)(getWord)
  )

  let game = useBroadcaster(gameBroadcaster, "")

  return (
    <div>
      <input type="text" onChange={onInput} value={guess} />
      <p>{word}</p>
      <p>{game}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
