import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { OutputNode } from '../nodes/OutputNode'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { OutputNodeFactory } from '../factories/OutputNodeFactory'

export class OutputNodeBuilder extends AbstractNodeBuilder<OutputNodeInterface, OutputNodeBuilder> {
  constructor () {
    super(new OutputNodeFactory().create())
  }

  protected getThis (): OutputNodeBuilder {
    return this
  }
}
