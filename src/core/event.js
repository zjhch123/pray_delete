const eventCache = window.event = new Map()
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
  addEventListener(el, eventName, listener)
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
      el.removeEventListener(eventName, eventListener)
    })
  } else {
    eventCache.get(el).filter((item) => item.eventName === eventName).forEach(({ eventListener }) => {
      el.removeEventListener(eventName, eventListener)
    })
    
    const lastEvents = eventCache.get(el).filter((item) => item.eventName !== eventName)
    eventCache.set(el, lastEvents)
  }
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {String} eventName 
 * @param {EventListenerOrEventListenerObject} listener 
 */
function addEventListener(el, eventName, listener) {
  if (eventCache.has(el)) {
    const events = eventCache.get(el)

    const lastSameEvents = events.filter(event => event.eventName === eventName)

    if (lastSameEvents.length > 0) {
      removeEvent(el, eventName)
    }

    eventCache.get(el).push({
      eventName,
      eventListener: listener
    })
  } else {
    eventCache.set(el, [{
      eventName,
      eventListener: listener
    }])
  }

  el.addEventListener(eventName, listener)
}