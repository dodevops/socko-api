import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { AbstractProcessor } from './AbstractProcessor'
import { Direction } from 'js-hierarchy'
import { NodeBuilder } from '../nodes/NodeBuilder'
import { RootNode } from '../nodes/RootNode'
import Bluebird = require('bluebird')

export class OverrideNodeProcessor extends AbstractProcessor {

  constructor () {
    super('OverrideNodeProcessor')
  }

  protected _process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    if (inputNode.type === SockoNodeType.Simple) {
      this._log.debug('Found simple node to process. Looking for it in the hierarchy')
      return this._processSimpleNode(hierarchyNode, inputNode)
    }
    let outputNode: SockoNodeInterface
    if (inputNode.type === SockoNodeType.Root) {
      outputNode = new NodeBuilder(new RootNode()).build()
    } else {
      outputNode = new NodeBuilder(new OutputNode())
        .withName(inputNode.name)
        .withContent(inputNode.content)
        .build() as OutputNode
    }
    return Bluebird.reduce<SockoNodeInterface, Array<SockoNodeInterface>>(
      inputNode.getChildren() as Array<SockoNodeInterface>,
      (total, current) => {
        return this._process(current, hierarchyNode)
          .then(
            outputNode => {
              total.push(outputNode)
              return Bluebird.resolve(total)
            }
          )
      },
      []
    )
      .then(
        outputNodes => {
          for (let childNode of outputNodes) {
            outputNode.addChild(childNode)
          }
          return Bluebird.resolve(outputNode)
        }
      )
  }

  private _processSimpleNode (hierarchyNode: SockoNodeInterface, inputNode: SockoNodeInterface): Bluebird<OutputNode> {
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
            return Bluebird.resolve(new NodeBuilder(new OutputNode()).fromNode(exchangeNode).build() as OutputNode)
          } else {
            return Bluebird.resolve(new NodeBuilder(new OutputNode()).fromNode(inputNode).build() as OutputNode)
          }
        }
      )
  }
}
