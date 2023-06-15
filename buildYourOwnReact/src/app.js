import Didact from './didact'

/** @jsx Didact.createElement */
function Counter(props) {
  const [state, setState] = Didact.useState(1)
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>
}

const element = <Counter name="1" />
const container = document.getElementById('root')
Didact.render(element, container)
