const eventCache = {}

/**
 * @param {HTMLElement} el 
 * @param {String} name 
 * @param {Function} func 
 */
export function addEvent(el, name, func) {
  const reg = /^on(\w+)$/
  const eventName = name.match(reg)[1].toLowerCase()
  addDocumentEvent(el, eventName, func)
}

export function removeEvent(el, eventName) {
  if (typeof eventCache[el] === 'undefined') {
    return
  }

  if (typeof eventName === 'undefined') {
    eventCache[el].forEach(({ eventName, eventListener }) => {
      document.removeEventListener(eventName, eventListener)
    })
    eventCache[el] = []
  } else {
    eventCache[el].filter((item) => item.eventName === eventName).forEach(({ eventListener }) => {
      document.removeEventListener(eventName, eventListener)
    })
    eventCache[el] = eventCache[el].filter((item) => item.eventName !== eventName)
  }
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {String} eventName 
 * @param {EventListenerOrEventListenerObject} func 
 */
function addDocumentEvent(el, eventName, listener) {
  const eventListener = generateEventHandler(el, listener)
  const item = { eventName, eventListener }

  typeof eventCache[el] === 'undefined' 
    ? eventCache[el] = [item] 
    : eventCache[el].push(item);

  document.addEventListener(eventName, eventListener)
}

const generateEventHandler = (el, originalListener) => {
  return (e) => {
    if (e.target === el) {
      originalListener.apply(this, e)
    }
  }
}