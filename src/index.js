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

let clickAndTick = zip(
  addListener("#button", "click"),
  createInterval(1000)
)

let cancelClickAndTick = clickAndTick(value => {
  console.log(value)
})

cancelClickAndTick()