import { FactoryInterface } from './FactoryInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { CartridgeNode } from '../nodes/CartridgeNode'

export class CartridgeNodeFactory implements FactoryInterface<CartridgeNodeInterface> {

  public create (): CartridgeNodeInterface {
    let cartridgeNode = new CartridgeNode()
    cartridgeNode.name = ''
    cartridgeNode.content = ''
    return cartridgeNode
  }
}
