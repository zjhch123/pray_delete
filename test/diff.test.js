import v from '../src/vnode'
import diff from '../src/diff'
import { PATCHES } from '../src/patch'

describe('diff!', () => {
  it('can diff', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, '123')
    const n2 = v('div', { style: 'fontSize: 6px' }, '1243')


    const result = diff(n1, n2)

    expect(result[0][0].type).toBe(PATCHES.PROPS)
    expect(result[0][0].item).toEqual({style: 'fontSize: 6px'})
    expect(result[1][0].type).toBe(PATCHES.TEXT)
    expect(result[1][0].item).toBe('1243')
  })

  it('can diff2', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, 
      v('img', { src: 'http://www.baidu.com' })
    )
    const n2 = v('div', { style: 'fontSize: 5px' }, 
      v('img', { src: 'http://www.google.com', style: 'display: block' })
    )


    const result = diff(n1, n2)

    expect(result[1][0].type).toBe(PATCHES.PROPS)
    expect(result[1][0].item).toEqual({style: 'display: block', src: 'http://www.google.com'})
  })

  it('can diff3', () => {
    const n1 = v('div', null, 
      v('p', { key: 0 }, '0'),
      v('p', { key: 1 }, '1'),
    )
    const n2 = v('div', null, 
      v('p', { key: 5 }, '5'),
      v('p', { key: 1 }, '1'),
    )

    const result = diff(n1, n2)
    expect(result[0][0].type).toBe(PATCHES.REORDER)
  })
})