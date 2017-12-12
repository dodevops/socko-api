import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { getLogger } from 'loglevel'
import { AbstractError } from './AbstractError'

/**
 * A process call started in a bucket node of the hierarchy tree
 */
export class ProcessCalledFromBucketNodeError extends AbstractError {

  constructor (node: SockoNodeInterface) {
    super(`Process was called from a bucket node: ${node.name}`)
  }
}
