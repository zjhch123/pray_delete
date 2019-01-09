import _ from './utils'

/**
 * 传入一个item(object)和key, 获取 item 内 key 对应的 value
 * @param {Object} item 
 * @param {String|Function} key 
 * @return {any} value
 */
function getValueByKey(item, key) {
  if (!_.isNotNull(item) || !_.isNotNull(key)) { return undefined }
  return typeof key === 'string' ? item[key] : key(item)
}

/**
 * 传入 ([{id: 4},{id: 2},{id: 1},{id: 3}, {item: 5}], 'id')
 * 返回 {keyIndex: {4: 0, 1: 2, 2: 1, 3: 3}, noKeyItem: [{item: 5}]}
 * keyIndex 指的是 key 与其对应的 Index 的 object
 * noKeyItem 指的是 list 中没有 key 的项
 * @param {Array} list 
 * @param {String|Function} key 
 * @return {Object}
 *            - keyIndex: Object
 *            - noKeyItem: Array
 */
function getKeyIndexAndNoKeyItem(list, key = 'id') {
  const keyIndex = {}
  const noKeyItem = []

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const itemKey = getValueByKey(item, key)

    if (_.isNotNull(itemKey)) {
      keyIndex[itemKey] = i
    } else {
      noKeyItem.push(item)
    }
  }

  return {
    keyIndex: keyIndex,
    noKeyItem, noKeyItem,
  }
}


function listDiff(oldArray, newArray, key = 'id') {
  const newMap = getKeyIndexAndNoKeyItem(newArray, key)
  
  const newKeyIndex = newMap.keyIndex
  const newNoKeyItem = newMap.noKeyItem
  const moves = []
  const children = []

  let noKeyIndex = 0
  let i = 0

  // 生成一个和oldArray等长的比较数组，
  // 其中新数组中不存在的项删除、新数组中没有key的项插入
  for (i = 0; i < oldArray.length; i++) {
    const oldItem = oldArray[i]
    const oldItemKey = getValueByKey(oldItem, key)

    if (_.isNotNull(oldItemKey)) {
      if (newKeyIndex.hasOwnProperty(oldItemKey)) {
        const newItemIndex = newKeyIndex[oldItemKey]
        children.push(newArray[newItemIndex])
      } else {
        children.push(null)
      }
    } else {
      children.push(newNoKeyItem[noKeyIndex++] || null)
    }
  }

  const simulate = children.slice(0)
  i = 0

  // 删除不存在的项
  while(i < simulate.length) {
    if (simulate[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i += 1
    }
  }

  let j = i = 0 // j指向新数组, i指向老数组
  let offset = 0 // 偏移量, insert之后有用

  const simulateKeyIndex = getKeyIndexAndNoKeyItem(simulate, key).keyIndex

  while (j < newArray.length) {
    const newItem = newArray[j]
    const newItemKey = getValueByKey(newItem, key)
    const oldItem = simulate[i]
    const oldItemKey = getValueByKey(oldItem, key)

    if (_.isNotNull(oldItem)) {
      if (oldItemKey === newItemKey) {
        i += 1
      } else {
        if (simulateKeyIndex.hasOwnProperty(newItemKey)) {
          const oldTargetIndex = simulateKeyIndex[newItemKey]
          swap(i + offset, oldTargetIndex + offset)
          swapSimulate(i, oldTargetIndex, oldItemKey, newItemKey)
          i += 1
        } else {
          insert(j, newItem)
          offset += 1
        }
      }
    } else { 
      insert(j, newItem)
      offset += 1
    }
    j += 1
  }

  const restNum = simulate.length - i
  for (let k = 0; k < restNum; k++) {
    remove(j)
    removeSimulate(j)
  }

  function removeSimulate(index) {
    simulate.splice(index, 1)
  }

  function remove(index) {
    moves.push({ type: 0, index })
  }

  function insert(index, item) {
    moves.push({ type: 1, index, item })
  }

  function swapSimulate(from, to, oldItemKey, newItemKey) { // 不止要交换项，还要交换keyIndex内的值
    [
      simulate[from], 
      simulate[to]
    ] = [
      simulate[to], 
      simulate[from]
    ];

    [
      simulateKeyIndex[oldItemKey],
      simulateKeyIndex[newItemKey]  
    ] = [
      simulateKeyIndex[newItemKey],
      simulateKeyIndex[oldItemKey]
    ];
  }

  function swap(from, to) {
    moves.push({type: 2, from, to})
  }

  return {
    moves: moves,
    children: children
  }
}

export default listDiff