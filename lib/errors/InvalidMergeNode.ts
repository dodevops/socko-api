/**
 * @module socko-api
 */
/**
 */

import { Node } from 'js-hierarchy'
import { AbstractError } from './AbstractError'

/**
 * Two nodes with different names should've been merged. This shouldn't usually happen.
 */
export class InvalidMergeNode extends AbstractError {

  constructor (originalNode: Node, mergeNode: Node) {
    super(`Node with name ${originalNode.name} can not be merged with ${mergeNode.name}`)
  }
}
