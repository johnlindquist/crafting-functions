let createTimeout = (time) => (callback) => {
  let id = setTimeout(callback, time)

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

let addButtonListener = addListener("#button")
let addButtonClickListener = addButtonListener("click")
let removeButtonClickListener = addButtonClickListener(() => {
  console.log("Button clicked")
})

removeButtonClickListener()