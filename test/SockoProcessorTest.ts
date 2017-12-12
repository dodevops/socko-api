/**
 * Test the [[SockoNodeProcessor]]
 */

import 'mocha'
import { SockoProcessor } from '../lib/processors/SockoProcessor'
import { RootNodeBuilder } from '../lib/builders/RootNodeBuilder'
import { SimpleNodeBuilder } from '../lib/builders/SimpleNodeBuilder'
import { SocketNodeBuilder } from '../lib/builders/SocketNodeBuilder'
import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { CartridgeSlotBuilder } from '../lib/builders/CartridgeSlotBuilder'
import { BucketNodeBuilder } from '../lib/builders/BucketNodeBuilder'
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'
import { CartridgeNodeBuilder } from '../lib/builders/CartridgeNodeBuilder'
import { SockoNodeType } from '../lib/nodes/SockoNodeType'
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
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

function getInputNode (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride')
        .withContent('originalContent')
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testStatic')
        .withContent('staticContent')
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('testSocket')
        .withContent('>>><<<')
        .withCartridgeInsertionPoint(
          new CartridgeSlotBuilder()
            .withIndex(3)
            .withCartridgeName('testCartridge')
            .build()
        )
        .build()
    )
    .withChild(
      new BucketNodeBuilder()
        .withName('testBucket')
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testBranch')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testStaticNodeInBranch')
            .withContent('staticContentInBranch')
            .build()
        )
        .build()
    )
    .build()
}

function getHierarchyNode (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride')
        .withContent('overriddenContent')
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testCartridge')
        .withContent('cartridgeContent')
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testBucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testBucketEntry')
            .withContent('testBucketEntryContent')
            .build()
        )
        .build()
    )
    .build()
}

describe(
  'SockoProcessor', (): void => {
    let subject = new SockoProcessor()
    it('should process and merge all nodes', function (): Bluebird<void> {
      return subject.process(getInputNode(), getHierarchyNode())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)

            return Bluebird.props(
              {
                overrideTest: value.getNodeByPath('_root/testOverride'),
                socketTest: value.getNodeByPath('_root/testSocket'),
                bucketTest: value.getNodeByPath('_root/testBucket'),
                staticTest: value.getNodeByPath('_root/testStatic'),
                branchTest: value.getNodeByPath('_root/testBranch')
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              (value.overrideTest as OutputNodeInterface).content
            ).to.equal('overriddenContent')

            chai.expect(
              (value.socketTest as OutputNodeInterface).content
            ).to.equal('>>>cartridgeContent<<<')

            chai.expect(
              value.bucketTest.getChildren().length
            ).to.equal(1)

            chai.expect(
              (value.bucketTest.getChildren()[0] as OutputNodeInterface).name
            ).to.equal('testBucketEntry')
            chai.expect(
              (value.bucketTest.getChildren()[0] as OutputNodeInterface).content
            ).to.equal('testBucketEntryContent')

            chai.expect(
              (value.staticTest as OutputNodeInterface).content
            ).to.equal('staticContent')

            chai.expect(
              value.branchTest.getChildren().length
            ).to.equal(1)

            chai.expect(
              (value.branchTest.getChildren()[0] as OutputNodeInterface).name
            ).to.equal('testStaticNodeInBranch')
            chai.expect(
              (value.branchTest.getChildren()[0] as OutputNodeInterface).content
            ).to.equal('staticContentInBranch')
          }
        )
    })
  }
)
