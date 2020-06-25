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

export let split = splitter => curry((broadcaster, listener) => {
    let buffer = []
    return broadcaster(value => {
        if (value === done) {
            listener(buffer)
            buffer = []
            listener(done)
        }
        if (value == splitter) {
            listener(buffer)
            buffer = []
        } else {
            buffer.push(value)
        }
    })
})