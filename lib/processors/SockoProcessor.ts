/**
 * @module socko-api
 */
/**
 */
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
import Bluebird = require('bluebird')

/**
 * The main SOCKO! processor.
 *
 * This will call all other processors and merge their results together to form one resulting tree.
 */
export class SockoProcessor implements ProcessorInterface {

  private _log: Logger

  constructor () {
    this._log = getLogger('socko-api:SockoProcessor')
  }

  public process (inputNode: SockoNodeInterface, hierarchyNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {

    this._log.debug('Walking through available processors')

    return Bluebird.all(
      [
        new OverrideNodeProcessor().process(inputNode, hierarchyNode),
        new BucketNodeProcessor().process(inputNode, hierarchyNode),
        new SocketNodeProcessor().process(inputNode, hierarchyNode)
      ]
    )
      .then(
        processedNodes => {
          this._log.debug('Merging results')
          return Bluebird.reduce<SockoNodeInterface, SockoNodeInterface>(
            processedNodes,
            (memo, item) => {
              return this.merge(memo, item)
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
   * @return {Bluebird<SockoNodeInterface>} the result of the merge operation
   */
  private merge (origin: SockoNodeInterface, merger: SockoNodeInterface): Bluebird<SockoNodeInterface> {

    if (origin.name !== merger.name) {
      this._log.debug('We somehow try to merge two incoherent nodes.')
      return Bluebird.reject(new InvalidMergeNode(origin, merger))
    }

    this._log.debug(`Merging node ${origin.name}`)

    let processed

    if (origin.type === SockoNodeType.Root) {
      this._log.debug('Starting a new root node')
      processed = new RootNodeBuilder().build()
    } else {
      this._log.debug('Starting a new output node')
      processed = new OutputNodeBuilder()
        .withName(origin.name)
        .build()

    }

    if (merger.type !== SockoNodeType.Skipped) {
      this._log.debug('The merger node was processed. Use its content')
      processed.content = merger.content
    } else {
      this._log.debug('The merger node was skipped. Use the content of the original node')
      processed.content = origin.content
      if (merger.getChildren().length === 0) {
        for (let child of origin.getChildren() as Array<SockoNodeInterface>) {
          processed.addChild(child)
        }
      }
    }

    let tasks: Array<Bluebird<OutputNodeInterface>> = []

    this._log.debug('Merge the children')

    for (let mergerChild of merger.getChildren() as Array<SockoNodeInterface>) {
      let found = false
      for (let originChild of origin.getChildren() as Array<SockoNodeInterface>) {
        if (originChild.name === mergerChild.name) {
          tasks.push(this.merge(originChild, mergerChild))
          found = true
        }
      }
      if (!found) {
        this._log.debug(`A node unknown to the origin was found. Add node ${mergerChild.name}`)
        tasks.push(Bluebird.resolve(mergerChild))
      }
    }

    return Bluebird.all(
      tasks
    )
      .then(
        processedChildNodes => {
          this._log.debug('Adding merged child nodes')
          for (let child of processedChildNodes) {
            processed.addChild(child)
          }
          return Bluebird.resolve(processed)
        }
      )
      .then(
        processedNode => {
          if (processedNode.type !== SockoNodeType.Root && processedNode.getChildren().length > 0) {
            this._log.debug('The resulting node has children. Convert it to a branch node')
            let branchNode = new BranchNodeBuilder()
              .withName(processedNode.name)
              .build()
            for (let child of processedNode.getChildren()) {
              branchNode.addChild(child)
            }
            return Bluebird.resolve(branchNode)
          } else {
            return Bluebird.resolve(processedNode)
          }
        }
      )
  }
}
