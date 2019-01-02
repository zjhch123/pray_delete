import listDiff from '../src/listDiff'

/**
 * 乱序传入的数组, 并且会随机删除某些值
 */
function shuffle(a) {
  const aa = a.slice(0)
  for (let i = aa.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [aa[i - 1], aa[j]] = [aa[j], aa[i - 1]];
  }

  let countTimes = parseInt(Math.random() * aa.length)

  while (countTimes > 0) {
    const yes = Math.random()

    if (yes > 0.5) {
      aa.splice(parseInt(Math.random() * aa.length), 1)
    }

    countTimes -= 1
  }

  return aa;
}

/**
 * 生成一个长度为100的数组, 内容为{id: x}或者{type: xxx}
 */
function generateList() {
  const length = parseInt(Math.random() * 100)
  const ret = []

  for (let i = 0; i < length; i++) {
    if (Math.random() > 0.5) {
      ret.push({key: i})
    } else {
      ret.push({type: Math.random().toString(36).substring(2)})
    }
  }

  return ret
}

describe('listDiff', () => {
  it('should execute list diff', () => {
    // 随机生成1000个数组, 随机制作1000个数组的拷贝，进行diff
    // 用数量战胜测试覆盖率
    for (let i = 0; i < 100; i++) {
      const l1 = generateList()
      const l2 = shuffle(l1)
      const ret = listDiff(l1, l2, 'key')

      ret.forEach(result => {
        switch (result.type) {
          case 0: // 删除
            l1.splice(result.index, 1)
            break
          case 1: // 插入
            l1.splice(result.index, 0, result.item)
            break
        }
      })

      expect(l1).toEqual(l2)
    }
  })
})