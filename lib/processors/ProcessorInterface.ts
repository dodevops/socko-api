import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { ProcessorOptionsInterface } from '../options/ProcessorOptionsInterface'
import Bluebird = require('bluebird')

/**
 * An interface for a processor processing input and hierarchy trees and returning a result tree
 */
export interface ProcessorInterface {
  /**
   * Process an input node with a hierarchy node.
   *
   * @param {SockoNodeInterface} inputNode input node to process
   * @param {SockoNodeInterface} hierarchyNode hierarchy node to process
   * @param {ProcessorOptionsInterface} options processor options
   * @return {Bluebird<SockoNodeInterface>}
   */
  process (inputNode: SockoNodeInterface,
           hierarchyNode: SockoNodeInterface,
           options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface>
}
