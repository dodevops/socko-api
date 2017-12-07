import { CartridgeInsertionPointInterface } from '../sockets/CartridgeInsertionPointInterface'
import { CartridgeInsertionPointFactory } from '../factories/CartridgeInsertionPointFactory'

export class CartridgeInsertionPointBuilder {
  private _cartridgeInsertionPoint: CartridgeInsertionPointInterface

  constructor () {
    this._cartridgeInsertionPoint = new CartridgeInsertionPointFactory().create()
  }

  public withIsCollector (isCollector: boolean): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.isCollector = isCollector
    return this
  }

  public withCartridgeName (cartridgeName: string): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.cartridgeName = cartridgeName
    return this
  }

  public withCartridgePattern (cartridgePattern: string): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.cartridgePattern = cartridgePattern
    return this
  }

  public withIndex (index: number): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.index = index
    return this
  }

  public withMaxDepth (maxDepth: number): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.maxDepth = maxDepth
    return this
  }

  public withCartridgeContent (cartridgeContent: string): CartridgeInsertionPointBuilder {
    this._cartridgeInsertionPoint.cartridgeContent = cartridgeContent
    return this
  }

  public build (): CartridgeInsertionPointInterface {
    return this._cartridgeInsertionPoint
  }
}
