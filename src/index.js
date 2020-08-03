import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout,
  merge,
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

export let mapBroadcasterCache = createBroadcaster => broadcaster => listener => {
  let cache = new Map()
  return broadcaster(value => {
    if (cache.has(value)) {
      listener(cache.get(value))
      return
    }
    let newBroadcaster = createBroadcaster(value)
    newBroadcaster(newValue => {
      cache.set(value, newValue)
      console.log(cache)
      listener(newValue)
    })
  })
}

let App = () => {
  let onInput = useListener()

  let inputValue = targetValue(onInput)

  let inputToBookSearch = pipe(
    waitFor(500),
    filter(name => name.length > 3),
    map(
      name =>
        `https://openlibrary.org/search.json?q=${name}`
    ),
    mapBroadcasterCache(getURL),
    map(result => result.docs)
  )(inputValue)

  let inputToClearSearch = pipe(
    filter(name => name.length < 2),
    map(name => [])
  )(inputValue)

  let books = useBroadcaster(
    merge(inputToBookSearch, inputToClearSearch),
    []
  )

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
