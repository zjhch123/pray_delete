import { isNumberOrString } from './is'
import _ from './utils'
import { VNode } from './vnode'
import { PATCHES } from './patch'
import listDiff from './listDiff'

/**
 * @param {VNode} oldTree 
 * @param {VNode} newTree 
 * @return {PatchItem}
 */
export default function diff(oldTree, newTree) {
  const patches = {}
  let index = 0
  dfsWalk(oldTree, newTree, index, patches)

  return patches
}

/**
 * 
 * @param {VNode} oldNode 
 * @param {VNode} newTree 
 * @param {Number} index 
 * @param {PatchItem} patches 
 */
function dfsWalk(oldNode, newNode, index, patches) {
  const currentNodePatches = []

  if (newNode === null) {
    // TODO ?
  } else if (isNumberOrString(oldNode) && isNumberOrString(newNode)) { // 如果都是简单类型
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
 * @param {Object} oldProps 
 * @param {Object} newProps 
 * @param {[PatchDetail]} currentNodePatches 
 */
function diffAttrs(oldProps, newProps, currentNodePatches) {
  const diffResult = {}
  let count = 0

  // 查找修改、删除
  for (let key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      diffResult[key] = newProps[key]
      count += 1
    }
  }

  // 查找新增
  for (let key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
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
 * @param {Number} index
 * @param {[PatchDetail]} currentNodePatches 
 * @param {PatchItem} patches 
 */
function diffChildren(oldChildren, newChildren, index, currentNodePatches, patches) {
  const {
    moves,
    children,
  } = listDiff(oldChildren, newChildren, 'key')

  if (moves.length !== 0) {
    currentNodePatches.push({
      type: PATCHES.REORDER,
      moves
    })
  }

  let leftNode = null
  let currentNodeIndex = index

  newChildren = children

  _.each(oldChildren, function(index, child) {
    const newChild = newChildren[index]

    currentNodeIndex = (leftNode && leftNode.count )
      ? leftNode.count + currentNodeIndex + 1
      : currentNodeIndex + 1

    leftNode = child

    dfsWalk(child, newChild, currentNodeIndex, patches)
  })
}