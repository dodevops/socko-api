import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { RootNode } from '../nodes/RootNode'
import { RootNodeInterface } from '../nodes/RootNodeInterface'
import { RootNodeFactory } from '../factories/RootNodeFactory'

export class RootNodeBuilder extends AbstractNodeBuilder<RootNodeInterface, RootNodeBuilder> {
  constructor () {
    super(new RootNodeFactory().create())
  }

  protected getThis (): RootNodeBuilder {
    return this
  }
}
