import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SocketNodeFactory } from '../factories/SocketNodeFactory'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'

/**
 * A builder for [[SocketNodeInterface]]s
 */
export class SocketNodeBuilder extends AbstractNodeBuilder<SocketNodeInterface, SocketNodeBuilder> {

  constructor () {
    super(new SocketNodeFactory().create())
  }

  public withCartridgeSlot (cartridgeSlot: CartridgeSlotInterface): SocketNodeBuilder {
    this._node.slots.push(cartridgeSlot)
    return this
  }

  protected getThis (): SocketNodeBuilder {
    return this
  }
}
