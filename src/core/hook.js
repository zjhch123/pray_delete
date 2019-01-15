import { onStateChange } from './state'

const memorizeState = window.state = new Map()
let lastComponent = null

export function memorizeHookState(functionalComponent) {
  if (!memorizeState.has(functionalComponent)) {
    memorizeState.set(functionalComponent, {
      cursor: 0,
      isFirst: true,
      state: [],
      eventHandler: []
    })
  }
  return (props) => memorizeWrapper(functionalComponent)(props)
}

export function useState(defaultValue) {
  if (lastComponent === null) {
    throw new Error('Component get null in `useState`')
  }
  const stateObject = memorizeState.get(lastComponent)
  const ret = [ stateDispatcher(stateObject, defaultValue), stateDispatcherHandler(stateObject) ];
  stateObject.cursor += 1
  return ret
}

function memorizeWrapper(functionalComponent) {
  const state = memorizeState.get(functionalComponent)
  return (...props) => {
    lastComponent = functionalComponent
    state.cursor = 0
    const originalRet = functionalComponent.apply(this, props)
    state.cursor = 0
    state.isFirst = false
    lastComponent = null
    return originalRet
  }
}

function stateDispatcher(stateObject, defaultValue) {
  if (stateObject.isFirst) {
    stateObject.state[stateObject.cursor] = defaultValue
    return defaultValue
  }
  return stateObject.state[stateObject.cursor]
}

function stateDispatcherHandler(stateObject) {
  if (stateObject.isFirst) {
    const index = stateObject.cursor
    const handler = (value) => {
      stateObject.state[index] = value
      onStateChange()
    }
    stateObject.eventHandler[stateObject.cursor] = handler
  }
  return stateObject.eventHandler[stateObject.cursor]
}