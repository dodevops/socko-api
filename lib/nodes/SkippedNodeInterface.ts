import { SockoNodeInterface } from './SockoNodeInterface'

/**
 * A node, that could not be handled by the current processor. These nodes usually only exist during assemble time
 * and should not exist in a resulting tree
 */
export interface SkippedNodeInterface extends SockoNodeInterface {}
