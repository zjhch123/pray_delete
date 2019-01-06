import listDiff2 from '../src/listDiff2'

const transfer = (arr, moves) => {
  moves.forEach(move => {
    switch (move.type) {
      case 0:
        arr.splice(move.index, 1)
        break
      case 1:
        arr.splice(move.index, 0, move.item)
        break
      case 2:
        const { from, to } = move;
        [arr[from], arr[to]] = [arr[to], arr[from]];
        break
    }
  })
}

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
 * 生成一个长度随机且小于100的数组, 内容为{id: x}
 */
function generateList() {
  const length = parseInt(Math.random() * 100)
  const ret = []

  for (let i = 0; i < length; i++) {
    ret.push({key: i})
  }

  return ret
}

describe('listDiff2', () => {
  it('can diff normal', () => {
    const a = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
    ]
    const b = [
      {id: 4},
      {id: 2},
      {id: 1},
      {id: 3},
      {id: 8},
      {id: 6},
      {id: 5},
      {id: 7},
    ]

    const ret = listDiff2(a, b)

    expect(ret.children).toEqual([
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
    ])

    const moves = ret.moves
    transfer(a, moves)

    expect(a).toEqual(b)
  })

  it('can diff normal2', () => {
    const a = [0,1,2,3,4,5,6,7,8,9]
    const b = [4,1,6,8,3,5,0,9]

    const ret = listDiff2(a, b, (item) => item)

    expect(ret.children).toEqual([0, 1, null, 3, 4, 5, 6, null, 8, 9])

    const moves = ret.moves
    transfer(a, moves)

    expect(a).toEqual(b)
  })

  it('can diff with cut', () => {
    const a = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
    ]
    const b = [
      {id: 4},
      {id: 2},
      {id: 1},
      {id: 3},
    ]

    const ret = listDiff2(a, b)

    expect(ret.children).toEqual([{id: 1},{id: 2},{id: 3},{id: 4},null,null,null,null])

    const moves = ret.moves
    transfer(a, moves)

    expect(a).toEqual(b)
  })

  it('can diff with add', () => {
    const a = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
    ]
    const b = [
      {id: 4},
      {id: 2},
      {id: 1},
      {id: 3},
      {id: 8},
      {id: 6},
      {id: 5},
      {id: 7},
    ]

    const ret = listDiff2(a, b)

    const moves = ret.moves
    transfer(a, moves)

    expect(a).toEqual(b)
  })


  it('can diff with no key', () => {
    const a = ['a', 'b', 'c', 'd', 'e']
    const b = ['c', 'd', 'e', 'a', 'g', 'h', 'j']

    const ret = listDiff2(a, b)

    const moves = ret.moves

    transfer(a, moves)

    expect(a).toEqual(['a', 'b', 'c', 'd', 'e', 'h', 'j'])
  })

  it('can not diff with no key', () => {
    const a = [
      {type: 4},
    ]
    const b = [
      {type: 5},
    ]

    const ret = listDiff2(a, b, 'id')

    const moves = ret.moves

    transfer(a, moves)

    expect(a).toEqual([{type: 4}])
  })

  it('random diff test', () => {
    for (let i = 0; i < 100; i++) {
      const a = generateList()
      const b = shuffle(a)

      const ret = listDiff2(a, b, 'key')

      const moves = ret.moves

      transfer(a, moves)
      expect(a).toEqual(b)
    }
  })
})