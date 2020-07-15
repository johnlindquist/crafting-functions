import { curry } from "lodash"
import { useState, useEffect, useCallback } from "react"
export let done = Symbol("done")

export let createTimeout = curry((time, listener) => {
  let id = setTimeout(() => {
    listener(null)
    listener(done)
  }, time)

  return () => {
    clearTimeout(id)
  }
})

export let addListener = curry(
  (selector, eventType, listener) => {
    let element = document.querySelector(selector)
    element.addEventListener(eventType, listener)

    return () => {
      element.removeEventListener(eventType, listener)
    }
  }
)

export let createInterval = curry((time, listener) => {
  let i = 0
  let id = setInterval(() => {
    listener(i++)
  }, time)
  return () => {
    clearInterval(id)
  }
})

//broadcaster = function that accepts a listener
export let merge = curry(
  (broadcaster1, broadcaster2, listener) => {
    let cancel1 = broadcaster1(listener)
    let cancel2 = broadcaster2(listener)

    return () => {
      cancel1()
      cancel2()
    }
  }
)

export let zip = curry(
  (broadcaster1, broadcaster2, listener) => {
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
  }
)

export let forOf = curry((iterable, listener) => {
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

export let useBroadcaster = (broadcaster, deps = []) => {
  let [state, setState] = useState(null)
  useEffect(() => {
    broadcaster(value => {
      if (value === done) {
        return
      }

      setState(value)
    })
  }, deps)

  return state
}

export let useListener = (deps = []) => {
  let listener
  let callbackListener = value => {
    if (typeof value === "function") {
      listener = value
      return
    }
    listener(value)
  }
  return useCallback(callbackListener, deps)
}
