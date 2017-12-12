import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { SimpleNodeInterface } from './SimpleNodeInterface'

/**
 * An implementation of [[SimpleNodeInterface]]
 */
export class SimpleNode extends AbstractSockoNode implements SimpleNodeInterface {

  constructor () {
    super(SockoNodeType.Simple)
  }
}
