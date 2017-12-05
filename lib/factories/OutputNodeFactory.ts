import { InvalidMergeNode } from '../errors/InvalidMergeNode'
import { OutputNode } from '../nodes/OutputNode'
import Bluebird = require('bluebird')

export class OutputNodeFactory {
  public merge (node: OutputNode, mergerNode: OutputNode): Bluebird<OutputNode> {
    if (node.name !== mergerNode.name) {
      return Bluebird.reject(new InvalidMergeNode(node, mergerNode))
    }

    node.content = mergerNode.content

    let tasks: Array<Bluebird<OutputNode>> = []

    for (let childNode of mergerNode.getChildren() as Array<OutputNode>) {
      let found = false
      for (let existingNode of node.getChildren() as Array<OutputNode>) {
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
}
