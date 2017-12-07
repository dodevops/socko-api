import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SimpleNodeInterface } from '../nodes/SimpleNodeInterface'
import { SimpleNodeFactory } from '../factories/SimpleNodeFactory'

export class SimpleNodeBuilder extends AbstractNodeBuilder<SimpleNodeInterface, SimpleNodeBuilder> {
  constructor () {
    super(new SimpleNodeFactory().create())
  }

  protected getThis (): SimpleNodeBuilder {
    return this
  }
}
