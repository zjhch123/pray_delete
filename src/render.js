import { VNode } from './vnode'
import { transferVNodeTree } from './core/element'
import { subscribe } from './core/state'
import diff from './diff'
import patch from './patch'

let lastMountedVNode = null

/**
 * 
 * @param {VNode} element 
 * @param {HTMLElement} targetDOM 
 */
export default function render(element, targetDOM) {
  console.log(element)
  if (element instanceof VNode) {
    lastMountedVNode = transferVNodeTree(element)
    const rendered = lastMountedVNode.render()
    targetDOM.append(rendered)

    subscribe(() => {
      const nextMountedVNode = transferVNodeTree(element)
      const patches = diff(lastMountedVNode, nextMountedVNode)

      patch(rendered, patches)

      lastMountedVNode = nextMountedVNode
    })
    return
  }
  throw new Error('render method need a VNode element but received ' + element + ' !')
}