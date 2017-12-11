/**
 * @module socko-api
 */
/**
 */
import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { BranchNodeInterface } from './BranchNodeInterface'

/**
 * An implementation of [[BranchNodeInterface]]
 */
export class BranchNode extends AbstractSockoNode implements BranchNodeInterface {

  constructor () {
    super(SockoNodeType.Branch)
  }
}
