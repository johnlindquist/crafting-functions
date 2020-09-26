import React from "react"
import { render } from "react-dom"

//`https://random-word-api.herokuapp.com/word`

import { pipe, head } from "lodash/fp"
import {
  combine,
  getURL,
  useBroadcaster,
  useListener,
} from "./broadcasters"
import { map, share, targetValue } from "./operators"

let getWord = pipe(
  map(head),
  share()
)(getURL(`https://random-word-api.herokuapp.com/word`))

let App = () => {
  let onInput = useListener()

  let word = useBroadcaster(getWord)

  let gameBroadcaster = combine(
    targetValue(onInput),
    getWord
  )

  let game = useBroadcaster(gameBroadcaster)

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{word}</p>
      <p>{JSON.stringify(game)}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
