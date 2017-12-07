import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { BuilderInterface } from './BuilderInterface'

export abstract class AbstractNodeBuilder<N extends SockoNodeInterface, B extends BuilderInterface<N>> implements BuilderInterface<N> {
  protected _node: N

  constructor (startNode: N) {
    this._node = startNode
  }

  public withName (name: string): B {
    this._node.name = name
    return this.getThis()
  }

  public withContent (content: string): B {
    this._node.content = content
    return this.getThis()
  }

  public withChild (node: N): B {
    this._node.addChild(node)
    return this.getThis()
  }

  public build (): N {
    return this._node
  }

  protected abstract getThis (): B
}
