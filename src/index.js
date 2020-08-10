import { pipe } from "lodash/fp"

let click = config => listener => {
  document.addEventListener(config, listener)
}

let timeout = config => listener => {
  setTimeout(() => {
    listener(config)
  }, config)
}

let getURL = config => listener => {
  fetch(`https://api.github.com/user/${config}`)
    .then(response => response.json())
    .then(listener)
}

let nest = mapInner => outer => listener => {
  outer(config => {
    let inner = mapInner(config)
    inner(listener)
  })
}

let timeoutURL = pipe(
  nest(event => timeout(event.x)),
  nest(getURL)
)

timeoutURL(click("click"))(data => {
  console.log(data)
})
