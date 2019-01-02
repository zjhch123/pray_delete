import v from '../src/vnode'
import diff from '../src/diff'
import { PATCHES } from '../src/patch'

describe('diff!', () => {
  it('can diff', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, '123')
    const n2 = v('div', { style: 'fontSize: 6px' }, '1243')


    const result = diff(n1, n2)

    expect(result[0].length).toBe(2)
    expect(result[0][0].type).toBe(PATCHES.PROPS)
    expect(result[0][1].type).toBe(PATCHES.REORDER)
  })
})