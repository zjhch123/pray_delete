import { setAttr } from './core/attr'
import _ from './utils'

export class VNode {
  /**
   * 
   * @param {String|Function} type 
   * @param {VNodeProp} props 
   * @param {[VNode|String]} children 
   */
  constructor(type, props, children) {
    this.type = type
    this.props = props === null ? {} : props
    this.children = children || []

    this.count = 0

    this.key = this.props.key // 用于diff

    _.each(this.children, (index, item) => {
      if (item instanceof VNode) {
        this.count += item.count
      } else {
        this.children[index] = '' + item
      }
      this.count += 1
    })
  }

  /**
   * @return {HTMLElement}
   */
  render() {
    const el = document.createElement(this.type)
    const props = this.props

    for (let propName in props) {
      const propValue = props[propName]
      setAttr(el, propName, propValue)
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      if (child instanceof VNode) {
        el.appendChild(child.render())
      } else {
        el.appendChild(
          document.createTextNode(child)
        )
      }
    }

    return el
  }

  /**
   * 只比较type和key是否相等
   * @param {VNode|String} otherNode 
   */
  compare(otherNode) {
    return otherNode instanceof VNode ? otherNode.type === this.type && otherNode.key === this.key : false
  }

  original() {
    return new VNode(this.type, this.props, this.children)
  }
}

/**
 * @param {string} type 
 * @param {VNodeProp} props 
 * @param  {[VNode|String]} children 
 * @return {VNode}
 */
export default function vnode(type, props, ...children) {
  return new VNode(type, props, _.flatArr(children))
}
