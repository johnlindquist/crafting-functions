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
  filter,
  targetValue,
  mapBroadcaster,
} from "./operators"

import { pipe } from "lodash/fp"
// let message = "Hi, my name is John!".split(" ")
let delayMessage = value =>
  hardCode(value)(createTimeout(500))

let mapMessageSequence = message =>
  mapSequence(delayMessage)(forOf(message.split(" ")))

let allowWhen = allowBroadcaster => broadcaster => listener => {
  let state
  broadcaster(value => {
    state = value
  })

  allowBroadcaster(value => {
    console.log({ state })
    listener(state)
  })
}

let App = () => {
  let onInput = useListener()
  let onKeyPress = useListener()

  let inputValue = targetValue(onInput)
  let enter = filter(event => event.key === "Enter")(
    onKeyPress
  )
  let operators = pipe(
    allowWhen(enter),
    mapBroadcaster(mapMessageSequence)
  )
  let state = useBroadcaster(operators(inputValue))

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
