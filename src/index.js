import { addListener, createInterval, merge } from "./broadcasters"
import { hardCode } from "./operators"
import { pipe } from "lodash/fp"

let share = () => {
  let listeners = []
  let cancel
  return broadcaster => listener => {
    if (!listeners.length) {
      cancel = broadcaster(value => {
        listeners.forEach(listener => listener(value))
      })
    }
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(list => list !== listener)
      if (!listeners.length) cancel()
    }
  }
}

let input = share()(addListener("#input", "input"))
let form = share()(addListener("#form", "submit"))

let withValueFrom = from => broadcaster => listener => {

  let withValue
  from(event => {
    withValue = event.target.value
  })

  return broadcaster(value => {
    listener(withValue)
  })
}

let setState = initial => broadcaster => listener => {
  let state = initial
  return broadcaster(updater => {
    state = updater(state)
    listener(state)
  })
}

let updater = (prev, current) => {
  return [...prev, current]
}

let addBroadcaster
let todos = listener => {
  addBroadcaster = broadcaster => {
    broadcaster(listener)
  }
}

let addTodo = title => {
  let todo = document.createElement("li")
  todo.innerText = title
  todos.appendChild(todo)
  addBroadcaster(hardCode(title)(addListener(todo, "click")))
}

setState(updater, [])(
  merge(
    todos,
    withValueFrom(input)(form)
  )
)(addTodo)


// c()
let cancel = form(() => {
  document.querySelector("#input").value = ""
})

// cancel()

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
