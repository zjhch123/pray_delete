import _ from './utils'

/**
 * @class VNode
 */
export class VNode {
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
        this.children[index] = new VNode('text', { key: `@key_textNode_${this.count}_${index}_${item}`, text: item })
      }
      this.count += 1
    })
  }

  render() {
    if (this.type === 'text') {
      const el = document.createTextNode(this.props.text)
      return el
    }

    const el = document.createElement(this.type)
    const props = this.props

    for (let propName in props) {
      const propValue = props[propName]
      _.setAttr(el, propName, propValue)
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      el.appendChild(child.render())
    }

    return el
  }

  /**
   * 只比较type和key是否相等
   * @param {VNode} otherNode 
   */
  compare(otherNode) {
    return otherNode instanceof VNode ? otherNode.type === this.type && otherNode.key === this.key : false
  }
}

/**
 * @param {string} type 
 * @param {object} props 
 * @param  {array} children 
 * @return {VNode}
 */
export default function (type, props, ...children) {
  return new VNode(type, props, children)
}