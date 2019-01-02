import _ from './utils'
import { VNode } from './vnode'
import { PATCHES } from './patch'
import listDiff, { getKeyIndexAndNoKeyItem } from './listDiff'

/**
 * @param {VNode} oldTree 
 * @param {VNode} newTree 
 */
export default function (oldTree, newTree) {
  const patches = {}
  let index = 0
  dfsWalk(oldTree, newTree, index, patches)

  return patches
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

  if (newNode === null) {
    // TODO ?
  } else if (_.isNumberOrString(oldNode) && _.isNumberOrString(newNode)) { // 如果都是简单类型
    if (oldNode != newNode) { // 那就进行简单的判断
      currentNodePatches.push({
        type: PATCHES.TEXT,
        item: newNode
      })
    }
  } else if (oldNode instanceof VNode && newNode instanceof VNode) {
    // 如果都是虚拟DOM
    if (!oldNode.compare(newNode)) { // 浅比较不同
      currentNodePatches.push({
        type: PATCHES.REPLACE,
        index,
        item: newNode
      })
    } else { // tag相同, 对比 props 和 children
      diffAttrs(oldNode.props, newNode.props, currentNodePatches) // 对比props
      diffChildren(oldNode.children, newNode.children, index, currentNodePatches, patches) // 对比children
    }
  } else {
    // 这么复杂？直接替换
    currentNodePatches.push({
      type: PATCHES.REPLACE,
      item: newNode
    })
  }

  if (currentNodePatches.length > 0) {
    patches[index] = currentNodePatches
  }
}

/**
 * @param {object} oldProps 
 * @param {object} newProps 
 * @param {array} currentNodePatches 
 */
function diffAttrs(oldProps, newProps, currentNodePatches) {
  const diffResult = {}
  let count = 0

  for (let key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      diffResult[key] = newProps[key]
      count += 1
    }
  }

  for (let key in newProps) {
    if (typeof oldProps[key] === 'undefined') {
      diffResult[key] = newProps[key]
      count += 1
    }
  }

  if (count > 0) {
    currentNodePatches.push({
      type: PATCHES.PROPS,
      item: diffResult
    })
  }
}

/**
 * @param {[VNode]} oldChildren 
 * @param {[VNode]} newChildren 
 * @param {array} currentNodePatches 
 * @param {array} patches 
 */
function diffChildren(oldChildren, newChildren, index, currentNodePatches, patches) {
  const moves = listDiff(oldChildren, newChildren, 'key')

  if (moves.length !== 0) {
    currentNodePatches.push({
      type: PATCHES.REORDER,
      moves
    })
  }

  let leftNode = null
  let currentNodeIndex = index

  const newChildrenKeyIndex = getKeyIndexAndNoKeyItem(newChildren, 'key').keyIndex
  const newChildrenFiltered = []

  for (let i = 0; i < oldChildren.length; i++) { // 筛选出需要比较的
    const item = oldChildren[i]
    const itemKey = item.key
    if (typeof itemKey !== 'undefined' && newChildrenKeyIndex.hasOwnProperty(itemKey)) {
      newChildrenFiltered.push(newChildren[newChildrenKeyIndex[itemKey]])
    } else {
      newChildrenFiltered.push(null)
    }
  }

  _.each(oldChildren, function(index, node) {
    currentNodeIndex = (leftNode && leftNode.count )
      ? leftNode.count + currentNodeIndex + 1
      : currentNodeIndex + 1
    leftNode = node
    dfsWalk(node, newChildrenFiltered[index], index, patches)
  })
}