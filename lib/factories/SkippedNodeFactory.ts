/**
 * @module socko-api
 */
/**
 */

import { FactoryInterface } from './FactoryInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SkippedNodeInterface } from '../nodes/SkippedNodeInterface'
import { SkippedNode } from '../nodes/SkippedNode'

/**
 * Create a new [[SkippedNodeInterface]] implementation
 */
export class SkippedNodeFactory implements FactoryInterface<SkippedNodeInterface> {

  public create (): SkippedNodeInterface {
    return new SkippedNode()
  }
}
