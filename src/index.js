import { curry } from "lodash"
import { addListener, createInterval } from "./broadcasters"

let done = Symbol("done")

let zip = curry((broadcaster1, broadcaster2, listener) => {
  let cancelBoth

  let buffer1 = []
  let cancel1 = broadcaster1(value => {
    buffer1.push(value)
    // console.log(buffer1)
    if (buffer2.length) {

      listener([buffer1.shift(), buffer2.shift()])

      if (buffer1[0] === done || buffer2[0] === done) {
        listener(done)
        cancelBoth()
      }
    }
  })

  let buffer2 = []
  let cancel2 = broadcaster2(value => {
    buffer2.push(value)

    if (buffer1.length) {

      listener([buffer1.shift(), buffer2.shift()])
      if (buffer1[0] === done || buffer2[0] === done) {
        listener(done)
        cancelBoth()
      }
    }
  })

  cancelBoth = () => {
    cancel1()
    cancel2()
  }

  return cancelBoth
})

let forOf = curry((iterable, listener) => {
  let id = setTimeout(() => {
    for (let i of iterable) {
      listener(i)
    }
    listener(done)

  }, 0)

  return () => {
    clearTimeout(id)
  }
})

let typeGreeting = zip(
  createInterval(100),
  forOf("Hello, John")
)

let cancelTypeGreeting = typeGreeting(value => {
  if (value === done) {
    console.log("Shutting down")
    return
  }

  console.log(value)
})

// cancelTypeGreeting()
