import { Node } from 'js-hierarchy'
import { AbstractError } from './AbstractError'

/**
 * The given input tree doesn't start with a root node
 */
export class NeedRootNodeError extends AbstractError {

  constructor (node: Node) {
    super(`Node with name ${node.name} is not a root node`)
  }
}
