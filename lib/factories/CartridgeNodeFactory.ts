import { FactoryInterface } from './FactoryInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { CartridgeNode } from '../nodes/CartridgeNode'

/**
 * Create a new [[CartridgeNodeInterface]] implementation
 */
export class CartridgeNodeFactory implements FactoryInterface<CartridgeNodeInterface> {

  public create (): CartridgeNodeInterface {
    let cartridgeNode = new CartridgeNode()
    cartridgeNode.name = ''
    return cartridgeNode
  }
}
