import { VNode } from './vnode'
import { subscribe } from './useState'
import diff from './diff'
import patch from './patch'

let rendered = null

/**
 * 
 * @param {VNode|String} element 
 * @param {HTMLElement} targetDOM 
 */
export default function render(element, targetDOM) {
  if (element instanceof VNode) {
    rendered = element.render()
    targetDOM.appendChild(rendered)
    subscribe((preVNode, nextVNode) => {
      const patches = diff(preVNode, nextVNode)
      patch(rendered, patches)
    })
    return
  }
  throw new Error('render method need a VNode element but received ' + element + ' !')
}