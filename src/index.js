import {
  addListener,
  done,
  createTimeout,
  forOf,
} from "./broadcasters"
import { repeatWhen, filter, hardCode } from "./operators"
import { pipe } from "lodash/fp"

let inputClick = addListener("#input", "click")

let state = broadcaster => listener => {
  let state = 3
  return broadcaster(value => {
    state--
    listener(state)
  })
}

let doneIf = condition => broadcaster => listener => {
  let cancel = broadcaster(value => {
    listener(value)
    if (condition(value)) {
      listener(done)
      cancel()
    }
  })

  return cancel
}

// let inputEnter = filter(event => event.key === "Enter")(
//   addListener("#input", "keydown")
// )

// let score = pipe(
//   state,
//   doneIf(value => value === 0),
//   repeatWhen(inputEnter)
// )

// score(inputClick)(console.log)

let delayMessage = message =>
  hardCode(message)(createTimeout(500))

let sequence = (...broadcasters) => listener => {
  let broadcaster = broadcasters.shift()
  let cancel
  let sequenceListener = value => {
    if (value === done && broadcasters.length) {
      let broadcaster = broadcasters.shift()
      cancel = broadcaster(sequenceListener)
      return
    }
    listener(value)
  }

  cancel = broadcaster(sequenceListener)

  return () => {
    cancel()
  }
}

let message = "Hello, my name is John!".split(" ")

let mapSequence = createBroadcaster => broadcaster => listener => {
  let buffer = []
  let innerBroadcaster
  let innerListener = innerValue => {
    if (innerValue === done) {
      innerBroadcaster = null
      if (buffer.length) {
        let value = buffer.shift()
        if (value === done) {
          listener(done)
          return
        }
        innerBroadcaster = createBroadcaster(value)
        innerBroadcaster(innerListener)
      }

      return
    }
    listener(innerValue)
  }
  broadcaster(value => {
    if (innerBroadcaster) {
      buffer.push(value)
    } else {
      innerBroadcaster = createBroadcaster(value)
      innerBroadcaster(innerListener)
    }
  })
}

let hiClick = hardCode("hi")(inputClick)

mapSequence(word => delayMessage(word))(forOf(message))(
  console.log
)
