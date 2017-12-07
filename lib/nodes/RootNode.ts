import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { RootNodeInterface } from './RootNodeInterface'

export class RootNode extends AbstractSockoNode implements RootNodeInterface {

  constructor () {
    super(SockoNodeType.Root)
    this.name = '_root'
  }
}
