import { CartridgeSlotInterface } from './CartridgeSlotInterface'

/**
 * An implementation of [[CartridgeSlotInterface]]
 */
export class CartridgeSlot implements CartridgeSlotInterface {
  private _isCollector: boolean

  private _cartridgeName: string

  private _cartridgePattern: string | RegExp

  private _index: number

  private _maxDepth: number

  private _cartridgeContent: string

  /**
   * Is this insertion point a cartridge collector?
   * @return {boolean}
   */
  get isCollector (): boolean {
    return this._isCollector
  }

  set isCollector (value: boolean) {
    this._isCollector = value
  }

  /**
   * The name of the cartridge to insert, when this is not a cartridge collector
   * @return {string}
   */
  get cartridgeName (): string {
    return this._cartridgeName
  }

  set cartridgeName (value: string) {
    this._cartridgeName = value
  }

  /**
   * The pattern of the cartridge to search for, when this is a cartridge collector.
   * Either a glob pattern as a string or a regular expression object
   * @return {string | RegExp}
   */
  get cartridgePattern (): string | RegExp {
    return this._cartridgePattern
  }

  set cartridgePattern (value: string | RegExp) {
    this._cartridgePattern = value
  }

  /**
   * The string index at which to insert this cartridge or collection of cartridges
   * @return {number}
   */
  get index (): number {
    return this._index
  }

  set index (value: number) {
    this._index = value
  }

  /**
   * How far to traverse to root while looking for cartridges, if this is a cartridge collector
   * @return {number}
   */
  get maxDepth (): number {
    return this._maxDepth
  }

  set maxDepth (value: number) {
    this._maxDepth = value
  }

  /**
   * The content of the found cartridge(s) to insert at this insertion point
   * @return {string}
   */
  get cartridgeContent (): string {
    return this._cartridgeContent
  }

  set cartridgeContent (value: string) {
    this._cartridgeContent = value
  }
}
