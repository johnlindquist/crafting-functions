import React from "react"
import { render } from "react-dom"
import {
  useBroadcaster,
  useListener,
  forOf,
  getURL,
} from "./broadcasters"
import {
  targetValue,
  mapBroadcaster,
  stringConcat,
  map,
  shareFirst,
} from "./operators"

import { pipe } from "lodash/fp"

let word = shareFirst()(
  map(([word]) => word)(
    getURL(`https://random-word-api.herokuapp.com/word`)
  )
)

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)

  let game = pipe(
    mapBroadcaster(word => {
      return mapBroadcaster(value => {
        return map(letter =>
          value.includes(letter) ? letter : "*"
        )(forOf(word))
      })(inputValue)
    }),
    stringConcat
  )

  let result = useBroadcaster(game(word), "")
  let randomWord = useBroadcaster(word)
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{result}</p>
      <p>{randomWord}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
