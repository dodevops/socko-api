import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { RootNodeBuilder } from '../lib/builders/RootNodeBuilder'
import { SimpleNodeBuilder } from '../lib/builders/SimpleNodeBuilder'
import { SocketNodeBuilder } from '../lib/builders/SocketNodeBuilder'
import { CartridgeInsertionPointBuilder } from '../lib/builders/CartridgeInsertionPointBuilder'
import { CartridgeNodeBuilder } from '../lib/builders/CartridgeNodeBuilder'

export function getTestInput (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testfile1')
        .withContent('123')
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testfile2')
        .withContent('456')
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('testsocket1')
        .withContent('this >>><<< is the cartridge content')
        .withCartridgeInsertionPoint(
          new CartridgeInsertionPointBuilder()
            .withIndex(8)
            .withCartridgeName('testcartridge1')
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('testsocket2')
        .withContent('1:')
        .withCartridgeInsertionPoint(
          new CartridgeInsertionPointBuilder()
            .withIndex(2)
            .withIsCollector(true)
            .withCartridgePattern('testcartridge*')
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('testsocket3')
        .withContent('1:')
        .withCartridgeInsertionPoint(
          new CartridgeInsertionPointBuilder()
            .withIndex(2)
            .withIsCollector(true)
            .withCartridgePattern('testcartridge*')
            .withMaxDepth(0)
            .build()
        )
        .build()
    )
    .build()
}

export function getTestHierarchy (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testfile1')
        .withContent('ABC')
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testsubnode1')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testfile1')
            .withContent('DEF')
            .build()
        )
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testcartridgesub')
            .withContent('SUBCARTRIDGE')
            .build()
        )
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testsubnode3')
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testcartridge1')
        .withContent('CARTRIDGE')
        .build()
    )
    .build()
}
