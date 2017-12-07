import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'

export class SocketNode extends AbstractSockoNode {

  private _insertionPoints: Array<CartridgeInsertionPointInterface>

  constructor () {
    super(SockoNodeType.Socket)
  }

  get insertionPoints (): Array<CartridgeInsertionPointInterface> {
    return this._insertionPoints
  }

  set insertionPoints (value: Array<CartridgeInsertionPointInterface>) {
    this._insertionPoints = value
  }
}
