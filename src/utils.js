export default {
  each(arrayLike, cb) {
    for (let i = 0; i < arrayLike.length; i++) {
      if (!!cb(i, arrayLike[i], arrayLike)) {
        break
      }
    }
  },
  setAttr(el, propName, propValue) {
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
      default:
        el.setAttribute(propName, propValue)
        break
    }
  }
}