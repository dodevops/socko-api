/**
 * @module socko-api
 */
/**
 */

import { FactoryInterface } from './FactoryInterface'
import { SocketNodeInterface } from '../nodes/SocketNodeInterface'
import { SocketNode } from '../nodes/SocketNode'

/**
 * Create a new [[SocketNodeInterface]] implementation
 */
export class SocketNodeFactory implements FactoryInterface<SocketNodeInterface> {

  public create (): SocketNodeInterface {
    let socketNode = new SocketNode()
    socketNode.name = ''
    socketNode.content = ''
    socketNode.slots = []
    return socketNode
  }
}
