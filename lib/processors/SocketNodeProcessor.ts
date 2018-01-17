import { AbstractProcessor } from './AbstractProcessor'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { Direction } from 'js-hierarchy'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
import { ProcessorOptionsInterface } from '../options/ProcessorOptionsInterface'
import { NoCartridgeFoundError } from '../errors/NoCartridgeFoundError'
import Bluebird = require('bluebird')
import minimatch = require('minimatch')

/**
 * A processor for [[SocketNodeInterface]]s
 *
 * This processor takes the skeleton content from its [[SocketNodeInterface]] and either look for a
 * [[CartridgeNodeInterface]] in the hierarchy with a matching name or multiple [[CartridgeNodeInterface]]s based
 * on a pattern and depth.
 *
 * It will insert the content of the found [[CartridgeNodeInterface]](s) and put it on indexed points of the content
 * string.
 */
export class SocketNodeProcessor extends AbstractProcessor<SocketNodeInterface> {

  private _options: ProcessorOptionsInterface

  protected _getProcessorName (): string {
    return 'SocketNodeProcessor'
  }

  protected _getNeededTypes (): Array<SockoNodeType> {
    return [SockoNodeType.Socket]
  }

  protected _process (inputNode: SocketNodeInterface, hierarchyNode: SockoNodeInterface,
                      options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface> {

    this._options = options

    let outputNode = new OutputNodeBuilder()
      .withName(inputNode.name)
      .build()

    let content

    return inputNode.getPathNodes()
      .then(
        inputPathNodes => {
          this._getLog().debug(
            'Removing root and last node name from input path to get a relative path for hierarchy checking'
          )

          let inputPathNames: Array<string> = []

          for (let inputPathNode of inputPathNodes.slice(1, -1)) {
            inputPathNames.push(inputPathNode.name)
          }

          this._getLog().debug(`Gathering cartridges for ${inputNode.slots.length} slots at path ${inputPathNames}`)

          return Bluebird.reduce<CartridgeSlotInterface, Array<CartridgeSlotInterface>>(
            inputNode.slots,
            (processedCartridgeSlots, cartridgeSlot) => {
              let levels = hierarchyNode.getLevel()
              this._getLog().debug(`Finding cartridge contents for index ${cartridgeSlot.index}`)
              let eligibleCartridges: Array<CartridgeNodeInterface> = []
              return hierarchyNode.walk(
                Direction.rootUp,
                (node: SockoNodeInterface) => {
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
                          return Bluebird.resolve([])
                        }
                        return this._getCartridgeNodes(subNode, cartridgeSlot, levels)
                      }
                    )
                    .then(
                      cartridgeNodes => {
                        for (let cartridgeNode of cartridgeNodes) {
                          let found = false
                          for (let eligibleCartridge of eligibleCartridges) {
                            if (eligibleCartridge.name === cartridgeNode.name) {
                              found = true
                              eligibleCartridge.readContent = cartridgeNode.readContent
                            }
                          }
                          if (!found) {
                            eligibleCartridges.push(cartridgeNode)
                          }
                        }
                        levels = levels - 1
                      }
                    )
                }
              )
                .then(
                  () => {
                    return this._setCartridgeSlotContent(cartridgeSlot, eligibleCartridges)
                  }
                )
                .then(
                  cartridgeSlotWithContent => {
                    processedCartridgeSlots.push(cartridgeSlotWithContent)
                    return Bluebird.resolve(processedCartridgeSlots)
                  }
                )
            },
            []
          )
        }
      )
      .then(
        cartridgeSlots => {
          this._getLog().debug('Sorting cartridges')
          cartridgeSlots.sort(
            (a, b) => {
              return (
                a.index - b.index
              ) * -1
            }
          )
          this._getLog().debug('Reading content of socket node')
          return Bluebird.props({
            cartridgeSlots: cartridgeSlots,
            content: inputNode.readContent()
          })
        }
      )
      .then(
        value => {
          this._getLog().debug('Inserting cartridges')
          return Bluebird.reduce<CartridgeSlotInterface, string>(
            value.cartridgeSlots,
            (total, current) => {
              return Bluebird.resolve(
                this._insertIntoString(
                  total,
                  current.index,
                  current.cartridgeContent
                )
              )
            },
            value.content
          )
        }
      )
      .then(
        value => {
          outputNode.readContent = () => {
            return Bluebird.resolve(value)
          }
          return Bluebird.resolve(outputNode)
        }
      )
  }

  /**
   * Insert content at a specified index of a content string
   * @param {string} content the content to modify
   * @param {number} index the insertion index
   * @param {string} insertContent the content to insert
   * @return {string} the resulting string
   * @private
   */
  private _insertIntoString (content: string, index: number, insertContent: string): string {
    let leftPart = content.slice(0, index)
    let rightPart = content.slice(index)
    return leftPart + insertContent + rightPart
  }

  /**
   * Look for cartridges
   *
   * @param {SockoNodeInterface} node the node to look in
   * @param {CartridgeSlotInterface} item the current cartridge slot
   * @param {number} level the current distance from root
   * @return {Array<CartridgeNodeInterface>}
   * @private
   */
  private _getCartridgeNodes (node: SockoNodeInterface,
                              item: CartridgeSlotInterface,
                              level: number): Array<CartridgeNodeInterface> {
    if (item.isCollector && item.maxDepth >= 0 && level > item.maxDepth) {
      this._getLog().debug('We have reached max depth. Skipping.')
      return []
    }
    let cartridgeNodes: Array<CartridgeNodeInterface> = []
    for (let currentNode of node.getChildren() as Array<SockoNodeInterface>) {
      if (currentNode.type === SockoNodeType.Cartridge) {
        this._getLog().debug(`Found cartridge node ${currentNode.name}`)
        if (item.isCollector) {
          this._getLog().debug(`Checking, if it matches the pattern ${item.cartridgePattern}`)
          if (
            item.cartridgePattern instanceof RegExp &&
            (
              item.cartridgePattern as RegExp
            ).test(currentNode.name)
          ) {
            this._getLog().debug('Yes')
            cartridgeNodes.push(currentNode)
          } else if (
            typeof(item.cartridgePattern) === 'string' &&
            minimatch(currentNode.name, item.cartridgePattern as string)
          ) {
            this._getLog().debug('Yes')
            cartridgeNodes.push(currentNode)
          }
        } else {
          this._getLog().debug(`Checking, if it is the searched cartridge node ${item.cartridgeName}`)
          if (item.cartridgeName === currentNode.name) {
            this._getLog().debug('Yes')
            cartridgeNodes.push(currentNode)
          }
        }
      }
    }
    return cartridgeNodes
  }

  /**
   * Set the content of a cartridge slot
   *
   * @param {SockoNodeInterface} currentNode current node, the walker encountered
   * @param {CartridgeSlotInterface} cartridgeSlot the cartridge slot to work on
   * @param {number} currentLevel the current walker level
   * @return {Bluebird<CartridgeSlotInterface>} the slot with the modified cartridge slot content (if any)
   * @private
   */
  private _setCartridgeSlotContent (cartridgeSlot: CartridgeSlotInterface,
                                    cartridgeNodes: Array<CartridgeNodeInterface>): Bluebird<CartridgeSlotInterface> {
    if (cartridgeNodes.length > 0) {
      if (cartridgeSlot.isCollector) {
        this._getLog().debug('Appending cartridge content with found content')
        return Bluebird.reduce<CartridgeNodeInterface, string>(
          cartridgeNodes,
          (total, current) => {
            this._getLog().debug('Running cartridge processor on cartridge node')
            return this._options.processCartridgeNode(current)
              .then(
                processedNode => {
                  if (processedNode.type === SockoNodeType.Skipped) {
                    this._getLog().debug('Cartridge processor told us to skip node. Doing so.')
                    return Bluebird.resolve(total)
                  }

                  return processedNode.readContent()
                    .then(
                      value => {
                        return Bluebird.resolve(total.concat(value))
                      }
                    )
                }
              )

          },
          cartridgeSlot.cartridgeContent
        )
          .then(
            value => {
              cartridgeSlot.cartridgeContent = value
              return Bluebird.resolve(cartridgeSlot)
            }
          )
      } else {
        this._getLog().debug('Setting cartridge content to the new content')
        return cartridgeNodes[0].readContent()
          .then(
            value => {
              cartridgeSlot.cartridgeContent = value
              return Bluebird.resolve(cartridgeSlot)
            }
          )
      }
    } else {
      if (this._options.allowEmptyCartridgeSlots) {
        cartridgeSlot.cartridgeContent = ''
        return Bluebird.resolve(cartridgeSlot)
      } else {
        return Bluebird.reject(new NoCartridgeFoundError(cartridgeSlot))
      }
    }
  }
}
