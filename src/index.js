import {
  addListener,
  done,
  createTimeout,
  forOf,
} from "./broadcasters"
import { repeatWhen, filter, hardCode } from "./operators"
import { pipe } from "lodash/fp"

import React from "react"
import { render } from "react-dom"

let App = () => <div>Hello</div>

render(<App></App>, document.querySelector("#root"))
