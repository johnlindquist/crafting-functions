import React, { useState } from "react"
import { render } from "react-dom"
import {
  useBroadcaster,
  createInterval,
} from "./broadcasters"

let Timer = () => {
  let timer = useBroadcaster(createInterval(500))

  return <div>{timer}</div>
}

let App = () => {
  let [showTimer, setShowTimer] = useState(true)
  return (
    <div>
      <button onClick={event => setShowTimer(!showTimer)}>
        Toggle Timer
      </button>
      {showTimer && <Timer></Timer>}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
