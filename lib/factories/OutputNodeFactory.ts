import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { SockoNodeInterface } from '../nodes/SockoNodeInterface'
import { OutputNodeBuilder } from '../builders/OutputNodeBuilder'
import { FactoryInterface } from './FactoryInterface'
import { OutputNodeInterface } from '../nodes/OutputNodeInterface'
import { OutputNode } from '../nodes/OutputNode'
import Bluebird = require('bluebird')

export class OutputNodeFactory implements FactoryInterface<OutputNodeInterface> {
  public create (): OutputNodeInterface {
    let outputNode = new OutputNode()
    outputNode.name = ''
    outputNode.content = ''
    return outputNode
  }

  public merge (node: OutputNodeInterface, mergerNode: OutputNodeInterface): Bluebird<OutputNodeInterface> {
    if (node.name !== mergerNode.name) {
      return Bluebird.reject(new InvalidMergeNode(node, mergerNode))
    }

    node.content = mergerNode.content

    let tasks: Array<Bluebird<OutputNodeInterface>> = []

    for (let childNode of mergerNode.getChildren() as Array<OutputNodeInterface>) {
      let found = false
      for (let existingNode of node.getChildren() as Array<OutputNodeInterface>) {
        if (existingNode.name === childNode.name) {
          tasks.push(this.merge(existingNode, childNode))
          found = true
        }
      }
      if (!found) {
        node.addChild(childNode)
      }
    }

    return Bluebird.all(
      tasks
    )
      .then(
        () => {
          return Bluebird.resolve(node)
        }
      )
  }

  public fromNode (sourceNode: SockoNodeInterface): OutputNodeInterface {
    let nodeBuilder = new OutputNodeBuilder()
      .withName(sourceNode.name)
      .withContent(sourceNode.content)
    for (let childNode of sourceNode.getChildren() as Array<SockoNodeInterface>) {
      nodeBuilder.withChild(this.fromNode(childNode))
    }
    return nodeBuilder.build()
  }

}
