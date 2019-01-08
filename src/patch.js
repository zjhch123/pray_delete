import _ from './utils'

const PATCHES = {
  REPLACE: Symbol('replace'),
  TEXT: Symbol('text'),
  PROPS: Symbol('props'),
  REORDER: Symbol('reorder'),
}

export { PATCHES }


function dfs(node, patches, index) {
  const currentPatches = patches[index]

  const len = node.childNodes ? node.childNodes.length : 0

  for (let i = 0; i < len; i++) {
    const child = node.childNodes[i]
    index += 1
    dfs(child, patches, index)
  }
  
  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches(node, currentPatches) {
  _.each(currentPatches, (_, patch) => {
    switch (patch.type) {
      case PATCHES.REORDER:
        reorder(node, patch.moves)
        break
      case PATCHES.REPLACE:
        const newNode = 
          typeof patch.item === 'string' 
            ? document.createTextNode(patch.item)
            : patch.item.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case PATCHES.TEXT:
        if (node.textContent) { // 性能更好
          node.textContent = patch.item
        } else {
          node.nodeValue = patch.item
        }
        break
      case PATCHES.PROPS:
        setProps(node, patch.item)
        break
    }
  })
}

function setProps(node, props) {
  for (let key in props) {
    if (typeof props[key] === 'undefined') {
      node.removeAttribute(key)
    } else {
      _.setAttr(node, key, props[key])
    }
  }
}

function reorder(node, moves) {
  _.each(moves, (i, move) => {
    const index = move.index

    switch (move.type) {
      case 0: // remove
        node.removeChild(node.childNodes[index])
        break
      case 1: // insert
        const insertNode = 
         typeof move.item === 'string'
          ? document.createTextNode(move.item)
          : move.item.render()
        node.insertBefore(insertNode, node.childNodes[index] || null)
        break
      case 2: // swap
        const { from, to } = move
        const children = node.childNodes
        node.insertBefore(children[from], children[to])
        node.insertBefore(children[to], children[from])
        break
    }
  })
}

export default function patch(node, patches) {
  let index = 0
  dfs(node, patches, index)
}
