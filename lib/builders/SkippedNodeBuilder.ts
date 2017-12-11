/**
 * @module socko-api
 */
/**
 */

import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SkippedNodeInterface } from '../nodes/SkippedNodeInterface'
import { SkippedNodeFactory } from '../factories/SkippedNodeFactory'

/**
 * A builder for [[SkippedNodeInterface]]s
 */
export class SkippedNodeBuilder extends AbstractNodeBuilder<SkippedNodeInterface, SkippedNodeBuilder> {
  constructor () {
    super(new SkippedNodeFactory().create())
  }

  protected getThis (): SkippedNodeBuilder {
    return this
  }
}
