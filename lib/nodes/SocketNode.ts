/**
 * @module socko-api
 */
/**
 */

import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { CartridgeSlotInterface } from './CartridgeSlotInterface'
import { SocketNodeInterface } from './SocketNodeInterface'

/**
 * An implementation of [[SocketNodeInterface]]
 */
export class SocketNode extends AbstractSockoNode implements SocketNodeInterface {

  private _slots: Array<CartridgeSlotInterface>

  constructor () {
    super(SockoNodeType.Socket)
  }

  get slots (): Array<CartridgeSlotInterface> {
    return this._slots
  }

  set slots (value: Array<CartridgeSlotInterface>) {
    this._slots = value
  }
}
