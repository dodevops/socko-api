import { Node } from 'js-hierarchy'
import { SockoNodeType } from './SockoNodeType'
import Bluebird = require('bluebird')

/**
 * A subset interface for all SOCKO nodes
 */
export interface SockoNodeInterface extends Node {
  /**
   * The type of this node
   */
  type: SockoNodeType

  /**
   * Return the content of this node
   * @return {Bluebird<any>}
   */
  readContent (): Bluebird<any>

  /**
   * Write the content of this node
   * @param content
   * @return {Bluebird<void>}
   */
  writeContent (content: any): Bluebird<void>

}
