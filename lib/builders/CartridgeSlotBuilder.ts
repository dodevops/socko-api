import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'
import { CartridgeSlotFactory } from '../factories/CartridgeSlotFactory'

/**
 * A builder for [[CartridgeSlotInterface]]s
 */
export class CartridgeSlotBuilder {
  private _cartridgeSlot: CartridgeSlotInterface

  constructor () {
    this._cartridgeSlot = new CartridgeSlotFactory().create()
  }

  /**
   * Set the isCollector parameter of the [[CartridgeSlotInterface]]
   * @param {boolean} isCollector
   * @return {CartridgeSlotBuilder}
   */
  public withIsCollector (isCollector: boolean): CartridgeSlotBuilder {
    this._cartridgeSlot.isCollector = isCollector
    return this
  }

  /**
   * Set the cartridgeName parameter of the [[CartridgeSlotInterface]]
   * @param {string} cartridgeName
   * @return {CartridgeSlotBuilder}
   */
  public withCartridgeName (cartridgeName: string): CartridgeSlotBuilder {
    this._cartridgeSlot.cartridgeName = cartridgeName
    return this
  }

  /**
   * Set the cartridgePattern parameter of the [[CartridgeSlotInterface]]
   * @param {string | RegExp} cartridgePattern
   * @return {CartridgeSlotBuilder}
   */
  public withCartridgePattern (cartridgePattern: string | RegExp): CartridgeSlotBuilder {
    this._cartridgeSlot.cartridgePattern = cartridgePattern
    return this
  }

  /**
   * Set the index parameter of the [[CartridgeSlotInterface]]
   * @param {number} index
   * @return {CartridgeSlotBuilder}
   */
  public withIndex (index: number): CartridgeSlotBuilder {
    this._cartridgeSlot.index = index
    return this
  }

  /**
   * Set the maxDepth parameter of the [[CartridgeSlotInterface]]
   * @param {number} maxDepth
   * @return {CartridgeSlotBuilder}
   */
  public withMaxDepth (maxDepth: number): CartridgeSlotBuilder {
    this._cartridgeSlot.maxDepth = maxDepth
    return this
  }

  /**
   * Set the cartridgeContent parameter of the [[CartridgeSlotInterface]]
   * @param {string} cartridgeContent
   * @return {CartridgeSlotBuilder}
   */
  public withCartridgeContent (cartridgeContent: string): CartridgeSlotBuilder {
    this._cartridgeSlot.cartridgeContent = cartridgeContent
    return this
  }

  public withEnvironment (): CartridgeSlotBuilder {
    this._cartridgeSlot.isEnvironmentSlot = true
    return this
  }

  /**
   * Assemble the [[CartridgeSlotInterface]] and return it
   * @return {CartridgeSlotInterface}
   */
  public build (): CartridgeSlotInterface {
    return this._cartridgeSlot
  }
}
