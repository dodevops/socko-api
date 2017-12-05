import { ProcessorInterface } from './ProcessorInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { NeedRootNodeError } from '../errors/NeedRootNodeError'
import { getLogger, Logger } from 'loglevel'
import Bluebird = require('bluebird')

export abstract class AbstractProcessor implements ProcessorInterface {

  protected _log: Logger

  constructor (processorName: string) {
    this._log = getLogger(`socko-api:${processorName}`)
  }

  public process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    if (!inputNode.isRoot()) {
      return Bluebird.reject(new NeedRootNodeError(inputNode))
    }

    return this._process(inputNode, hierarchyNode)
  }

  protected abstract _process (
    inputNode: SockoNodeInterface,
    hierarchyNode: SockoNodeInterface
  ): Bluebird<SockoNodeInterface>
}
