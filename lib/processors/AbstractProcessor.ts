import { ProcessorInterface } from './ProcessorInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { NeedRootNodeError } from '../errors/NeedRootNodeError'
import { getLogger, Logger } from 'loglevel'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { RootNodeBuilder } from '../builders/RootNodeBuilder'
import { SkippedNodeBuilder } from '../builders/SkippedNodeBuilder'
import { ProcessorOptionsInterface } from '../options/ProcessorOptionsInterface'
import Bluebird = require('bluebird')
import { BranchNodeBuilder } from '../builders/BranchNodeBuilder'

/**
 * An abstract implementation of [[ProcessorInterface]].
 */
export abstract class AbstractProcessor<C extends SockoNodeInterface> implements ProcessorInterface {

  public process (inputNode: SockoNodeInterface,
                  hierarchyNode: SockoNodeInterface,
                  options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface> {
    if (!inputNode.isRoot()) {
      return Bluebird.reject(new NeedRootNodeError(inputNode))
    }

    return this._processInternal(inputNode, hierarchyNode, options)
  }

  /**
   * Return the name of this processor (for logging purposes)
   * @return {string} the name of this processor
   * @private
   */
  protected abstract _getProcessorName (): string

  /**
   * Return the types, that this processor processes
   * @return {Array<SockoNodeType>}
   * @private
   */
  protected abstract _getNeededTypes (): Array<SockoNodeType>

  /**
   * Return an instance of the logger
   * @return {log.Logger} the logger to use
   * @private
   */
  protected _getLog (): Logger {
    return getLogger(`socko-api:${this._getProcessorName()}`)
  }

  /**
   * An abstract method, that is overridden by the processor to process its specific node type and return the
   * resulting nodes
   * @param {C} inputNode the input tree to process
   * @param {SockoNodeInterface} hierarchyNode the hierarchy tree to process
   * @param {ProcessorOptionsInterface} options processor options
   * @return {Bluebird<SockoNodeInterface>} the assembled nodes
   * @private
   */
  protected abstract _process (inputNode: C,
                               hierarchyNode: SockoNodeInterface,
                               options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface>

  /**
   * A recursive call to walk through the complete input node, look for node types, that are handled by processors
   * and run the processors on it
   * @param {SockoNodeInterface} inputNode the input tree
   * @param {SockoNodeInterface} hierarchyNode the hierarchy tree
   * @param {ProcessorOptionsInterface} options processor options
   * @return {Bluebird<SockoNodeInterface>} the assembled nodes
   * @private
   */
  private _processInternal (inputNode: SockoNodeInterface,
                            hierarchyNode: SockoNodeInterface,
                            options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface> {
    let processCall: Bluebird<SockoNodeInterface>
    this._getLog().debug(`Got node named ${inputNode.name}. Checking...`)
    if (this._getNeededTypes().indexOf(inputNode.type) !== -1) {
      this._getLog().debug(`Processing...`)
      processCall = this._process(inputNode as C, hierarchyNode, options)
    } else if (inputNode.type === SockoNodeType.Root) {
      this._getLog().debug('Creating root node')
      processCall = Bluebird.resolve(new RootNodeBuilder().build())
    } else if (inputNode.type === SockoNodeType.Branch) {
      this._getLog().debug('Creating branch node')
      processCall = Bluebird.resolve(new BranchNodeBuilder().withName(inputNode.name).build())
    } else {
      this._getLog().debug('Skipping...')
      processCall = Bluebird.resolve(new SkippedNodeBuilder().withName(inputNode.name).build())
    }

    let outputNode: SockoNodeInterface

    return processCall
      .then(
        processedNode => {
          outputNode = processedNode

          this._getLog().debug('Processing child nodes...')

          return Bluebird.reduce<SockoNodeInterface, Array<SockoNodeInterface>>(
            inputNode.getChildren() as Array<SockoNodeInterface>,
            (total, current) => {
              return this._processInternal(current as C, hierarchyNode, options)
                .then(
                  processedChildNode => {
                    total.push(processedChildNode)
                    return Bluebird.resolve(total)
                  }
                )
            },
            []
          )
        }
      )
      .then(
        outputNodes => {
          this._getLog().debug(`Completed processing child nodes of ${inputNode.name}.`)
          for (let childNode of outputNodes) {
            outputNode.addChild(childNode)
          }
          this._getLog().debug(`Completed node ${inputNode.name}`)
          return Bluebird.resolve(outputNode)
        }
      )
  }
}
