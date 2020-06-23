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

let addButtonListener = addListener("#button")
let addButtonClickListener = addButtonListener("click")

let oneSecond = createInterval(1000)

//broadcaster = function that accepts a listener
let merge = (broadcaster1, broadcaster2) => listener => {
  let cancel1 = broadcaster1(listener)
  let cancel2 = broadcaster2(listener)

  return () => {
    cancel1()
    cancel2()
  }
}

let clickOrTick = merge(addButtonClickListener, oneSecond)
let cancelClickOrTick = clickOrTick(() => {
  console.log("click or tick")
})

cancelClickOrTick()