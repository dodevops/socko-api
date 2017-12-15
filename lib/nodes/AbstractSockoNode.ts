import { AbstractNode } from 'js-hierarchy'
import { SockoNodeType } from './SockoNodeType'
import { SockoNodeInterface } from './SockoNodeInterface'
import Bluebird = require('bluebird')

/**
 * An abstract implementation of [[SockoNodeInterface]]
 */
export abstract class AbstractSockoNode extends AbstractNode implements SockoNodeInterface {
  private _type: SockoNodeType
  private _content: any

  constructor (type: SockoNodeType) {
    super()
    this._type = type
  }

  get type (): SockoNodeType {
    return this._type
  }

  set type (value: SockoNodeType) {
    this._type = value
  }

  public readContent (): Bluebird<any> {
    return Bluebird.resolve(this._content)
  }

  public writeContent (content: any): Bluebird<void> {
    this._content = content
    return Bluebird.resolve()
  }
}
