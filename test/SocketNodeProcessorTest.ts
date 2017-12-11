/**
 * @module socko-api-tests
 */
/**
 * Test the [[SocketNodeProcessor]]
 */

import 'mocha'
import { SocketNodeProcessor } from '../lib/processors/SocketNodeProcessor'
import { RootNodeBuilder } from '../lib/builders/RootNodeBuilder'
import { SocketNodeBuilder } from '../lib/builders/SocketNodeBuilder'
import { CartridgeSlotBuilder } from '../lib/builders/CartridgeSlotBuilder'
import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { CartridgeNodeBuilder } from '../lib/builders/CartridgeNodeBuilder'
import { SimpleNodeBuilder } from '../lib/builders/SimpleNodeBuilder'
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'

chai.use(chaiAsPromised)

function getTestInput (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTest')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withCartridgeName('testCartridge1')
            .withIndex(3)
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTestCollectorInfinite')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withIsCollector(true)
            .withCartridgePattern('testCartridge*')
            .withIndex(3)
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTestCollectorMaxDepth0')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withIsCollector(true)
            .withCartridgePattern('testCartridge*')
            .withIndex(3)
            .withMaxDepth(0)
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTestCollectorMaxDepth1')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withIsCollector(true)
            .withCartridgePattern('testCartridge*')
            .withIndex(3)
            .withMaxDepth(1)
            .build()
        )
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTestCollectorRegexp')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withIsCollector(true)
            .withCartridgePattern(/testCartridge.*/)
            .withIndex(3)
            .build()
        )
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          new SocketNodeBuilder()
            .withName('subNodeSocket')
            .withContent('>>><<<')
            .withCartridgeInsertionPoint(
              new CartridgeSlotBuilder()
                .withCartridgeName('testSubNodeCartridge')
                .withIndex(3)
                .build()
            )
            .build()
        )
        .build()
    )
    .build()
}

function getTestHierarchy (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testCartridge1')
        .withContent('cartridgeContent1')
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testCartridge2')
        .withContent('cartridgeContent2')
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testNotMatchingCartridge')
        .withContent('')
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testCartridge1')
            .withContent('cartridgeSubNodeContent1')
            .build()
        )
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testCartridge3')
            .withContent('cartridgeContent3')
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('subSubNode')
            .withChild(
              new CartridgeNodeBuilder()
                .withName('testCartridge4')
                .withContent('cartridgeContent4')
                .build()
            )
            .build()
        )
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testSubNodeCartridge')
            .withContent('cartridgeSubNodeContent')
            .build()
        )
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testSubNodeCartridge')
        .withContent('cartridgeRootContent')
        .build()
    )
    .build()

}

describe(
  'SocketNodeProcessor', function (): void {
    let subject = new SocketNodeProcessor()
    it('should work', function (): Bluebird<void> {
      return getTestHierarchy().getNodeByPath('_root/subNode/subSubNode')
        .then(
          testHierarchy => {
            return subject.process(getTestInput(), testHierarchy as SockoNodeInterface)
          }
        )
        .then(
          value => {
            return Bluebird.props(
              {
                socketTest: value.getNodeByPath('_root/socketTest'),
                socketTestCollectorInfinite: value.getNodeByPath('_root/socketTestCollectorInfinite'),
                socketTestCollectorMaxDepth0: value.getNodeByPath('_root/socketTestCollectorMaxDepth0'),
                socketTestCollectorMaxDepth1: value.getNodeByPath('_root/socketTestCollectorMaxDepth1'),
                socketTestCollectorRegexp: value.getNodeByPath('_root/socketTestCollectorRegexp'),
                subNodeSocket: value.getNodeByPath('_root/subNode/subNodeSocket')
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              (value.socketTest as OutputNodeInterface).content
            ).to.equal('>>>cartridgeSubNodeContent1<<<')

            chai.expect(
              (value.socketTestCollectorInfinite as OutputNodeInterface).content
            ).to.equal(
              '>>>cartridgeContent1cartridgeContent2cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              (value.socketTestCollectorMaxDepth0 as OutputNodeInterface).content
            ).to.equal(
              '>>>cartridgeContent4<<<'
            )

            chai.expect(
              (value.socketTestCollectorMaxDepth1 as OutputNodeInterface).content
            ).to.equal(
              '>>>cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              (value.socketTestCollectorRegexp as OutputNodeInterface).content
            ).to.equal(
              '>>>cartridgeContent1cartridgeContent2cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              (value.subNodeSocket as OutputNodeInterface).content
            ).to.equal('>>>cartridgeSubNodeContent<<<')

          }
        )
    })
  }
)
