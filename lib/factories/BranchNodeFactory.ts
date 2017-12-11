/**
 * @module socko-api
 */
/**
 */
import { FactoryInterface } from './FactoryInterface'
import { BranchNodeInterface } from '../nodes/BranchNodeInterface'
import { BranchNode } from '../nodes/BranchNode'

/**
 * Create a new [[BranchNodeInterface]] implementation
 */
export class BranchNodeFactory implements FactoryInterface<BranchNodeInterface> {

  public create (): BranchNodeInterface {
    return new BranchNode()
  }
}
