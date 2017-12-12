import { AbstractProcessor } from './AbstractProcessor'
import { BucketNodeInterface } from '../nodes/BucketNodeInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { Direction } from 'js-hierarchy'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { ProcessCalledFromBucketNodeError } from '../errors/ProcessCalledFromBucketNodeError'
import Bluebird = require('bluebird')
import minimatch = require('minimatch')

/**
 * A processor handling [[BucketNodeInterface]]s.
 *
 * This processor will first search for Nodes in the hierarchy tree with a matching name. These nodes are considered
 * 'equivalent' nodes. Then, all children are matched against the given pattern and depth. All matching
 * children are then put in the resulting tree.
 */
export class BucketNodeProcessor extends AbstractProcessor<BucketNodeInterface> {

  protected _getProcessorName (): string {
    return 'BucketNodeProcessor'
  }

  protected _getNeededTypes (): Array<SockoNodeType> {
    return [SockoNodeType.Bucket]
  }

  protected _process (inputNode: BucketNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    let outputNode = new OutputNodeBuilder()
      .withName(inputNode.name)
      .withContent(inputNode.content)
      .build()

    let levels = hierarchyNode.getLevel()

    return hierarchyNode.walk(
      Direction.rootUp,
      (node: SockoNodeInterface) => {
        if (node.name === inputNode.name) {
          return Bluebird.reject(
            new ProcessCalledFromBucketNodeError(node)
          )
        } else {
          this._getLog().debug(
            `Checking for bucket equivalent in the hierarchy tree. Searching children of node ${node.name}`
          )
          for (let childNode of node.getChildren() as Array<SockoNodeInterface>) {
            if (childNode.name === inputNode.name) {
              this._getLog().debug('Found bucket equivalent. Checking for matching children')
              return this._getOutputNode(inputNode, childNode, levels, true)
                .then(
                  value => {
                    levels = levels - 1
                    if (value) {
                      this._getLog().debug('Merging with probably existing bucket entries')
                      for (let processedNode of value.getChildren()) {
                        for (let existingChild of outputNode.getChildren()) {
                          if (existingChild.name === processedNode.name) {
                            outputNode.removeChild(existingChild)
                          }
                        }
                        outputNode.addChild(processedNode as OutputNodeInterface)
                      }
                    }
                    return Bluebird.resolve()
                  }
                )
            }
          }
          levels = levels - 1
          return Bluebird.resolve()
        }
      }
    )
      .then(
        () => {
          return outputNode
        }
      )
  }

  /**
   * Check a node of the hierarchy, if it matches the provided pattern
   * @param {BucketNodeInterface} inputNode
   * @param {SockoNodeInterface} node
   * @param {number} levels
   * @param {boolean} skipNode
   * @return {Bluebird<OutputNodeInterface>}
   * @private
   */
  private _getOutputNode (inputNode: BucketNodeInterface,
                          node: SockoNodeInterface,
                          levels: number,
                          skipNode: boolean = false): Bluebird<OutputNodeInterface> {
    if (inputNode.maxDepth >= 0 && levels > inputNode.maxDepth) {
      return Bluebird.resolve(null)
    }

    if (skipNode) {
      this._getLog().debug('Not testing this node. It might just be the bucket equivalent')
    } else {
      let eligible: boolean = false

      this._getLog().debug(`Checking, if ${node.name} matches ${inputNode.pattern}`)

      if (
        inputNode.pattern instanceof RegExp &&
        (inputNode.pattern as RegExp).test(node.name)
      ) {
        eligible = true
      } else if (minimatch(node.name, inputNode.pattern as string)) {
        eligible = true
      }

      if (!eligible) {
        this._getLog().debug('No. Skipping.')
        return Bluebird.resolve(null)
      }

    }

    this._getLog().debug('Node matches. Transform this node into an output node.')

    let outputNodeBuilder = new OutputNodeBuilder()
      .withName(node.name)
      .withContent(node.content)

    this._getLog().debug('Checking children of this node.')

    return Bluebird.reduce<SockoNodeInterface, Array<OutputNodeInterface>>(
      node.getChildren() as Array<SockoNodeInterface>,
      (total, current) => {
        return this._getOutputNode(inputNode, current, levels)
          .then(
            value => {
              if (value) {
                total.push(value)
              }
              return Bluebird.resolve(total)
            }
          )
      },
      []
    )
      .then(
        outputNodes => {
          for (let outputNode of outputNodes) {
            outputNodeBuilder.withChild(outputNode)
          }
          this._getLog().debug('Returning processed node')
          return outputNodeBuilder.build()
        }
      )
  }
}
