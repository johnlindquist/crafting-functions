import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
} from "./broadcasters"
import {
  targetValue,
  filter,
} from "./operators"

let allowWhen = allowBroadcaster => broadcaster => listener => {
  let current
  broadcaster(value => {
    current = value
  })

  allowBroadcaster(() => {
    listener(current)
  })
}

let App = () => {
  let onInput = useListener()
  let onKeyPress = useListener()

  let inputValue = targetValue(onInput)
  let enter = filter(event => event.key === "Enter")(
    onKeyPress
  )
  let state = useBroadcaster(allowWhen(enter)(inputValue))

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
