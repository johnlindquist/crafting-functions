let createTimeout = time => listener => {
  let id = setTimeout(listener, time)

  return () => {
    clearTimeout(id)
  }
}



let addListener = selector => eventType => listener => {
  let element = document.querySelector(selector)
  element.addEventListener(eventType, listener)

  return () => {
    element.removeEventListener(eventType, listener)
  }
}

let createInterval = time => listener => {

  let id = setInterval(listener, time)
  return () => {
    clearInterval(id)
  }
}

let oneSecond = createInterval(1000)
let cancelOneSecond = oneSecond(() => {
  console.log("one")
})

cancelOneSecond()

let twoSeconds = createInterval(2000)
twoSeconds(() => {
  console.log("two")
})