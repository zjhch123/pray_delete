/**
 * 传入一个item(object)和key, 获取 item 内 key 对应的 value
 * @param {object} item 
 * @param {string|function} key 
 */
function getValueByKey(item, key) {
  if (!item || !key) { return undefined }
  return typeof key === 'string' ? item[key] : key(item)
}

/**
 * 传入 ([{id: 4},{id: 2},{id: 1},{id: 3}, {item: 5}], 'id')
 * 返回 {keyIndex: {4: 0, 1: 2, 2: 1, 3: 3}, noKeyItem: [{item: 5}]}
 * keyIndex 指的是 key 与其对应的 Index 的 object
 * noKeyItem 指的是 list 中没有 key 的项
 * @param {array} list 
 * @param {string|function} key 
 * @return {object} { keyIndex: {}, noKeyItem: [] }
 */
function getKeyIndexAndNoKeyItem(list, key = 'id') {
  const keyIndex = {}
  const noKeyItem = []

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const itemKey = getValueByKey(item, key)

    if (!!itemKey) {
      keyIndex[itemKey] = i
    } else {
      noKeyItem.push(item)
    }
  }

  return {
    keyIndex,
    noKeyItem,
  }
}

/**
 * 数组diff
 * @param {array} oldList 老数组
 * @param {array} newList 新数组
 * @param {string|function} key 数组内项的id
 * @return {object} 返回数组操作集合, 凭借此集合可将老数组转化为新数组
 *         - type = 0, remove
 *         - type = 1, insert
 */
export default function listDiff(oldList, newList, key = 'id') {
  const newMap = getKeyIndexAndNoKeyItem(newList, key)
  const newKeyIndex = newMap.keyIndex

  const moves = []
  const oldCopy = []

  let i = 0

  for (i = 0; i < oldList.length; i++) {
    const item = oldList[i]
    const itemKey = getValueByKey(item, key)
    if (!itemKey || !newKeyIndex.hasOwnProperty(itemKey)) {
      oldCopy.push(null)
    } else {
      oldCopy.push(item)
    }
  }

  i = 0

  while (i < oldCopy.length) {
    const item = oldCopy[i]
    if (item === null) {
      remove(i)
      removeOldCopy(i)
    } else {
      i++
    }
  }

  let j = i = 0 // j - 老数组的指针, i - 新数组的指针

  while (i < newList.length) {
    const newItem = newList[i]
    const newItemKey = getValueByKey(newItem, key)
    
    if (!newItemKey) {
      insert(i, newItem)
      i += 1
      continue
    }

    const oldItem = oldCopy[j]
    const oldItemKey = getValueByKey(oldItem, key)
    if (oldItem) { // 如果老的项存在
      if (oldItemKey === newItemKey) { // 如果正好key值相等
        j += 1
      } else { // key值不相等
        const oldNextItemKey = getValueByKey(oldCopy[j + 1], key)
        if (oldNextItemKey === newItemKey) {
          remove(i)
          removeOldCopy(j)
          j += 1
        } else {
          insert(i, newItem)
        }
      }
    } else { // 如果老的项不存在, 直接插入
      insert(i, newItem)
    }
    i += 1
  }

  let restNum = oldCopy.length - j

  for (let k = 0; k < restNum; k++) {
    remove(i)
  }

  function removeOldCopy(index) {
    oldCopy.splice(index, 1)
  }

  function remove(index) {
    moves.push({ type: 0, index })
  }

  function insert(index, item) {
    moves.push({ type: 1, index, item })
  }

  return moves
}
