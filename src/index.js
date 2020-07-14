import React, {
  useEffect,
  useState,
  useCallback,
  SyntheticEvent,
} from "react"
import ReactDOM from "react-dom"
import { createInterval } from "./broadcasters"
import { map, mapSequence } from "./operators"

let useBroadcaster = broadcaster => {
  let [state, setState] = useState(null)
  useEffect(() => {
    console.log("hmm")
    return broadcaster(setState)
  }, [])

  return state
}
let useListener = () => {
  let listener

  let callbackListener = value => {
    if (typeof value === "function") {
      listener = value
    } else {
      listener(value)
    }
  }
  return useCallback(callbackListener, [])
}

let App = () => {
  let onInput = useListener()
  let state = useBroadcaster(
    map(event => event.target.value)(onInput)
  )
  return (
    <div className="App">
      <input type="text" onInput={onInput} />
      <p>{state}</p>
    </div>
  )
}

const rootElement = document.getElementById("app")
ReactDOM.render(<App />, rootElement)
