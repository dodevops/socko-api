import { SockoNodeInterface } from './SockoNodeInterface'

export class NodeBuilder {
  private _node: SockoNodeInterface

  constructor (startNode: SockoNodeInterface) {
    this._node = startNode
  }

  public fromNode (cloneNode: SockoNodeInterface): NodeBuilder {
    this._node.name = cloneNode.name
    this._node.content = cloneNode.content
    for (let childNode of cloneNode.getChildren() as Array<SockoNodeInterface>) {
      this._node.addChild(new NodeBuilder(this._node).fromNode(childNode).build())
    }
    return this
  }

  public withName (name: string): NodeBuilder {
    this._node.name = name
    return this
  }

  public withContent (content: string): NodeBuilder {
    this._node.content = content
    return this
  }

  public withChild (node: SockoNodeInterface) {
    this._node.addChild(node)
    return this
  }

  public build (): SockoNodeInterface {
    return this._node
  }
}
