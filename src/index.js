import { addListener, done } from "./broadcasters"
import { repeatWhen, filter } from "./operators"
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

let inputEnter = filter(event => event.key === "Enter")(
  addListener("#input", "keydown")
)

let score = pipe(
  state,
  doneIf(value => value === 0),
  repeatWhen(inputEnter)
)

score(inputClick)(console.log)
