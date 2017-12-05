import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { CartridgeInsertionPoint } from '../sockets/CartridgeInsertionPoint'

export class SocketNode extends AbstractSockoNode {

  private _insertionPoints: Array<CartridgeInsertionPoint>

  constructor () {
    super(SockoNodeType.Socket)
  }

}
