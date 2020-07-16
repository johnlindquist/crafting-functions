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

//https://api.github.com/users/johnlindquist

let mapError = transform => broadcaster => listener => {
  return broadcaster(value => {
    if (value instanceof Error) {
      listener(transform(value))
      return
    }

    listener(value)
  })
}

let getURL = url => listener => {
  let controller = new AbortController()
  let signal = controller.signal
  fetch(url, { signal })
    .then(response => {
      return response.json()
    })
    .then(json => {
      listener(json)
    })
    .catch(error => {
      listener(error)
    })

  return () => {
    controller.abort()
  }
}

let cancel = mapError(error => ({ login: error.message }))(
  getURL("https://api.github.com/users/johnlindquist")
)(console.log)

cancel()

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

  let profile = useBroadcaster(
    getURL("https://api.github.com/users/johnlindquist"),
    { login: "" }
  )

  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{state}</p>
      <p>{profile.login}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
