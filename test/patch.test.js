import v from '../src/vnode'
import diff from '../src/diff'
import patch from '../src/patch'

describe('patch', () => {
  it('can patch', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, '123')
    const n2 = v('div', { style: 'fontSize: 6px' }, '1243')
    const r = diff(n1, n2)
    const node = n1.render()
    patch(node, r)
    expect(node).toEqual(n2.render())
  })

  it('can patch2', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, 
      v('div', { key: 1 }, '1'),
      v('div', { key: 2 }, '2'),
      v('div', { key: 3 }, '3'),
      v('div', { key: 4 }, '4'),
      v('div', { key: 5 }, '5'),
    )
    const n2 = v('div', { style: 'fontSize: 5px' }, 
      v('div', { key: 5 }, '5'),
      v('div', { key: 1 }, '1'),
      v('div', { key: 4 }, '4'),
      v('div', { key: 3 }, '3'),
      v('div', { key: 2 }, '2'),
    )
    const r = diff(n1, n2)
    const node = n1.render()
    patch(node, r)
    expect(node).toEqual(n2.render())
  })

  it('can patch3', () => {
    const n1 = v('div', { style: 'fontSize: 5px' }, 
      v('div', { key: 1 }, '1'),
      v('div', { key: 2 }, '2'),
      v('div', { key: 3 }, '3'),
      v('div', { key: 4 }, '4'),
      v('div', { key: 5 }, '5'),
    )
    const n2 = v('div', { style: 'fontSize: 5px' }, 
      v('div', {}, '666'),
    )
    const r = diff(n1, n2)
    const node = n1.render()
    patch(node, r)
    expect(node).toEqual(n2.render())
  })
})