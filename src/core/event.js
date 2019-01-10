/**
 * @param {HTMLElement} el 
 * @param {String} name 
 * @param {Function} func 
 */
export default function addEvent(el, name, func) {
  const reg = /^on(\w+)$/
  const eventName = name.match(reg)[1].toLowerCase()
  addDocumentEvent(el, eventName, func)
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {String} eventName 
 * @param {Function} func 
 */
function addDocumentEvent(el, eventName, func) {
  document.addEventListener(eventName, (e) => {
    if (e.target === el) {
      console.log(e)
      func(e)
    }
  })
}