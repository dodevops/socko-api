import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { BuilderInterface } from './BuilderInterface'
import { Logger } from 'loglevel'
import Bluebird = require('bluebird')

/**
 * An abstract implementation of [[BuilderInterface]]
 */
export abstract class AbstractNodeBuilder<N extends SockoNodeInterface, B extends BuilderInterface<N>> implements BuilderInterface<N> {
  protected _node: N

  constructor (startNode: N) {
    this._node = startNode
  }

  public withName (name: string): B {
    this._node.name = name
    return this.getThis()
  }

  public withReadContent (reader: () => Bluebird<any>): B {
    this._node.readContent = reader
    return this.getThis()
  }

  public withWriteContent (writer: (content: any) => Bluebird<void>): B {
    this._node.writeContent = writer
    return this.getThis()
  }

  public withChild (node: N): B {
    this._node.addChild(node)
    return this.getThis()
  }

  public build (): N {
    return this._node
  }

  /**
   * Return the current builder object of the overriding class.
   * @return {B}
   */

  protected abstract getThis (): B
}
