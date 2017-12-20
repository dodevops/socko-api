import { ProcessorInterface } from './ProcessorInterface'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OverrideNodeProcessor } from './OverrideNodeProcessor'
import { BucketNodeProcessor } from './BucketNodeProcessor'
import { SocketNodeProcessor } from './SocketNodeProcessor'
import { RootNodeBuilder } from '../builders/RootNodeBuilder'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { SockoNodeType } from '../nodes/SockoNodeType'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { BranchNodeBuilder } from '../builders/BranchNodeBuilder'
import { getLogger, Logger } from 'loglevel'
import { ProcessorOptionsInterface } from '../options/ProcessorOptionsInterface'
import Bluebird = require('bluebird')

/**
 * The main SOCKO! processor.
 *
 * This will call all other processors and _merge their results together to form one resulting tree.
 */
export class SockoProcessor implements ProcessorInterface {

  private _log: Logger
  private _options: ProcessorOptionsInterface

  constructor () {
    this._log = getLogger('socko-api:SockoProcessor')
  }

  public process (inputNode: SockoNodeInterface,
                  hierarchyNode: SockoNodeInterface,
                  options: ProcessorOptionsInterface): Bluebird<SockoNodeInterface> {

    this._options = options

    this._log.debug('Walking through available processors')

    return Bluebird.all(
      [
        new OverrideNodeProcessor().process(inputNode, hierarchyNode, options),
        new BucketNodeProcessor().process(inputNode, hierarchyNode, options),
        new SocketNodeProcessor().process(inputNode, hierarchyNode, options)
      ]
    )
      .then(
        processedNodes => {
          this._log.debug('Merging results')
          return Bluebird.reduce<SockoNodeInterface, SockoNodeInterface>(
            processedNodes,
            (original, merger) => {
              return this._merge(original, merger)
                .then(
                  value => {
                    return Bluebird.resolve(value)
                  }
                )
            },
            new RootNodeBuilder().build()
          )
        }
      )
  }

  /**
   * Merge one node (the merger) over the other node (the origin). Nodes with the same name will be overwritten, if
   * the node from the merger node is not an implementation of [[SkippedNodeInterface]].
   *
   * The merged result is returned
   *
   * @param {SockoNodeInterface} origin the origin node
   * @param {SockoNodeInterface} merger the node, that is merger over the origin node
   * @return {Bluebird<SockoNodeInterface>} the result of the _merge operation
   */
  private _merge (origin: SockoNodeInterface, merger: SockoNodeInterface): Bluebird<SockoNodeInterface> {

    this._log.debug('Sanity checking merging nodes')

    if (origin.name !== merger.name) {
      this._log.debug('We somehow try to _merge two incoherent nodes.')
      return Bluebird.reject(new InvalidMergeNode(origin, merger))
    }

    if (origin.type !== SockoNodeType.Skipped && merger.type !== SockoNodeType.Skipped && origin.type !== merger.type) {
      this._log.debug('Merger and origin had different types.')
      return Bluebird.reject(new InvalidMergeNode(origin, merger))
    }

    this._log.debug(`Processing ${origin.name}`)

    let processed

    if (origin.type === SockoNodeType.Root || merger.type === SockoNodeType.Root) {
      processed = new RootNodeBuilder().build()
    } else {
      processed = new BranchNodeBuilder().withName(origin.name).build()
    }

    let tasks: Array<Bluebird<SockoNodeInterface>> = []

    for (let originNode of origin.getChildren() as Array<SockoNodeInterface>) {
      if (originNode.type !== SockoNodeType.Skipped) {
        if (originNode.type === SockoNodeType.Output) {
          this._log.debug(`Adding node ${originNode.name}`)
          tasks.push(Bluebird.resolve(originNode))
        } else {
          let mergerChild = merger.getChildByName(originNode.name) as SockoNodeInterface
          if (mergerChild && mergerChild.type !== SockoNodeType.Skipped) {
            tasks.push(this._merge(originNode, mergerChild))
          } else {
            this._log.debug(`Adding node ${originNode.name}`)
            tasks.push(Bluebird.resolve(originNode))
          }
        }
      }
    }

    for (let mergerNode of merger.getChildren() as Array<SockoNodeInterface>) {
      if (mergerNode.type !== SockoNodeType.Skipped) {
        if (!origin.getChildByName(mergerNode.name)) {
          this._log.debug(`Adding node ${mergerNode.name}`)
          tasks.push(Bluebird.resolve(mergerNode))
        }
      }
    }

    return Bluebird.all(tasks)
      .then(
        processedChildren => {
          this._log.debug('Running ResultTreeNodeProcessor from options')
          return Bluebird.reduce<SockoNodeInterface, Array<SockoNodeInterface>>(
            processedChildren,
            (total, current) => {
              return this._options.processResultTreeNode(current)
                .then(
                  processedNode => {
                    if (processedNode.type !== SockoNodeType.Skipped) {
                      total.push(processedNode)
                    }
                    return Bluebird.resolve(total)
                  }
                )
            },
            []
          )
        }
      )
      .then(
        processedChildren => {
          this._log.debug('Adding procesed children')
          for (let child of processedChildren) {
            if (child.type !== SockoNodeType.Skipped) {
              processed.addChild(child)
            }
          }
          return Bluebird.resolve(processed)
        }
      )
  }

}
