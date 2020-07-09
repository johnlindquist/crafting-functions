import { createTimeout, done } from "./broadcasters"
import { hardCode } from "./operators"

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

let one = repeat(hardCode("hi")(createTimeout(1000)))

one(console.log)
