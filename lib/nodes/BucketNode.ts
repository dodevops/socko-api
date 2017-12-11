/**
 * @module socko-api
 */
/**
 */

import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'
import { BucketNodeInterface } from './BucketNodeInterface'

/**
 * An implementation of [[BucketNodeInterface]]
 */
export class BucketNode extends AbstractSockoNode implements BucketNodeInterface {

  private _pattern: string | RegExp

  private _maxDepth: number

  constructor () {
    super(SockoNodeType.Bucket)
  }

  get pattern (): string | RegExp {
    return this._pattern
  }

  set pattern (value: string | RegExp) {
    this._pattern = value
  }

  get maxDepth (): number {
    return this._maxDepth
  }

  set maxDepth (value: number) {
    this._maxDepth = value
  }
}
