import { VNode } from './vnode'
import { subscribe } from './core/state'
import diff from './diff'
import patch from './patch'

/**
 * 
 * @param {VNode} element 
 * @param {HTMLElement} targetDOM 
 */
export default function render(element, targetDOM) {
  if (element instanceof VNode) {
    const rendered = element.render()
    targetDOM.appendChild(rendered)
    return
  }
  throw new Error('render method need a VNode element but received ' + element + ' !')
}