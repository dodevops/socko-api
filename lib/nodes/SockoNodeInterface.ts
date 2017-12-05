import { Node } from 'js-hierarchy'
import { SockoNodeType } from './SockoNodeType'

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
