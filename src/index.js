//`https://random-word-api.herokuapp.com/word`
import { head, pipe, every, isString } from "lodash/fp"
import React from "react"
import { render } from "react-dom"
import {
  getURL,
  useBroadcaster,
  useListener,
} from "./broadcasters"
import {
  init,
  map,
  repeatIf,
  targetValue,
  thenCombine,
  filter,
} from "./operators"

let getWord = pipe(map(head))(
  getURL(`https://random-word-api.herokuapp.com/word`)
)

let doneLogic = ([word, guess]) =>
  word &&
  guess &&
  Array.from(word).every(letter => guess.includes(letter))

let gameLogic = pipe(
  filter(every(isString)),
  repeatIf(doneLogic)
)

let guessPipe = pipe(targetValue, init(""))

let App = () => {
  let onInput = useListener()
  let guessBroadcaster = guessPipe(onInput)

  let gameBroadcaster = gameLogic(
    thenCombine(guessBroadcaster)(getWord)
  )

  let [word, guess] = useBroadcaster(gameBroadcaster, [
    "",
    "",
  ])

  return (
    <div>
      <input type="text" onChange={onInput} value={guess} />
      <p>{word}</p>
      <p>
        {Array.from(word).map(letter =>
          guess.includes(letter) ? letter : "*"
        )}
      </p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
