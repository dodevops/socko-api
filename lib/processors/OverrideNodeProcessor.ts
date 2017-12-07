import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import { AbstractProcessor } from './AbstractProcessor'
import { Direction } from 'js-hierarchy'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { SimpleNode } from '../nodes/SimpleNode'
import Bluebird = require('bluebird')
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { OutputNodeFactory } from '../factories/OutputNodeFactory'

export class OverrideNodeProcessor extends AbstractProcessor<SimpleNode> {

  constructor () {
    super('OverrideNodeProcessor', SockoNodeType.Simple)
  }

  protected _process (inputNode: SimpleNode, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    let exchangeNode: SockoNodeInterface = null
    return hierarchyNode.walk(
      Direction.rootUp,
      (node: SockoNodeInterface) => {
        if (node.name === inputNode.name) {
          this._log.debug(`Found node eligeble to override node at ${node.getPath()}`)
          exchangeNode = node
        } else {
          for (let childNode of node.getChildren() as Array<SockoNodeInterface>) {
            if (childNode.name === inputNode.name) {
              this._log.debug(`Found node eligeble to override node at ${childNode.getPath()}`)
              exchangeNode = childNode
            }
          }
        }
        return Bluebird.resolve()
      }
    )
      .then(
        () => {
          if (exchangeNode) {
            return Bluebird.resolve(new OutputNodeFactory().fromNode(exchangeNode))
          } else {
            return Bluebird.resolve(new OutputNodeFactory().fromNode(inputNode))
          }
        }
      )
  }
}
