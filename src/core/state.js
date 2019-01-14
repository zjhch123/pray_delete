
const listeners = []

let prevRootVNode = null

function onStateChange() {
  listeners.forEach(listener => {

  })
}

function stateDispatcher(defaultValue) {
  return defaultValue
}

function generateStateDispatcherHandler() {
  return () => {}
}

export function useState(defaultValue) {
  console.log(this)
  return [ stateDispatcher(defaultValue), generateStateDispatcherHandler() ]
}

export function subscribe(element, listener) {
  prevRootVNode = element
  listeners.push(listener)
}