import { pipe } from "lodash/fp"

let click = listener => {
  document.addEventListener("click", listener)
}

let timeout = listener => {
  setTimeout(listener, 1000)
}

let getURL = listener => {
  fetch(`https://api.github.com/user/36073`)
    .then(response => response.json())
    .then(listener)
}

let nest = inner => outer => listener => {
  outer(value => {
    inner(listener)
  })
}

let timeoutURL = pipe(nest(timeout), nest(getURL))

timeoutURL(click)(data => {
  console.log(data)
})
