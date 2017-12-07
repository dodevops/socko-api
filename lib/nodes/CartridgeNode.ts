import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'

export class CartridgeNode extends AbstractSockoNode {

  constructor () {
    super(SockoNodeType.Cartridge)
  }
}
