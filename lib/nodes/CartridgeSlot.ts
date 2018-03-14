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

  private _isEnvironmentSlot: boolean

  get isCollector (): boolean {
    return this._isCollector
  }

  set isCollector (value: boolean) {
    this._isCollector = value
  }

  get cartridgeName (): string {
    return this._cartridgeName
  }

  set cartridgeName (value: string) {
    this._cartridgeName = value
  }

  get cartridgePattern (): string | RegExp {
    return this._cartridgePattern
  }

  set cartridgePattern (value: string | RegExp) {
    this._cartridgePattern = value
  }

  get index (): number {
    return this._index
  }

  set index (value: number) {
    this._index = value
  }

  get maxDepth (): number {
    return this._maxDepth
  }

  set maxDepth (value: number) {
    this._maxDepth = value
  }

  get cartridgeContent (): string {
    return this._cartridgeContent
  }

  set cartridgeContent (value: string) {
    this._cartridgeContent = value
  }

  get isEnvironmentSlot (): boolean {
    return this._isEnvironmentSlot
  }

  set isEnvironmentSlot (value: boolean) {
    this._isEnvironmentSlot = value
  }
}
