import Bluebird = require('bluebird')
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { RootNodeInterface } from '../nodes/RootNodeInterface'
import { BranchNodeInterface } from '../nodes/BranchNodeInterface'
import { SkippedNodeInterface } from '../nodes/SkippedNodeInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'

/**
 * Options for processors
 */
export interface ProcessorOptionsInterface {

  /**
   * A function, that is called while generating the result tree. It is called with the already generated
   * [[RootNodeInterface]], [[OutputNodeInterface]] or [[BranchNodeInterface]] and expects a node of this
   * type back. If a [[SkippedNodeInterface]] is returned, the node is not inserted in the result tree
   *
   * Defaults to a function, that simply returns the input node
   *
   * @param {RootNodeInterface | OutputNodeInterface | BranchNodeInterface} node node to process
   * @return {Bluebird<RootNodeInterface | OutputNodeInterface | BranchNodeInterface | SkippedNodeInterface>} processed
   *   node
   */
  processResultTreeNode: (node: SockoNodeInterface) => Bluebird<SockoNodeInterface>

  /**
   * A function, that is called when processing [[CartridgeNodeInterface]]s and should process and return the processed
   * node.
   * If a [[SkippedNodeInterface]] is returned, the cartridge is not processed at all.
   *
   * Defaults to a function, that simply returns the input node
   *
   * @param {CartridgeNodeInterface} node
   * @return {Bluebird<CartridgeNodeInterface | SkippedNodeInterface>}
   */
  processCartridgeNode: (node: CartridgeNodeInterface) => Bluebird<CartridgeNodeInterface | SkippedNodeInterface>

  /**
   * Allow, that cartridge slots can be left empty when no cartridges can be found. The cartridge slot content will
   * be set to an empty string. Otherwise an error is thrown.
   */

  allowEmptyCartridgeSlots: boolean

}
