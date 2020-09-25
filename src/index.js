import React from "react"
import { render } from "react-dom"

//`https://random-word-api.herokuapp.com/word`

import { pipe, head } from "lodash/fp"
import { getURL, useBroadcaster } from "./broadcasters"
import { map } from "./operators"

let share = () => {
  let cancel
  let listeners = []
  return broadcaster => {
    cancel = broadcaster(value => {
      listeners.forEach(listener => listener(value))
    })
    return listener => {
      listeners.push(listener)

      return () => {
        cancel()
      }
    }
  }
}

let getWord = pipe(
  map(head),
  share()
)(getURL(`https://random-word-api.herokuapp.com/word`))

let App = () => {
  let word = useBroadcaster(getWord)
  let anotherWord = useBroadcaster(getWord)
  return (
    <div>
      <p>{word}</p>
      <p>{anotherWord}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
