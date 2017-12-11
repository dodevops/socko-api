/**
 * @module socko-api
 */
/**
 */
import { getLogger } from 'loglevel'

/**
 * An abstract error implementation
 */
export class AbstractError extends Error {

  constructor (message: string) {
    super(message)
    getLogger('socko-api').error(this.message)
  }
}