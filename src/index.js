let addListener = (selector, eventType) => listener => {
  let element = document.querySelector(selector)
  element.addEventListener(eventType, listener)
}

let merge = (b1, b2) => listener => {
  b1(listener)
  b2(listener)
}

let plusClick = addListener("#plus", "click")
let minusClick = addListener("#minus", "click")

let hardCode = newValue => broadcaster => listener => {
  broadcaster(value => {
    listener(newValue)
  })
}

let add = initial => broadcaster => listener => {
  broadcaster(value => {
    listener(initial += value)
  })
}

let plusOne = hardCode(1)(plusClick)
let minusOne = hardCode(-1)(minusClick)

let counter = add(0)(merge(plusOne, minusOne))

counter(value => {
  console.log(value)
})