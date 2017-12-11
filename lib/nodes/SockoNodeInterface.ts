/**
 * @module socko-api
 */
/**
 */
import { Node } from 'js-hierarchy'
import { SockoNodeType } from './SockoNodeType'

/**
 * A subset interface for all SOCKO nodes
 */
export interface SockoNodeInterface extends Node {
  /**
   * The type of this node
   */
  type: SockoNodeType

  /**
   * The raw content of this node
   */
  content: string

}
