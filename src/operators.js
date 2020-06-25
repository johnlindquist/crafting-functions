import { curry } from "lodash"
import { done } from "./broadcasters"

let createOperator = curry((operator, broadcaster, listener) => {
    return operator(behaviorListener => {
        return broadcaster(value => {
            if (value === done) {
                listener(done)
                return
            }

            behaviorListener(value)
        })
    }, listener)
})

export let modify = createOperator((broadcaster, listener) => {
    let string = ""

    return broadcaster(value => {
        listener(string += value)
    })
})

export let map = transform => createOperator((broadcaster, listener) => {
    return broadcaster(value => {
        listener(transform(value))
    })
})

export let filter = predicate => createOperator((broadcaster, listener) => {
    return broadcaster(value => {
        if (predicate(value)) {
            listener(value)
        }
    })
})