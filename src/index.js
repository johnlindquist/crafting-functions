import { createInterval } from "./broadcasters"

import React, { useState, useEffect } from "react"
import { render } from "react-dom"

let useBroadcaster = (broadcaster, deps = []) => {
  let [state, setState] = useState("Hi")
  useEffect(() => {
    broadcaster(setState)
  }, deps)

  return state
}

let App = () => {
  let state = useBroadcaster(createInterval(1000))
  return <div>{state}</div>
}

render(<App></App>, document.querySelector("#root"))
