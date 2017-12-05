import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'

export class SimpleNode extends AbstractSockoNode {

  constructor () {
    super(SockoNodeType.Simple)
  }
}
