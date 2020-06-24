import { curry } from "lodash"
import { done } from "./broadcasters"

export let modify = curry((broadcaster, listener) => {
    let string = ""

    return broadcaster(value => {
        if (value === done) {
            listener(done)
            return
        }

        listener(string += value)
    })
})

export let map = curry((transform, broadcaster, listener) => {
    return broadcaster(value => {
        if (value === done) {
            listener(done)
            return
        }

        listener(transform(value))
    })
})

export let filter = curry((predicate, broadcaster, listener) => {
    return broadcaster(value => {
        if (value === done) {
            listener(done)
            return
        }
        if (predicate(value)) {
            listener(value)
        }
    })
})