/**
 * @module socko-api
 */

/**
 * The type of a node extending AbstractSockoNode.
 */
export enum SockoNodeType {
  /**
   * A simple node without any further features. Used by the OverrideNodeProcessor
   */
  Simple = 'simple',
  /**
   * A socket node. Used by the SocketNodeProcessor
   */
  Socket = 'socket',
  /**
   * A bucket node. Used by the BucketNodeProcessor
   */
  Bucket = 'bucket',
  /**
   * An output node. Especially used for the result of the process.
   */
  Output = 'output',
  /**
   * The designated root node
   */
  Root = 'root'
}
