import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SimpleNodeInterface } from '../nodes/SimpleNodeInterface'
import { SimpleNodeFactory } from '../factories/SimpleNodeFactory'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { CartridgeNodeFactory } from '../factories/CartridgeNodeFactory'

export class CartridgeNodeBuilder extends AbstractNodeBuilder<CartridgeNodeInterface, CartridgeNodeBuilder> {
  constructor () {
    super(new CartridgeNodeFactory().create())
  }

  protected getThis (): CartridgeNodeBuilder {
    return this
  }
}
