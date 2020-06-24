import { curry } from "lodash"

export let createTimeout = curry((time, listener) => {
    let id = setTimeout(listener, time)

    return () => {
        clearTimeout(id)
    }
})

export let addListener = curry((selector, eventType, listener) => {
    let element = document.querySelector(selector)
    element.addEventListener(eventType, listener)

    return () => {
        element.removeEventListener(eventType, listener)
    }
})

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
export let merge = curry((broadcaster1, broadcaster2, listener) => {
    let cancel1 = broadcaster1(listener)
    let cancel2 = broadcaster2(listener)

    return () => {
        cancel1()
        cancel2()
    }
})