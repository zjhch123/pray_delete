const eventCache = window.eventCache = new Map()
const eventReg = /^on(\w+)$/

export function isEventName(name) {
  return eventReg.test(name)
}

export function getEventName(name) {
  return name.match(eventReg)[1].toLowerCase()
}

/**
 * @param {HTMLElement} el 
 * @param {String} name 
 * @param {EventListenerOrEventListenerObject} listener 
 */
export function addEvent(el, name, listener) {
  if (!isEventName(name)) {
    return
  }
  const eventName = getEventName(name)
  addDocumentEvent(el, eventName, listener)
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {String} eventName 
 */
export function removeEvent(el, eventName) {
  if (!eventCache.has(el)) {
    return
  }

  if (typeof eventName === 'undefined') {
    eventCache.get(el).forEach(({ eventName, eventListener }) => {
      document.removeEventListener(eventName, eventListener)
    })
    eventCache.delete(el)
  } else {
    eventCache.get(el).filter((item) => item.eventName === eventName).forEach(({ eventListener }) => {
      document.removeEventListener(eventName, eventListener)
    })
    
    const lastEvents = eventCache.get(el).filter((item) => item.eventName !== eventName)
    if (lastEvents.length === 0) {
      eventCache.delete(el)
    } else {
      eventCache.set(el, lastEvents)
    }
  }
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {String} eventName 
 * @param {EventListenerOrEventListenerObject} listener 
 */
function addDocumentEvent(el, eventName, listener) {
  const eventListener = generateEventHandler(el, listener)
  const item = { eventName, eventListener }

  eventCache.has(el)
    ? eventCache.get(el).push(item)
    : eventCache.set(el, [item]);

  document.addEventListener(eventName, eventListener)
}

const generateEventHandler = (el, originalListener) => {
  return (e) => {
    if (e.target === el) {
      originalListener.apply(this, e)
    }
  }
}