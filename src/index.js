//broadcaster
//listener
//operator

let listener = value => {
  console.log(value)
}

let broadcaster = listener => {
  listener(1)
  listener(2)
  listener(3)
}

let operator = broadcaster => listener => {
  let currentValue = 0
  broadcaster(value => {
    currentValue += value
    setTimeout(() => {
      listener(currentValue)
    }, currentValue * 1000)
  })
}

let timeoutByValue = broadcaster => listener => {
  broadcaster(value => {
    setTimeout(() => {
      listener(value)
    }, value * 1000)
  })
}

operator(broadcaster)(listener)
