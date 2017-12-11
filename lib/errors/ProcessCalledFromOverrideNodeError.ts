/**
 * @module socko-api
 */
/**
 */

import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { AbstractError } from './AbstractError'

/**
 * A process call started in a node of the hierarchy tree, that was eligible for the [[OverrideProcessor]]
 */
export class ProcessCalledFromOverrideNodeError extends AbstractError {

  constructor (node: SockoNodeInterface) {
    super(`Process was called from an override eligible node: ${node.name}`)
  }
}
