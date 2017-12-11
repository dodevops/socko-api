/**
 * @module socko-api
 */
/**
 */

import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { SkippedNodeInterface } from './SkippedNodeInterface'

/**
 * An implementation of [[SkippedNodeInterface]]
 */
export class SkippedNode extends AbstractSockoNode implements SkippedNodeInterface {

  constructor () {
    super(SockoNodeType.Skipped)
  }
}
