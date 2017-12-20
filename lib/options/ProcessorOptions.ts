import { ProcessorOptionsInterface } from './ProcessorOptionsInterface'
import { SkippedNodeInterface } from '../nodes/SkippedNodeInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import Bluebird = require('bluebird')

/**
 * An implementation of [[ProcessorOptionsInterface]]
 */
export class ProcessorOptions implements ProcessorOptionsInterface {

  private _processResultTreeNode: (node: SockoNodeInterface) => Bluebird<SockoNodeInterface>
  private _processCartridgeNode: (node: CartridgeNodeInterface)
    => Bluebird<CartridgeNodeInterface | SkippedNodeInterface>

  get processResultTreeNode (): (node: SockoNodeInterface) => Bluebird<SockoNodeInterface> {
    return this._processResultTreeNode
  }

  set processResultTreeNode (value: (node: SockoNodeInterface) => Bluebird<SockoNodeInterface>) {
    this._processResultTreeNode = value
  }

  get processCartridgeNode (): (node: CartridgeNodeInterface) => Bluebird<(CartridgeNodeInterface | SkippedNodeInterface)> {
    return this._processCartridgeNode
  }

  set processCartridgeNode (value: (node: CartridgeNodeInterface) => Bluebird<(CartridgeNodeInterface | SkippedNodeInterface)>) {
    this._processCartridgeNode = value
  }
}
