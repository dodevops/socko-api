import { FactoryInterface } from './FactoryInterface'
import { RootNodeInterface } from '../nodes/RootNodeInterface'
import { RootNode } from '../nodes/RootNode'
import Bluebird = require('bluebird')
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { OutputNodeFactory } from './OutputNodeFactory'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'

/**
 * Create a new [[RootNodeInterface]] implementation
 */
export class RootNodeFactory implements FactoryInterface<RootNodeInterface> {

  public create (): RootNodeInterface {
    let rootNode = new RootNode()
    rootNode.name = '_root'
    return rootNode
  }

}
