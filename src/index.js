//broadcaster
//listener

let listener = value => {
  console.log(value)
}

let broadcaster = listener => {
  listener(1)
  listener(2)
  listener(3)
}

broadcaster(listener)
