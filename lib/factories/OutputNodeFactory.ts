import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { FactoryInterface } from './FactoryInterface'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import Bluebird = require('bluebird')

/**
 * Create a new [[OutputNodeInterface]] implementation
 */
export class OutputNodeFactory implements FactoryInterface<OutputNodeInterface> {
  public create (): OutputNodeInterface {
    let outputNode = new OutputNode()
    outputNode.name = ''
    return outputNode
  }

}
