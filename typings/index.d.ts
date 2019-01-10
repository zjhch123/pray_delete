declare interface VNodeProp {
  [propsName: String]: String
}

declare class VNode {
  constructor(type: String, props: VNodeProp, children: [any])
  type: String
  props: Object
  children: []
  render(): HTMLElement
  compare(otherNode:VNode): Boolean
}

declare interface PATCHES {
  REPLACE: Symbol,
  TEXT: Symbol,
  PROPS: Symbol,
  REORDER: Symbol
}

declare interface PatchDetail {
  type: PATCHES,
  index: Number|null,
  item: VNode|String,
  moves: [ListPatchDetail],
}

declare interface PatchItem {
  [index: number]: [PatchDetail]
}

declare interface ListPatchDetail {
  type: Number,
  index: Number|null,
  item: any,
  from: Number,
  to: Number,
}

declare interface ListPatches {
  moves: [ListPatchDetail]
  children: Array
}

declare module vnode {
  export default function vnode(type: String, props: VNodeProp, children: [VNode|String]): VNode
}

declare module patch {
  export default function patch(node: HTMLElement, patches: PatchItem): void
}

declare module listDiff {
  export default function listDiff(oldArray: Array, newArray: Array, key: String): ListPatches
}

declare module diff {
  export default function diff(oldTree: VNode, newTree: VNode): PatchItem
}