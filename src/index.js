let i = 0
let callback = event => {
  console.log(i++)
}

document.addEventListener("click", callback)
