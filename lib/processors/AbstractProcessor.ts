import { ProcessorInterface } from './ProcessorInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { NeedRootNodeError } from '../errors/NeedRootNodeError'
import { getLogger, Logger } from 'loglevel'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { RootNodeBuilder } from '../builders/RootNodeBuilder'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import Bluebird = require('bluebird')

export abstract class AbstractProcessor<C extends SockoNodeInterface> implements ProcessorInterface {

  protected _log: Logger
  private _neededType: SockoNodeType

  constructor (processorName: string, neededType: SockoNodeType) {
    this._log = getLogger(`socko-api:${processorName}`)
    this._neededType = neededType
  }

  public process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    if (!inputNode.isRoot()) {
      return Bluebird.reject(new NeedRootNodeError(inputNode))
    }

    return this._processInternal(inputNode, hierarchyNode)
  }

  protected abstract _process (
    inputNode: C,
    hierarchyNode: SockoNodeInterface
  ): Bluebird<SockoNodeInterface>

  private _processInternal (
    inputNode: SockoNodeInterface,
    hierarchyNode: SockoNodeInterface
  ): Bluebird<SockoNodeInterface> {
    if (inputNode.type === this._neededType) {
      return this._process(inputNode as C, hierarchyNode)
    }

    let outputNode: SockoNodeInterface
    if (inputNode.type === SockoNodeType.Root) {
      outputNode = new RootNodeBuilder().build()
    } else {
      outputNode = new OutputNodeBuilder()
        .withName(inputNode.name)
        .withContent(inputNode.content)
        .build()
    }
    return Bluebird.reduce<SockoNodeInterface, Array<SockoNodeInterface>>(
      inputNode.getChildren() as Array<SockoNodeInterface>,
      (total, current) => {
        return this._processInternal(current as C, hierarchyNode)
          .then(
            processedNode => {
              total.push(processedNode)
              return Bluebird.resolve(total)
            }
          )
      },
      []
    )
      .then(
        outputNodes => {
          for (let childNode of outputNodes) {
            outputNode.addChild(childNode)
          }
          return Bluebird.resolve(outputNode)
        }
      )
  }
}
