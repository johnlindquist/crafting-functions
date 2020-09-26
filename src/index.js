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
  filter,
  map,
  share,
  targetValue,
} from "./operators"

let getWord = pipe(
  map(head),
  share()
)(getURL(`https://random-word-api.herokuapp.com/word`))

let gameLogic = pipe(
  filter(every(isString)),
  map(([guess, word]) =>
    Array.from(word)
      .map(letter =>
        guess.includes(letter) ? letter : "*"
      )
      .join("")
  )
)

let App = () => {
  let onInput = useListener()

  let word = useBroadcaster(getWord)

  let gameBroadcaster = gameLogic(
    combine(targetValue(onInput), getWord)
  )

  let game = useBroadcaster(gameBroadcaster, "")

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{word}</p>
      <p>{game}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
