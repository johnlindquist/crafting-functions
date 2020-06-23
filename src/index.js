import { curry, partial } from "lodash"

let createTimeout = curry((time, listener) => {
  let id = setTimeout(listener, time)

  return () => {
    clearTimeout(id)
  }
})

let addListener = curry((selector, eventType, listener) => {
  let element = document.querySelector(selector)
  element.addEventListener(eventType, listener)

  return () => {
    element.removeEventListener(eventType, listener)
  }
})

let createInterval = curry((time, listener) => {
  let id = setInterval(listener, time)
  return () => {
    clearInterval(id)
  }
})

//broadcaster = function that accepts a listener
let merge = curry((broadcaster1, broadcaster2, listener) => {
  let cancel1 = broadcaster1(listener)
  let cancel2 = broadcaster2(listener)

  return () => {
    cancel1()
    cancel2()
  }
})

let clickOrTick = merge(
  addListener("#button", "click"),
  createInterval(1000)
)
let cancelClickOrTick = clickOrTick(() => {
  console.log("click or tick")
})

cancelClickOrTick()