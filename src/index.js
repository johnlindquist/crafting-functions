import React from "react"
import { render } from "react-dom"

import { pipe, head, every, isString } from "lodash/fp"
import {
  getURL,
  useBroadcaster,
  useListener,
} from "./broadcasters"
import {
  filter,
  map,
  targetValue,
  init,
  log,
  thenCombine,
  repeatIf,
} from "./operators"

let getWord = pipe(map(head))(
  getURL(`https://random-word-api.herokuapp.com/word`)
)

let repeatLogic = ([word, guess]) =>
  Array.from(word).every(letter => guess.includes(letter))

let gameLogic = pipe(
  filter(every(isString)),
  log,
  repeatIf(repeatLogic)
)

let guessPipe = pipe(targetValue, init(""))

let App = () => {
  let onInput = useListener()

  let guessBroadcaster = guessPipe(onInput)

  let gameBroadcaster = gameLogic(
    thenCombine(guessBroadcaster)(getWord)
  )

  let [word, guess] = useBroadcaster(gameBroadcaster, [
    "",
    "",
  ])

  return (
    <div>
      <input type="text" onChange={onInput} value={guess} />
      <p>{word}</p>
      <p>
        {Array.from(word)
          .map(letter =>
            guess.includes(letter) ? letter : "*"
          )
          .join("")}
      </p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
