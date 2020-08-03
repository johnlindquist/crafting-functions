import React, { useEffect, useState, useRef } from "react"
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

let App = () => {
  // let onInput = useListener()

  // let inputValue = targetValue(onInput)

  // let inputToBookSearch = pipe(
  //   filter(name => name.length > 3),
  //   waitFor(500),
  //   map(
  //     name =>
  //       `https://openlibrary.org/search.json?q=${name}`
  //   ),
  //   mapBroadcaster(getURL),
  //   map(result => result.docs)
  // )(inputValue)

  // let inputToClearSearch = pipe(
  //   filter(name => name.length < 2),
  //   map(name => [])
  // )(inputValue)

  // let books = useBroadcaster(
  //   merge(inputToBookSearch, inputToClearSearch),
  //   []
  // )

  let [name, setInputValue] = useState("")
  let [books, setBooks] = useState([])
  let firstRef = useRef(true)
  let timeoutRef = useRef()
  let controllerRef = useRef()
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (controllerRef.current) controllerRef.current.abort()

    controllerRef.current = new AbortController()
    let signal = controllerRef.current.signal
    timeoutRef.current = setTimeout(async () => {
      if (name.length > 3) {
        try {
          let response = await fetch(
            `https://openlibrary.org/search.json?q=${name}`,
            { signal }
          )
          let json = await response.json()
          setBooks(json.docs)
        } catch (error) {}
      }

      if (name.length < 3) {
        setBooks([])
      }
    }, 500)

    return () => {
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
      if (controllerRef.current)
        controllerRef.current.abort()
    }
  }, [name])

  return (
    <div>
      <input
        type="text"
        onInput={event => setInputValue(event.target.value)}
      />
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
