import _ from './utils'
import { PATCHES } from './patch'
import listDiff from './listDiff'

/**
 * @param {VNode} oldTree 
 * @param {VNode} newTree 
 */
export default function (oldTree, newTree) {
  const patches = []
  let index = 0
  return dfsWalk(oldTree, newTree, index, patches)
}

/**
 * 
 * @param {VNode} oldNode 
 * @param {VNode} newTree 
 * @param {number} index 
 * @param {array} patches 
 */
function dfsWalk(oldNode, newNode, index, patches) {
  const currentNodePatches = []

  if (oldNode instanceof VNode && newNode instanceof VNode) {
    // 如果都是虚拟DOM
    const oldTag = oldNode.type
    const newTag = oldNode.type
    if (oldTag !== newTag) { // tag不同
      currentNodePatches.push({
        type: PATCHES.REPLACE,
        index,
        item: newNode
      })
    } else { // tag相同, 对比 props 和 children
      diffAttrs(oldNode.props, newNode.props, currentNodePatches) // 对比props
      diffChildren(oldNode.children, newNode.children, currentNodePatches) // 对比children
    }
  } else {
    // 如果类型不同
    if (_.isNumberOrString(oldNode) && _.isNumberOrString(newNode)) { // 如果都是简单类型
      if (oldNode != newNode) { // 那就进行简单的判断
        currentNodePatches.push({
          type: PATCHES.TEXT,
          item: newNode
        })
      }
    } else { // 如果不都是简单类型，那就不做太多操作，直接替换
      currentNodePatches.push({
        type: PATCHES.REPLACE,
        item: newNode
      })
    }
  }

  if (currentNodePatches.length > 0) {
    patches[index] = currentNodePatches
  }
}

function diffAttrs(oldProps, newProps, currentNodePatches) {

}

function diffChildren(oldChildren, newChildren, currentNodePatches) {

}