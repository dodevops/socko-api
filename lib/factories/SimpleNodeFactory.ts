import { FactoryInterface } from './FactoryInterface'
import { SimpleNodeInterface } from '../nodes/SimpleNodeInterface'
import { SimpleNode } from '../nodes/SimpleNode'

export class SimpleNodeFactory implements FactoryInterface<SimpleNodeInterface> {

  public create (): SimpleNodeInterface {
    let simpleNode = new SimpleNode()
    simpleNode.name = ''
    simpleNode.content = ''
    return simpleNode
  }
}
