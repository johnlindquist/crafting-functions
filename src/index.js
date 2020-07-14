import {
  createInterval,
  useBroadcaster,
} from "./broadcasters"

import { targetValue } from "./operators"

import React, {
  useState,
  useEffect,
  useCallback,
} from "react"
import { render } from "react-dom"

let listener
let callbackListener = value => {
  if (typeof value === "function") {
    listener = value
    return
  }
  listener(value)
}

let App = () => {
  let onInput = useCallback(callbackListener)
  let state = useBroadcaster(onInput)
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{state}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
