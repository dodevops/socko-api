import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import Bluebird = require('bluebird')

export interface ProcessorInterface {
  process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface>
}
