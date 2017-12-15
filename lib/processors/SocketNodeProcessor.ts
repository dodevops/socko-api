import { AbstractProcessor } from './AbstractProcessor'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { Direction } from 'js-hierarchy'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
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

  protected _getProcessorName (): string {
    return 'SocketNodeProcessor'
  }

  protected _getNeededTypes (): Array<SockoNodeType> {
    return [SockoNodeType.Socket]
  }

  protected _process (inputNode: SocketNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {

    let outputNode = new OutputNodeBuilder()
      .withName(inputNode.name)
      .build()

    this._getLog().debug(`Gathering cartridges for ${inputNode.slots.length} slots`)

    return inputNode.readContent()
      .then(
        value => {
          return outputNode.writeContent(value)
        }
      )
      .then(
        () => {
          return Bluebird.reduce<CartridgeSlotInterface, Array<CartridgeSlotInterface>>(
            inputNode.slots,
            (memo, item) => {
              let levels = hierarchyNode.getLevel()
              this._getLog().debug(`Finding cartridge contents for index ${item.index}`)
              return hierarchyNode.walk(
                Direction.rootUp,
                (node: SockoNodeInterface) => {
                  let cartridgeNodes = this._getCartridgeNodes(node, item, levels)
                  levels = levels - 1
                  if (cartridgeNodes.length > 0) {
                    if (item.isCollector) {
                      this._getLog().debug('Appending cartridge content with found content')
                      return Bluebird.reduce<CartridgeNodeInterface, string>(
                        cartridgeNodes,
                        (total, current) => {
                          return current.readContent()
                            .then(
                              value => {
                                return Bluebird.resolve(total.concat(value))
                              }
                            )
                        },
                        item.cartridgeContent
                      )
                        .then(
                          value => {
                            item.cartridgeContent = value
                            return Bluebird.resolve()
                          }
                        )
                    } else {
                      this._getLog().debug('Setting cartridge content to the new content')
                      return cartridgeNodes[0].readContent()
                        .then(
                          value => {
                            item.cartridgeContent = value
                            return Bluebird.resolve()
                          }
                        )
                    }
                  } else {
                    return Bluebird.resolve()
                  }
                }
              )
                .then(
                  () => {
                    memo.push(item)
                    return Bluebird.resolve(memo)
                  }
                )
            },
            []
          )
        }
      )
      .then(
        cartridgeSlots => {
          this._getLog().debug('Inserting cartridges')
          cartridgeSlots.sort(
            (a, b) => {
              return (
                a.index - b.index
              ) * -1
            }
          )
          return outputNode.readContent()
            .then(
              value => {
                return Bluebird.reduce<CartridgeSlotInterface, string>(
                  cartridgeSlots,
                  (total, current) => {
                    return Bluebird.resolve(
                      this._insertIntoString(
                        total,
                        current.index,
                        current.cartridgeContent
                      )
                    )
                  },
                  value
                )
              }
            )
            .then(
              value => {
                return outputNode.writeContent(value)
              }
            )
            .then(
              () => {
                return Bluebird.resolve(outputNode)
              }
            )
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
}
