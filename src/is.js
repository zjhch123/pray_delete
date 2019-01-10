const optc = (o) => Object.prototype.toString.call(o)

const isNumber = (obj) => {
  return optc(obj) === '[object Number]'
}

const isString = (obj) => {
  return optc(obj) === '[object String]'
}

const isNumberOrString = (obj) =>{
  return isString(obj) || isNumber(obj)
}

const isNotNull = (a) => {
  return typeof a !== 'undefined' && a !== null
}

const isFunction = (obj) => {
  return optc(obj) === '[object Function]'
}

export {
  isNumberOrString,
  isNotNull,
  isFunction,
}