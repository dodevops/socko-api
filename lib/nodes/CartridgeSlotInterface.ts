/**
 * A slot of a [[SocketNodeInterface]]. Inserts content of one or more cartridges at an index of the socket node.
 */
export interface CartridgeSlotInterface {
  /**
   * The index where to put the cartridge content into the socket node content
   */
  index: number

  /**
   * Are we collecting multiple cartridges to insert?
   */
  isCollector: boolean

  /**
   * Is this slot referring to an environment variable?
   */
  isEnvironmentSlot: boolean

  /**
   * The name of the cartridge to be inserted (ignored, when `isCollector` is true)
   */
  cartridgeName: string

  /**
   * The pattern of the cartridges to search for, when `isCollector` is true. Accepts a RegExp object or a
   * [minimatch](https://www.npmjs.com/package/minimatch) pattern, that is matched again encountered cartridge names
   */
  cartridgePattern: string | RegExp

  /**
   * How far to traverse down the hierarchy tree. -1 means indefinitely
   */
  maxDepth: number

  /**
   * The collected content to be inserted into the socket node (set by the processor)
   */
  cartridgeContent: string
}
