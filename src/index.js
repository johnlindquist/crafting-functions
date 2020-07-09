import {
  createTimeout,
  done,
  forOf,
  addListener,
} from "./broadcasters"
import { hardCode, startWhen } from "./operators"

let repeat = broadcaster => listener => {
  let cancel
  let repeatListener = value => {
    if (value === done) {
      cancel()
      cancel = broadcaster(repeatListener)
      return
    }

    listener(value)
  }
  cancel = broadcaster(repeatListener)

  return cancel
}

let repeatWhen = whenBroadcaster => broadcaster => listener => {
  let cancel
  let cancelWhen
  let repeatListener = value => {
    if (value === done) {
      cancel()
      if (cancelWhen) cancelWhen()
      cancelWhen = whenBroadcaster(() => {
        cancel = broadcaster(repeatListener)
      })
      return
    }

    listener(value)
  }
  cancel = broadcaster(repeatListener)

  return () => {
    cancel()
    if (cancelWhen) cancelWhen()
  }
}

let word = forOf("cat")
let inputClick = addListener("#input", "click")
repeatWhen(inputClick)(word)(console.log)
