/**
 * 传入一个item(object)和key, 获取 item 内 key 对应的 value
 * @param {object} item 
 * @param {string|function} key 
 */
export function getValueByKey(item, key) {
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
export function getKeyIndexAndNoKeyItem(list, key = 'id') {
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
 * @return {[object]} 返回数组操作集合, 凭借此集合可将老数组转化为新数组
 *         - type = 0, remove
 *         - type = 1, insert
 */
export default function listDiff(oldList, newList, key = 'id') {
  const oldMap = getKeyIndexAndNoKeyItem(oldList, key)
  const newMap = getKeyIndexAndNoKeyItem(newList, key)

  const oldKeyIndex = oldMap.keyIndex
  const newKeyIndex = newMap.keyIndex
  const newNoKey = newMap.noKeyItem

  const moves = []
  const oldCopy = []

  let children = []
  let i = 0
  let noKeyIndex = 0

  for (i = 0; i < oldList.length; i++) {
    const item = oldList[i]
    const itemKey = getValueByKey(item, key)
    if (typeof itemKey !== 'undefined' && itemKey !== null) {
      // itemkey 存在
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        oldCopy.push(null)
      } else {
        const newItemIndex = newList[newKeyIndex[itemKey]]
        oldCopy.push(newList[newItemIndex])
      }
    } else {
      // itemKey 不存在
      oldCopy.push(newNoKey[noKeyIndex ++] || null)
    }
  }

  children = oldCopy.slice(0)

  i = 0

  while (i < oldCopy.length) {
    if (oldCopy[i] === null) {
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
    const oldItem = oldCopy[j]
    const oldItemKey = getValueByKey(oldItem, key)

    if (oldItem) { // 如果老的项存在
      if (oldItemKey === newItemKey) { // 如果正好key值相等
        j += 1
      } else { // key值不相等
        if (!oldKeyIndex.hasOwnProperty(newItemKey)) { // 如果新的key在老数组中不存在
          insert(i, newItem) // 直接插入
        } else {
          const oldNextItemKey = getValueByKey(oldCopy[j + 1], key)
          if (oldNextItemKey === newItemKey) {
            remove(i)
            removeOldCopy(j)
            j += 1
          } else {
            insert(i, newItem)
          }
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

  return {
    moves,
    children
  }
}
