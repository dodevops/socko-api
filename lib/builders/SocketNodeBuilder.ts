import { AbstractNodeBuilder } from './AbstractNodeBuilder'
import { SocketNodeFactory } from '../factories/SocketNodeFactory'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'

export class SocketNodeBuilder extends AbstractNodeBuilder<SocketNodeInterface, SocketNodeBuilder> {

  constructor () {
    super(new SocketNodeFactory().create())
  }

  public withCartridgeInsertionPoint (cartridgeInsertionPoint: CartridgeInsertionPointInterface): SocketNodeBuilder {
    if (!this._node.insertionPoints) {
      this._node.insertionPoints = []
    }
    this._node.insertionPoints.push(cartridgeInsertionPoint)
    return this
  }

  protected getThis (): SocketNodeBuilder {
    return this
  }
}
