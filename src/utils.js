const optc = (o) => Object.prototype.toString.call(o)

export default {
  /**
   * 
   * @param {Array} arrayLike 
   * @param {(index, node) -> void} cb 
   */
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
      case 'className':
        el.setAttribute('class', propValue)
        break
      case 'key':
        el.setAttribute('data-pray-key', propValue)
        break
      default:
        el.setAttribute(propName, propValue)
        break
    }
  },
  isNumberOrString(obj) {
    const type = optc(obj)
    return type === '[object Number]' || type === '[object String]'
  },
  isNotNull(a) {
    return typeof a !== 'undefined' && a !== null
  },
  flatArr(arr) {
    return arr.reduce((prev, next) => {
      return prev.concat(Array.isArray(next) ? this.flatArr(next) : next)
    }, [])
  }
}