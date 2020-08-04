import React from "react"
import { render } from "react-dom"
import {
  useBroadcaster,
  useListener,
  forOf,
} from "./broadcasters"
import {
  targetValue,
  mapBroadcaster,
  stringConcat,
  map,
} from "./operators"

import { pipe } from "lodash/fp"

let game = pipe(
  mapBroadcaster(value => {
    return map(letter =>
      value.includes(letter) ? letter : "*"
    )(forOf("honeycomb"))
  }),
  stringConcat
)

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)
  let result = useBroadcaster(game(inputValue), "")
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{result}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
