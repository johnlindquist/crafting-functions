import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout,
} from "./broadcasters"
import {
  mapSequence,
  hardCode,
  targetValue,
  mapBroadcaster,
  waitFor,
} from "./operators"

import { pipe } from "lodash/fp"

let delayMessage = value =>
  hardCode(value)(createTimeout(500))

let messageSequence = message =>
  mapSequence(delayMessage)(forOf(message.split(" ")))

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)

  let inputToMessage = pipe(
    waitFor(500),
    mapBroadcaster(messageSequence)
  )(inputValue)

  let state = useBroadcaster(inputToMessage)

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{state}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
