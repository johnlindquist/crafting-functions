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

//https://bit.ly/star-api
let URL = "https://o9jknolj9z.sse.codesandbox.io/"
let query = "people?name_like=luke"

import { pipe } from "lodash/fp"

let getURL = url => listener => {
  let controller = new AbortController()
  let signal = controller.signal
  fetch(url, { signal })
    .then(response => response.json())
    .then(listener)

  return () => {
    controller.abort()
  }
}

let delayMessage = value =>
  hardCode(value)(createTimeout(500))

let messageSequence = message =>
  mapSequence(delayMessage)(forOf(message.split(" ")))

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)

  let inputToMessage = pipe(
    waitFor(500),
    mapBroadcaster(name =>
      getURL(URL + "people?name_like=" + name)
    )
  )(inputValue)

  let people = useBroadcaster(inputToMessage, [])

  return (
    <div>
      <input type="text" onInput={onInput} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {people.map(person => (
          <div key={person.id}>
            <p>{person.name}</p>
            <img src={URL + person.image} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
