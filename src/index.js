import { addListener, createInterval } from "./broadcasters"
import { pipe } from "lodash/fp"

let startClick = addListener("#start", "click")
let stopClick = addListener("#stop", "click")

let timer = createInterval(100)



let startWhen = whenBroadcaster => mainBroadcaster => listener => {
  let cancelMain
  let cancelWhen

  cancelWhen = whenBroadcaster(() => {
    if (cancelMain) cancelMain()
    cancelMain = mainBroadcaster(value => {
      listener(value)
    })
  })

  return () => {
    cancelMain()
    cancelWhen()
  }
}

let stopWhen = whenBroadcaster => mainBroadcaster => listener => {
  let cancelMain = mainBroadcaster(listener)

  let cancelWhen = whenBroadcaster(value => {
    cancelMain()
  })

  return () => {
    cancelMain()
    cancelWhen()
  }
}

let operators = pipe(
  stopWhen(stopClick),
  startWhen(startClick)
)

operators(timer)(console.log)