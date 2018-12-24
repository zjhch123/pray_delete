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
  var walk_the_DOM = function walk(node, func) {
    func(index++, node);
    node = node.firstChild;
    while(node) {
      walk(node, func);
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

    walkVNode(vdom, (index, element) => {
      switch(index) {
        case 0: expect(element.type).toBe('div'); break
        case 1: 
          expect(element.type).toBe('h1'); 
          expect(element.props.style).toBe('font-size: 12px'); 
          expect(element.children[0]).toBe('hahaha'); 
          break;
        case 3: 
          expect(element.type).toBe('p'); 
          expect(element.children[0]).toBe('lalala');
          break
        case 5: expect(element.type).toBe('div'); break
        case 6: expect(element.type).toBe('div'); break
        case 7: 
          expect(element.type).toBe('span'); 
          expect(element.children[0]).toBe('bobo');
          break
        case 9: expect(element.type).toBe('img'); expect(element.props.src).toBe('http://xxx.png'); break
      }
    })
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
    walkDOM(dom, (index, element) => {
      switch(index) {
        case 0: 
          expect(element.tagName).toBe('DIV'); 
          break
        case 1: 
          expect(element.tagName).toBe('H1'); 
          expect(element.style.cssText).toBe('font-size: 12px;'); 
          break;
        case 2:
          expect(element.nodeValue).toBe('hahaha');
          break
        case 3: 
          expect(element.tagName).toBe('P'); 
          break
        case 4:
          expect(element.nodeValue).toBe('lalala');
          break
        case 5: 
          expect(element.tagName).toBe('DIV'); 
          break
        case 6: 
          expect(element.tagName).toBe('DIV'); 
          break
        case 7: 
          expect(element.tagName).toBe('SPAN'); 
          break
        case 8:
          expect(element.nodeValue).toBe('bobo');
          break;
        case 9: 
          expect(element.tagName).toBe('IMG'); 
          expect(element.src).toBe('http://www.baidu.com/1.png'); 
          break
      }
    })
  })
})