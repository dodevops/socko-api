import { FactoryInterface } from './FactoryInterface'
import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'
import { CartridgeInsertionPoint } from '../sockets/CartridgeInsertionPoint'

export class CartridgeInsertionPointFactory implements FactoryInterface<CartridgeInsertionPointInterface> {

  public create (): CartridgeInsertionPointInterface {
    let cartridgeInsertionPoint = new CartridgeInsertionPoint()
    cartridgeInsertionPoint.isCollector = false
    cartridgeInsertionPoint.maxDepth = -1
    cartridgeInsertionPoint.cartridgeContent = ''
    return cartridgeInsertionPoint
  }
}
