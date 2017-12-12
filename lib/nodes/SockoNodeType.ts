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
  Root = 'root',
  /**
   * A cartridge
   */
  Cartridge = 'cartridge',
  /**
   * A node, that was skipped on generating output nodes, because the processor couldn't handle it
   */
  Skipped = 'skipped',
  /**
   * A node, that holds one or more children
   */
  Branch = 'branch'
}
