import React from "react"
import { render } from "react-dom"
import {
  useBroadcaster,
  useListener,
  getURL,
  forOf,
} from "./broadcasters"
import {
  targetValue,
  map,
  filter,
  mapBroadcaster,
  stringConcat,
} from "./operators"

import { pipe } from "lodash/fp"

let App = () => {
  let onInput = useListener()

  let word = useBroadcaster(
    map(([word]) => word)(
      getURL(`https://random-word-api.herokuapp.com/word`)
    ),
    ""
  )

  let gameLogic = inputValue =>
    map(letter =>
      inputValue.includes(letter) ? letter : "*"
    )(forOf(word))

  let guessBroadcaster = pipe(
    filter(() => word),
    targetValue,
    mapBroadcaster(gameLogic),
    stringConcat
  )(onInput)

  let guess = useBroadcaster(guessBroadcaster, "", [word])

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{word}</p>
      <p>{guess}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
