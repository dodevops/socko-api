import { CartridgeSlotInterface } from './CartridgeSlotInterface'
import { SockoNodeInterface } from './SockoNodeInterface'

/**
 * A node, that is comprised of a skeleton content and multiple cartridge contents, inserted at specific slots
 */
export interface SocketNodeInterface extends SockoNodeInterface {

  /**
   * An array of [[CartridgeSlotInterface]]s telling the [[SocketProcessor]] where to put content of
   * [[CartridgeNodeInterface]]s
   */
  slots: Array<CartridgeSlotInterface>

}
