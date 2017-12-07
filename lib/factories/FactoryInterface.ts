import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import Bluebird = require('bluebird')

export interface FactoryInterface<T> {
  create (): T

  merge? (origin: T, merger: T): Bluebird<T>

  fromNode? (source: SockoNodeInterface): T
}
