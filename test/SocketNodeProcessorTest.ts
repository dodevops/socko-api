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
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')

chai.use(chaiAsPromised)

// for Browser tests

if (typeof window !== 'undefined') {
  mocha.setup(
    {
      ui: 'bdd'
    }
  )
}

function getTestInput (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SocketNodeBuilder()
        .withName('socketTest')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
            .withCartridgeSlot(
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeContent1') })
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testCartridge2')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeContent2') })
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testNotMatchingCartridge')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('') })
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testCartridge1')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeSubNodeContent1') })
            .build()
        )
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testCartridge3')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeContent3') })
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('subSubNode')
            .withChild(
              new CartridgeNodeBuilder()
                .withName('testCartridge4')
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeContent4') })
                .build()
            )
            .build()
        )
        .withChild(
          new CartridgeNodeBuilder()
            .withName('testSubNodeCartridge')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeSubNodeContent') })
            .build()
        )
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testSubNodeCartridge')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeRootContent') })
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
            return Bluebird.props(
              {
                socketTest: (value.socketTest as OutputNodeInterface).readContent(),
                socketTestCollectorInfinite: (value.socketTestCollectorInfinite as OutputNodeInterface).readContent(),
                socketTestCollectorMaxDepth0: (value.socketTestCollectorMaxDepth0 as OutputNodeInterface).readContent(),
                socketTestCollectorMaxDepth1: (value.socketTestCollectorMaxDepth1 as OutputNodeInterface).readContent(),
                socketTestCollectorRegexp: (value.socketTestCollectorRegexp as OutputNodeInterface).readContent(),
                subNodeSocket: (value.subNodeSocket as OutputNodeInterface).readContent()
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              value.socketTest
            ).to.equal('>>>cartridgeSubNodeContent1<<<')

            chai.expect(
              value.socketTestCollectorInfinite
            ).to.equal(
              '>>>cartridgeContent1cartridgeContent2cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              value.socketTestCollectorMaxDepth0
            ).to.equal(
              '>>>cartridgeContent4<<<'
            )

            chai.expect(
              value.socketTestCollectorMaxDepth1
            ).to.equal(
              '>>>cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              value.socketTestCollectorRegexp
            ).to.equal(
              '>>>cartridgeContent1cartridgeContent2cartridgeSubNodeContent1cartridgeContent3cartridgeContent4<<<'
            )

            chai.expect(
              value.subNodeSocket
            ).to.equal('>>>cartridgeSubNodeContent<<<')

          }
        )
    })
  }
)
