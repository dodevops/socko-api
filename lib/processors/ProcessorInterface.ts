/**
 * @module socko-api
 */
/**
 */
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import Bluebird = require('bluebird')

/**
 * An interface for a processor processing input and hierarchy trees and returning a resulting tree
 */
export interface ProcessorInterface {
  process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface>
}
