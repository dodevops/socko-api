/**
 * @module socko-api
 */
/**
 */

import { FactoryInterface } from './FactoryInterface'
import { BucketNodeInterface } from '../nodes/BucketNodeInterface'
import { BucketNode } from '../nodes/BucketNode'

/**
 * Create a new [[BucketNodeInterface]] implementation
 */
export class BucketNodeFactory implements FactoryInterface<BucketNodeInterface> {

  public create (): BucketNodeInterface {
    let bucketNode = new BucketNode()
    bucketNode.name = ''
    bucketNode.content = ''
    bucketNode.maxDepth = -1
    bucketNode.pattern = '*'
    return bucketNode
  }
}
