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
  map,
  filter,
} from "./operators"

import { pipe } from "lodash/fp"

let mapError = transform => broadcaster => listener => {
  return broadcaster(value => {
    if (value instanceof Error) {
      listener(transform(value))
      return
    }

    listener(value)
  })
}

//https://openlibrary.org/search.json?q=starsight

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

let ifElse = (
  condition,
  ifOp,
  elseOp
) => broadcaster => listener => {
  broadcaster(value => {
    let immediateBroadcaster = innerListener =>
      innerListener(value)
    if (condition(value)) {
      //if
      ifOp(immediateBroadcaster)(listener)
    } else {
      //else
      elseOp(immediateBroadcaster)(listener)
    }
  })
}

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)

  let inputToBookSearch = pipe(
    waitFor(500),
    ifElse(
      name => name.length > 3,
      pipe(
        map(
          name =>
            `https://openlibrary.org/search.json?q=${name}`
        ),
        mapBroadcaster(getURL),
        map(result => result.docs)
      ),
      map(() => [])
    )
  )(inputValue)

  let books = useBroadcaster(inputToBookSearch, [])

  return (
    <div>
      <input type="text" onInput={onInput} />
      {books.map(book => (
        <div key={book.key}>
          <a href={`https://openlibrary.org${book.key}`}>
            {book.title}
          </a>
        </div>
      ))}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
