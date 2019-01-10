import { VNode } from './vnode'
/**
 * 
 * @param {VNode|String} element 
 * @param {HTMLElement} targetDOM 
 */
export default function render(element, targetDOM) {
  if (element instanceof VNode) {
    targetDOM.appendChild(element.render())
  } else if (window.HTMLElement && element instanceof window.HTMLElement) {
    targetDOM.appendChild(element)
  } else {
    const node = document.createTextNode(element)
    targetDOM.appendChild(node)
  }
}