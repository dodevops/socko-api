/**
 * @module socko-api
 */
/**
 */

import { BucketNodeInterface } from '../nodes/BucketNodeInterface'
import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { BucketNodeFactory } from '../factories/BucketNodeFactory'

/**
 * A builder for [[BucketNodeInterface]]s
 */
export class BucketNodeBuilder extends AbstractNodeBuilder<BucketNodeInterface, BucketNodeBuilder> {

  constructor () {
    super(new BucketNodeFactory().create())
  }

  /**
   * Set the pattern of the [[BucketNodeInterface]]
   * @param {string | RegExp} pattern the pattern
   * @return {BucketNodeBuilder}
   */
  public withPattern (pattern: string | RegExp): BucketNodeBuilder {
    this._node.pattern = pattern
    return this
  }

  /**
   * Set the maxDepth of the [[BucketNodeInterface]]
   * @param {number} maxDepth max depth
   * @return {BucketNodeBuilder}
   */
  public withMaxDepth (maxDepth: number): BucketNodeBuilder {
    this._node.maxDepth = maxDepth
    return this
  }

  protected getThis (): BucketNodeBuilder {
    return this
  }
}
