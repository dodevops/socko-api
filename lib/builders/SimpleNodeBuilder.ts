/**
 * @module socko-api
 */
/**
 */

import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SimpleNodeInterface } from '../nodes/SimpleNodeInterface'
import { SimpleNodeFactory } from '../factories/SimpleNodeFactory'
import { getLogger } from 'loglevel'

/**
 * A builder for [[SimpleNodeInterface]]s
 */
export class SimpleNodeBuilder extends AbstractNodeBuilder<SimpleNodeInterface, SimpleNodeBuilder> {
  constructor () {
    super(new SimpleNodeFactory().create())
  }

  /**
   * A simple nodes have no children. Log that and return the builder unmodified
   * @param {SimpleNodeInterface} node
   * @return {SimpleNodeBuilder}
   */
  public withChild (node: SimpleNodeInterface): SimpleNodeBuilder {
    let logger = getLogger('socko-api:SimpleNodeBuilder')
    logger.warn('SimpleNodes should not have children. Use a BranchNode instead. Ignoring #withChild-call')
    logger.debug(new Error().stack)
    return this
  }

  protected getThis (): SimpleNodeBuilder {
    return this
  }
}
