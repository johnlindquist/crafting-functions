import { curry } from "lodash"
import { addListener, createInterval } from "./broadcasters"

let zip = curry((broadcaster1, broadcaster2, listener) => {
  let buffer1 = []
  let cancel1 = broadcaster1(value => {
    buffer1.push(value)
    if (buffer2.length) {

      listener([buffer1.shift(), buffer2.shift()])
    }
  })

  let buffer2 = []
  let cancel2 = broadcaster2(value => {
    buffer2.push(value)

    if (buffer1.length) {

      listener([buffer1.shift(), buffer2.shift()])
    }
  })

  return () => {
    cancel1()
    cancel2()
  }
})

let forOf = curry((iterable, listener) => {
  let id = setTimeout(() => {
    for (let i of iterable) {
      listener(i)
    }

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
  console.log(value[1])
})

// cancelTypeGreeting()
