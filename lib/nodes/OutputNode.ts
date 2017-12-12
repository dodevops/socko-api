import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import Bluebird = require('bluebird')
import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { SockoNodeInterface } from './SockoNodeInterface'
import { OutputNodeInterface } from './OutputNodeInterface'

/**
 * An implementation of [[OutputNodeInterface]]
 */
export class OutputNode extends AbstractSockoNode implements OutputNodeInterface {

  constructor () {
    super(SockoNodeType.Output)
  }

}
