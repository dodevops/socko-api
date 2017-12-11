/**
 * @module socko-api
 */
/**
 */

import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { CartridgeNodeInterface } from './CartridgeNodeInterface'

/**
 * An implementation of [[CartridgeNodeInterface]]
 */
export class CartridgeNode extends AbstractSockoNode implements CartridgeNodeInterface {

  constructor () {
    super(SockoNodeType.Cartridge)
  }
}
