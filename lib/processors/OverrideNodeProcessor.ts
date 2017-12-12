import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { AbstractProcessor } from './AbstractProcessor'
import { Direction } from 'js-hierarchy'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { ProcessCalledFromOverrideNodeError } from '../errors/ProcessCalledFromOverrideNodeError'
import { SimpleNodeInterface } from '../nodes/SimpleNodeInterface'
import Bluebird = require('bluebird')

/**
 * A processor handling overrides of [[SimpleNode]]s
 *
 * This processor will take each [[SimpleNodeInterface]] node from the input tree and look for a node with a matching
 * name in the hierarchy tree. If it finds one, it will use the content from the best match from the hierarchy tree.
 * If not, it will use the content of the original one.
 */
export class OverrideNodeProcessor extends AbstractProcessor<SimpleNodeInterface> {

  protected _getProcessorName (): string {
    return 'OverrideNodeProcessor'
  }

  protected _getNeededTypes (): Array<SockoNodeType> {
    return [SockoNodeType.Simple]
  }

  protected _process (inputNode: SimpleNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    let exchangeNode: SockoNodeInterface = null

    this._getLog().debug(`Walking through the hierarchy tree to find an override eligible node for ${inputNode.name}`)
    return hierarchyNode.walk(
      Direction.rootUp,
      (node: SockoNodeInterface) => {
        if (node.name === inputNode.name) {
          return Bluebird.reject(new ProcessCalledFromOverrideNodeError(node))
        } else {
          for (let childNode of node.getChildren() as Array<SockoNodeInterface>) {
            if (childNode.name === inputNode.name) {
              this._getLog().debug(`Found node eligeble to override node at ${childNode.getPath()}`)
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
            return Bluebird.resolve(
              new OutputNodeBuilder().withName(exchangeNode.name).withContent(exchangeNode.content).build()
            )
          } else {
            this._getLog().debug('Using original node content')
            return Bluebird.resolve(
              new OutputNodeBuilder().withName(inputNode.name).withContent(inputNode.content).build()
            )
          }
        }
      )
  }
}
