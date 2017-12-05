import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { RootNode } from '../lib/nodes/RootNode'
import { SimpleNode } from '../lib/nodes/SimpleNode'
import { NodeBuilder } from '../lib/nodes/NodeBuilder'

export function getTestInput (): SockoNodeInterface {
  return new NodeBuilder(new RootNode())
    .withChild(
      new NodeBuilder(new SimpleNode())
        .withName('testfile1')
        .withContent('123')
        .build()
    )
    .withChild(
      new NodeBuilder(new SimpleNode())
        .withName('testfile2')
        .withContent('456')
        .build()
    )
    .build()
}

export function getTestHierarchy (): SockoNodeInterface {
  return new NodeBuilder(new RootNode())
    .withChild(
      new NodeBuilder(new SimpleNode()).withName('testfile1').withContent('ABC').build()
    )
    .withChild(
      new NodeBuilder(new SimpleNode())
        .withName('testsubnode1')
        .withChild(
          new NodeBuilder(new SimpleNode())
            .withName('testfile1')
            .withContent('DEF')
            .build()
        )
        .build()
    )
    .withChild(
      new NodeBuilder(new SimpleNode())
        .withName('testsubnode3')
        .build()
    )
    .build()
}
