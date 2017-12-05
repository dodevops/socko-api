import { AbstractNode } from 'js-hierarchy'
import { SockoNodeType } from './SockoNodeType'
import { SockoNodeInterface } from './SockoNodeInterface'

export abstract class AbstractSockoNode extends AbstractNode implements SockoNodeInterface {
  private _type: SockoNodeType
  private _content: string

  constructor (type: SockoNodeType) {
    super()
    this._type = type
  }

  get type (): SockoNodeType {
    return this._type
  }

  get content (): string {
    return this._content
  }

  set content (value: string) {
    this._content = value
  }
}
