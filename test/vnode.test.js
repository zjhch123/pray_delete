import v from '../src/vnode'
import _ from '../src/utils'

function walkVNode (root, func) {
  let index = 0
  function walk (root, func) {
    func(index, root)
    root.children && root.children.forEach(function (child) {
      index ++
      walk(child, func)
    })
  }
  walk(root, func)
}

function walkDOM (root, func) {
  let index = 0
  var walk_the_DOM = function(node, func) {
    func(index++, node);
    node = node.firstChild;
    while(node) {
      walk_the_DOM(node, func);
      node = node.nextSibling;
    }
  };
  walk_the_DOM(root, func)
}

describe('vnode', () => {
  it('should create virtual dom', () => {
    const vdom = v('div', null, 
      v('h1', { style: "font-size: 12px" }, 'hahaha'),
      v('p', null, 'lalala'),
      v('div', null, 
        v('div', null, 
          v('span', null, 'bobo'),
          v('img', { src: 'http://xxx.png' })
        )
      ),
    )

    expect(vdom.count).toBe(9)

    let count = 0
    walkVNode(vdom, (index, element) => {
      switch(index) {
        case 0: expect(element.type).toBe('div'); count += 1; break
        case 1: 
          expect(element.type).toBe('h1'); 
          expect(element.props.style).toBe('font-size: 12px'); 
          expect(element.children[0].props.text).toBe('hahaha'); 
          count += 1;
          break;
        case 3: 
          expect(element.type).toBe('p'); 
          expect(element.children[0].props.text).toBe('lalala');
          count += 1;
          break
        case 5: expect(element.type).toBe('div'); count += 1; break
        case 6: expect(element.type).toBe('div'); count += 1; break
        case 7: 
          expect(element.type).toBe('span'); 
          expect(element.children[0].props.text).toBe('bobo');
          count += 1;
          break
        case 9: expect(element.type).toBe('img'); expect(element.props.src).toBe('http://xxx.png'); count += 1; break
      }
    })
    expect(count).toBe(7) // 确保经过了每一个分支
  })

  it('can render to really dom', () => {
    const vdom = v('div', null, 
      v('h1', { style: "font-size: 12px" }, 'hahaha'),
      v('p', null, 'lalala'),
      v('div', null, 
        v('div', null, 
          v('span', null, 'bobo'),
          v('img', { src: 'http://www.baidu.com/1.png' })
        )
      ),
    )

    const dom = vdom.render()
    let count = 0
    walkDOM(dom, (index, element) => {
      switch(index) {
        case 0: 
          expect(element.tagName).toBe('DIV'); 
          count += 1;
          break
        case 1: 
          expect(element.tagName).toBe('H1'); 
          expect(element.style.cssText).toBe('font-size: 12px;'); 
          count += 1;
          break;
        case 2:
          expect(element.nodeValue).toBe('hahaha');
          count += 1;
          break
        case 3: 
          expect(element.tagName).toBe('P'); 
          count += 1;
          break
        case 4:
          expect(element.nodeValue).toBe('lalala');
          count += 1;
          break
        case 5: 
          expect(element.tagName).toBe('DIV'); 
          count += 1;
          break
        case 6: 
          expect(element.tagName).toBe('DIV'); 
          count += 1;
          break
        case 7: 
          expect(element.tagName).toBe('SPAN'); 
          count += 1;
          break
        case 8:
          expect(element.nodeValue).toBe('bobo');
          count += 1;
          break;
        case 9: 
          expect(element.tagName).toBe('IMG'); 
          expect(element.src).toBe('http://www.baidu.com/1.png'); 
          count += 1;
          break
      }
    })
    expect(count).toBe(10) // 确保经过了每一个分支
  })

  it('can compare', () => {
    const a = v('div', {key: 1})
    const b = v('div', {key: 1})
    const c = v('div', {key: 2})
    const d = v('img', {key: 1})
    expect(a.compare(b)).toBeTruthy()
    expect(a.compare(c)).not.toBeTruthy()
    expect(a.compare(d)).not.toBeTruthy()
  })
})