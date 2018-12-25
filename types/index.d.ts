declare class VNode {
  constructor(type: string, props: object, children: [any])
  type: string
  props: object
  children: []
  render(): HTMLElement
}

declare module "vnode" {
  export default function(type: string, props: object, children: [any]): VNode
}

declare module "patch" {
  export namespace PATCHES {
    const REPLACE: Symbol
    const TEXT: Symbol
    const PROPS: Symbol
  }
}