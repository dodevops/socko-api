import { Node } from 'js-hierarchy'

export class NeedRootNodeError extends Error {

  constructor (node: Node) {
    super(`Node with name ${node.name} is not a root node`)
  }
}
