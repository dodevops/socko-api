import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'
import { SockoNodeInterface } from './SockoNodeInterface'

export interface SocketNodeInterface extends SockoNodeInterface {

  insertionPoints: Array<CartridgeInsertionPointInterface>

}
