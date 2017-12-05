import { AbstractSockoNode } from './AbstractSockoNode'
import { SockoNodeType } from './SockoNodeType'

export class BucketNode extends AbstractSockoNode {

  private _pattern: string | RegExp

  private _depth: number

  constructor () {
    super(SockoNodeType.Bucket)
  }

  /**
   * The pattern to search for node names. Excepts a glob pattern as a string or a regular expression
   * @return {string | RegExp}
   */
  get pattern (): string | RegExp {
    return this._pattern
  }

  set pattern (value: string | RegExp) {
    this._pattern = value
  }

  /**
   * How far to go down to the root when looking for matching nodes
   * @return {number}
   */
  get depth (): number {
    return this._depth
  }

  set depth (value: number) {
    this._depth = value
  }
}
