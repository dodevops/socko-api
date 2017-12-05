import { Node } from 'js-hierarchy'

export class InvalidMergeNode extends Error {

  constructor (originalNode: Node, mergeNode: Node) {
    super(`Node with name ${originalNode.name} can not be merged with ${mergeNode.name}`)
  }
}
