/**
 * @module socko-api
 */
/**
 */

import { FactoryInterface } from './FactoryInterface'
import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'
import { CartridgeSlot } from '../nodes/CartridgeSlot'

/**
 * Create a new [[CartridgeSlotInterface]] implementation
 */
export class CartridgeSlotFactory implements FactoryInterface<CartridgeSlotInterface> {

  public create (): CartridgeSlotInterface {
    let cartridgeInsertionPoint = new CartridgeSlot()
    cartridgeInsertionPoint.isCollector = false
    cartridgeInsertionPoint.maxDepth = -1
    cartridgeInsertionPoint.cartridgeContent = ''
    cartridgeInsertionPoint.cartridgePattern = '*'
    return cartridgeInsertionPoint
  }
}
