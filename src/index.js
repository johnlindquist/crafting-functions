import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  merge,
} from "./broadcasters"
import {
  targetValue,
  map,
  state,
  hardCode,
} from "./operators"
import { pipe } from "lodash/fp"

let inc = hardCode(value => ++value)
let dec = hardCode(value => --value)

let App = () => {
  let onPlus = useListener()
  let onMinus = useListener()

  let onInc = inc(onPlus)
  let onDec = dec(onMinus)
  let broadcaster = state(0)(merge(onInc, onDec))

  let value = useBroadcaster(broadcaster)

  return (
    <div>
      <button onClick={onPlus}>+</button>
      <button onClick={onMinus}>-</button>
      {value}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
