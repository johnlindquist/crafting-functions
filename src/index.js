import React from "react"
import { render } from "react-dom"

//`https://random-word-api.herokuapp.com/word`

import { pipe, head } from "lodash/fp"
import {
  getURL,
  useBroadcaster,
  useListener,
} from "./broadcasters"
import { map, mapBroadcaster } from "./operators"

let share = () => {
  let cancel
  let listeners = []
  return broadcaster => {
    if (!cancel) {
      cancel = broadcaster(value => {
        listeners.forEach(listener => listener(value))
      })
    }
    return listener => {
      listeners.push(listener)

      return () => {
        cancel()
      }
    }
  }
}

let getWord = pipe(
  mapBroadcaster(event =>
    pipe(map(head))(
      getURL(`https://random-word-api.herokuapp.com/word`)
    )
  ),
  share()
)

let App = () => {
  let onClick = useListener()

  let word = useBroadcaster(getWord(onClick))
  let anotherWord = useBroadcaster(getWord(onClick))
  return (
    <div>
      <button onClick={onClick}>Load word</button>
      <p>{word}</p>
      <p>{anotherWord}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
