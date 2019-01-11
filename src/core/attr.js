import { addEvent, isEventName } from './event'

export function setAttr(el, propName, propValue) {
  if (isEventName(propName)) {
    addEvent(el, propName, propValue)
    return
  }
  switch (propName) {
    case 'style':
      el.style.cssText = propValue
      break
    case 'value':
      if (el.tagName === 'input' || el.tagName === 'textarea') {
        el.value = propValue
        break
      } 
      el.setAttribute('value', propValue)
      break
    case 'className':
      el.setAttribute('class', propValue)
      break
    case 'key':
      el.setAttribute('data-pray-id', propValue)
      break
    default:
      el.setAttribute(propName, propValue)
      break
  }
}