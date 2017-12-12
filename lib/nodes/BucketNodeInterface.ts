import { SockoNodeInterface } from './SockoNodeInterface'

/**
 * A node, that creates a branch node in the resulting tree and fills it with nodes from the hierarchy tree
 */
export interface BucketNodeInterface extends SockoNodeInterface {

  /**
   * The pattern of the bucket entries to search for. Accepts a RegExp object or a
   * [minimatch](https://www.npmjs.com/package/minimatch) pattern, that is matched again encountered node names
   */
  pattern: string | RegExp

  /**
   * How far to go down to the root when looking for matching nodes. -1 means: indefinitely
   * @return {number}
   */
  maxDepth: number

}
