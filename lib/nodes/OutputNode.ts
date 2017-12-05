import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import Bluebird = require('bluebird')
import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { SockoNodeInterface } from './SockoNodeInterface'

export class OutputNode extends AbstractSockoNode {

  constructor () {
    super(SockoNodeType.Output)
  }

}