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
  filterByKey,
  mapBroadcaster,
  allowWhen,
} from "./operators"

import { pipe } from "lodash/fp"

let delayMessage = value =>
  hardCode(value)(createTimeout(500))

let messageSequence = message =>
  mapSequence(delayMessage)(forOf(message.split(" ")))

let App = () => {
  let onInput = useListener()
  let onKeyPress = useListener()

  let inputValue = targetValue(onInput)
  let enter = filterByKey("Enter")(onKeyPress)

  let inputToMessage = pipe(
    allowWhen(enter),
    mapBroadcaster(messageSequence)
  )(inputValue)

  let state = useBroadcaster(inputToMessage)

  return (
    <div>
      <input
        type="text"
        onInput={onInput}
        onKeyPress={onKeyPress}
      />
      <p>{state}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
