import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'

export class RootNode extends AbstractSockoNode {

  constructor () {
    super(SockoNodeType.Root)
    this.name = '_root'
  }
}
