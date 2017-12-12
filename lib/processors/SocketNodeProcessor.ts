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
      .withContent(inputNode.content)
      .build()

    this._getLog().debug(`Gathering cartridges for ${inputNode.slots.length} slots`)

    return Bluebird.reduce<CartridgeSlotInterface, Array<CartridgeSlotInterface>>(
      inputNode.slots,
      (memo, item) => {
        let levels = hierarchyNode.getLevel()
        this._getLog().debug(`Finding cartridge contents for index ${item.index}`)
        return hierarchyNode.walk(
          Direction.rootUp,
          (node: SockoNodeInterface) => {
            let cartridgeNodes = this._getCartridgeNodes(node, item, levels)
            if (cartridgeNodes.length > 0) {
              if (item.isCollector) {
                this._getLog().debug('Appending cartridge content with found content')
                item.cartridgeContent = item.cartridgeContent + cartridgeNodes.reduce(
                  (previousValue, currentValue) => {
                    return previousValue.concat(currentValue.content)
                  },
                  ''
                )
              } else {
                this._getLog().debug('Setting cartridge content to the new content')
                item.cartridgeContent = cartridgeNodes[0].content
              }
            }
            levels = levels - 1
            return Bluebird.resolve()
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
      .then(
        cartridgeInsertionPoints => {
          this._getLog().debug('Inserting cartridges')
          cartridgeInsertionPoints.sort(
            (a, b) => {
              return (
                a.index - b.index
              ) * -1
            }
          )
          for (let insertionPoint of cartridgeInsertionPoints) {
            outputNode.content = this._insertIntoString(
              outputNode.content,
              insertionPoint.index,
              insertionPoint.cartridgeContent
            )
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
}
