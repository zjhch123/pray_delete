import { isFunction } from '../is'
import vnode from '../vnode'
import { memorizeHookState } from './hook'

export default function createElement(type, props, ...children) {
  return (
    isFunction(type) 
      ? functionalComponent(type, props) 
      : normalComponent(type, props, children)
  )
}

function functionalComponent(generateFunction, props) {
  const node = memorizeHookState(generateFunction)(props)
  node.original = () => {
    return functionalComponent(generateFunction, props)
  }
  return node
}

function normalComponent(type, props, children) {
  return vnode(type, props, children)
}