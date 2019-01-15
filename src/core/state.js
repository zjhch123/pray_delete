
const listeners = []

export function onStateChange() {
  listeners.forEach(listener => {
    listener()
  })
}

export function subscribe(listener) {
  listeners.push(listener)
}