import { AbstractError } from './AbstractError'
import { CartridgeSlotInterface } from '../nodes/CartridgeSlotInterface'

/**
 * No cartridges were found for a cartridge slot
 */
export class NoCartridgeFoundError extends AbstractError {

  constructor (slot: CartridgeSlotInterface) {
    super(`No cartridges found for slot: ${JSON.stringify(slot)}`)
    this.name = 'NoCartridgeFoundError'
  }
}
