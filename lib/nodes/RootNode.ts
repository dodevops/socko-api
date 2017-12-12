import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { RootNodeInterface } from './RootNodeInterface'

/**
 * An implementation of [[RootNodeInterface]]
 */
export class RootNode extends AbstractSockoNode implements RootNodeInterface {

  constructor () {
    super(SockoNodeType.Root)
    this.name = '_root'
  }
}
