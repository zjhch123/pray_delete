const listeners = []

function onStateChange() {
  
}

export default function useState(defaultValue) {
  return [ defaultValue, () => {} ]
}

export function subscribe(listener) {
  listeners.push(listener)
}