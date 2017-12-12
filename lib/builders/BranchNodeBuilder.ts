import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { BranchNodeInterface } from '../nodes/BranchNodeInterface'
import { BranchNodeFactory } from '../factories/BranchNodeFactory'

/**
 * A builder for [[BranchNodeInterface]]s
 */
export class BranchNodeBuilder extends AbstractNodeBuilder<BranchNodeInterface, BranchNodeBuilder> {

  constructor () {
    super(new BranchNodeFactory().create())
  }

  protected getThis (): BranchNodeBuilder {
    return this
  }
}
