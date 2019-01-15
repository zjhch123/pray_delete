import { isFunction } from '../is'
import vnode, { VNode } from '../vnode'
import { memorizeHookState } from './hook'

export default function createElement(type, props, ...children) {
  return vnode(type, props, children)
}

export function transferVNodeTree(root) {
  let el = null
  if (root instanceof VNode) {
    if (isFunction(root.type)) {
      el = functionalComponent(root.type, root.props)
    } else if (root.type instanceof VNode) {
      el = root.type
    } else {
      el = root
    }
  } else {
    return root
  }

  let children = []

  for (let i = 0; i < el.children.length; i++) {
    children.push(transferVNodeTree(el.children[i]))
  }

  el.children = children
  return el
}

function functionalComponent(generateFunction, props) {
  const node = memorizeHookState(generateFunction)(props)
  return node
}