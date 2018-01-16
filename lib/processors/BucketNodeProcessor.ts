import { AbstractProcessor } from './AbstractProcessor'
import { BucketNodeInterface } from '../nodes/BucketNodeInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { Direction } from 'js-hierarchy'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { ProcessCalledFromBucketNodeError } from '../errors/ProcessCalledFromBucketNodeError'
import { ProcessorOptionsInterface } from '../options/ProcessorOptionsInterface'
import { BranchNodeBuilder } from '../builders/BranchNodeBuilder'
import Bluebird = require('bluebird')
import minimatch = require('minimatch')

/**
 * A processor handling [[BucketNodeInterface]]s.
 *
 * This processor will first search for Nodes in the hierarchy tree with a matching name. These nodes are considered
 * 'equivalent' nodes. Then, all children are matched against the given pattern and depth. All matching
 * children are then put in the resulti tree.
 */
export class BucketNodeProcessor extends AbstractProcessor<BucketNodeInterface> {

  protected _getProcessorName (): string {
    return 'BucketNodeProcessor'
  }

  protected _getNeededTypes (): Array<SockoNodeType> {
    return [SockoNodeType.Bucket]
  }

  protected _process (inputNode: BucketNodeInterface, hierarchyNode: SockoNodeInterface,
                      options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface> {
    let returnedNode = new BranchNodeBuilder()
      .withName(inputNode.name)
      .build()

    let levels = hierarchyNode.getLevel()
    return inputNode.getPathNodes()
      .then(
        inputPathNodes => {
          this._getLog().debug(
            'Removing root from input path to get a relative path for hierarchy checking'
          )

          let inputPathNames: Array<string> = []

          for (let inputPathNode of inputPathNodes.slice(1)) {
            inputPathNames.push(inputPathNode.name)
          }
          return hierarchyNode.walk(
            Direction.rootUp,
            (node: SockoNodeInterface) => {
              if (node.name === inputNode.name) {
                return Bluebird.reject(
                  new ProcessCalledFromBucketNodeError(node)
                )
              } else {
                this._getLog().debug(
                  `Checking for bucket equivalent in the hierarchy tree in path ${inputPathNames}`
                )
                return node.getNodeByPathArray(inputPathNames, false)
                  .catch(
                    (error: Error) => {
                      return error.name === 'NodeNotFoundError'
                    },
                    () => {
                      return Bluebird.resolve(null)
                    }
                  )
                  .then(
                    subNode => {
                      if (subNode === null) {
                        return Bluebird.resolve(null)
                      }

                      this._getLog().debug('Found bucket equivalent. Checking for matching children')
                      return this._getBucketEntries(inputNode, subNode, levels, true)
                    }
                  )
                  .then(
                    value => {
                      levels = levels - 1
                      if (value) {
                        this._getLog().debug('Merging with probably existing bucket entries')
                        for (let processedNode of value.getChildren()) {
                          for (let existingChild of returnedNode.getChildren()) {
                            if (existingChild.name === processedNode.name) {
                              returnedNode.removeChild(existingChild)
                            }
                          }
                          returnedNode.addChild(processedNode as OutputNodeInterface)
                        }
                      }
                      return Bluebird.resolve()
                    }
                  )

              }
            }
          )
        }
      )
      .then(
        () => {
          return returnedNode
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
  private _getBucketEntries (inputNode: BucketNodeInterface,
                             node: SockoNodeInterface,
                             levels: number,
                             skipNode: boolean = false): Bluebird<OutputNodeInterface> {
    if (inputNode.maxDepth >= 0 && levels > inputNode.maxDepth) {
      return Bluebird.resolve(null)
    }

    let eligible: boolean

    if (skipNode) {
      eligible = true
      this._getLog().debug('Not testing this node. It might just be the bucket equivalent')
    } else {
      this._getLog().debug(`Checking, if ${node.name} matches ${inputNode.pattern}`)

      if (
        inputNode.pattern instanceof RegExp &&
        (inputNode.pattern as RegExp).test(node.name)
      ) {
        eligible = true
      } else if (
        typeof inputNode.pattern === 'string' &&
        minimatch(node.name, inputNode.pattern as string)
      ) {
        eligible = true
      }
    }

    this._getLog().debug('Node matches. Transform this node into an output node.')

    if (node.getChildren().length > 0) {
      let returnNode = new BranchNodeBuilder()
        .withName(node.name)
        .build()

      this._getLog().debug('Checking children of this node.')

      return Bluebird.reduce<SockoNodeInterface, Array<OutputNodeInterface>>(
        node.getChildren() as Array<SockoNodeInterface>,
        (total, current) => {
          return this._getBucketEntries(inputNode, current, levels)
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
          outputChildNodes => {
            if (!eligible && outputChildNodes.length === 0) {
              return Bluebird.resolve(null)
            }
            eligible = true
            for (let outputChild of outputChildNodes) {
              returnNode.addChild(outputChild)
            }
            this._getLog().debug('Returning processed node')
            return Bluebird.resolve(returnNode)
          }
        )
    } else {
      if (!eligible) {
        return Bluebird.resolve(null)
      }
      this._getLog().debug('Returning processed node')

      return Bluebird.resolve(new OutputNodeBuilder()
        .withName(node.name)
        .withReadContent(node.readContent)
        .build()
      )
    }

  }
}
