import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout,
} from "./broadcasters"
import { mapSequence, hardCode } from "./operators"

let message = "Hi, my name is John!".split(" ")
let delayMessage = value =>
  hardCode(value)(createTimeout(500))

let broadcaster = mapSequence(delayMessage)(forOf(message))

let App = () => {
  let onInput = useListener()
  let state = useBroadcaster(broadcaster)

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{state}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
