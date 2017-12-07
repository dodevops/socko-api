import { FactoryInterface } from './FactoryInterface'
import { RootNodeInterface } from '../nodes/RootNodeInterface'
import { RootNode } from '../nodes/RootNode'

export class RootNodeFactory implements FactoryInterface<RootNodeInterface> {

  public create (): RootNodeInterface {
    let rootNode = new RootNode()
    rootNode.name = '_root'
    rootNode.content = ''
    return rootNode
  }
}
