import React from "react"
import { render } from "react-dom"

import { useBroadcaster, useListener } from "./broadcasters"
import { targetValue } from "./operators"

let App = () => {
  let onInput = useListener()
  let state = useBroadcaster(targetValue(onInput))

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{state}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
