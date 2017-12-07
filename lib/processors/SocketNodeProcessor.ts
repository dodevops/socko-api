import { AbstractProcessor } from './AbstractProcessor'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { Direction } from 'js-hierarchy'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'
import { CartridgeNodeInterface } from '../nodes/CartridgeNodeInterface'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
import Bluebird = require('bluebird')
import minimatch = require('minimatch')

export class SocketNodeProcessor extends AbstractProcessor<SocketNodeInterface> {

  constructor () {
    super('SocketNodeProcessor', SockoNodeType.Socket)
  }

  protected _process (inputNode: SocketNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {

    let outputNode = new OutputNodeBuilder()
      .withName(inputNode.name)
      .withContent(inputNode.content)
      .build()

    return Bluebird.reduce<CartridgeInsertionPointInterface, Array<CartridgeInsertionPointInterface>>(
      inputNode.insertionPoints,
      (memo, item) => {
        let levels = -1
        this._log.debug('Counting hierarchy levels to root')
        return hierarchyNode.walk(
          Direction.rootUp,
          value => {
            levels = levels + 1
            return Bluebird.resolve()
          }
        )
          .then(
            () => {
              this._log.debug('Finding cartridge contents')
              return hierarchyNode.walk(
                Direction.rootUp,
                (node: SockoNodeInterface) => {
                  let cartridgeNode = this._getCartridgeNode(node, item, levels)
                  if (cartridgeNode) {
                    if (item.isCollector) {
                      item.cartridgeContent = item.cartridgeContent.concat(cartridgeNode.content)
                    } else {
                      item.cartridgeContent = cartridgeNode.content
                    }
                  }
                  levels = levels - 1
                  return Bluebird.resolve()
                }
              )
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
          this._log.debug('Inserting cartridges')
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

  private _insertIntoString (content: string, index: number, insertContent: string): string {
    let leftPart = content.slice(0, index)
    let rightPart = content.slice(index)
    return leftPart + insertContent + rightPart
  }

  private _getCartridgeNode (node: SockoNodeInterface,
                             item: CartridgeInsertionPointInterface,
                             level: number): CartridgeNodeInterface {
    if (item.isCollector && item.maxDepth >= 0 && level > item.maxDepth) {
      return null
    }
    let cartridgeNode: CartridgeNodeInterface = null
    for (let currentNode of node.getChildren() as Array<SockoNodeInterface>) {
      if (currentNode.type === SockoNodeType.Cartridge) {
        if (item.isCollector) {
          if (
            item.cartridgePattern instanceof RegExp &&
            (
              item.cartridgePattern as RegExp
            ).test(currentNode.name)
          ) {
            cartridgeNode = currentNode
          } else if (minimatch(currentNode.name, item.cartridgePattern as string)) {
            cartridgeNode = currentNode
          }
        } else if (item.cartridgeName === currentNode.name) {
          cartridgeNode = currentNode
        }
      }
    }
    return cartridgeNode
  }
}
