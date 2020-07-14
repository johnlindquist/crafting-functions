import { createInterval } from "./broadcasters"

import React, { useState, useEffect } from "react"
import { render } from "react-dom"

let App = () => {
  let [state, setState] = useState("Hi")
  useEffect(() => {
    createInterval(1000)(setState)
  }, [])
  return <div>{state}</div>
}

render(<App></App>, document.querySelector("#root"))
