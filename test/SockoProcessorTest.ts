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
import { ProcessorOptionsFactory } from '../lib/options/ProcessorOptionsFactory'
import { SkippedNodeBuilder } from '../lib/builders/SkippedNodeBuilder'
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('originalContent') })
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testStatic')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('staticContent') })
        .build()
    )
    .withChild(
      new SocketNodeBuilder()
        .withName('testSocket')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('>>><<<') })
        .withCartridgeSlot(
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('staticContentInBranch') })
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
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('overriddenContent') })
        .build()
    )
    .withChild(
      new CartridgeNodeBuilder()
        .withName('testCartridge')
        .withReadContent((): Bluebird<any> => { return Bluebird.resolve('cartridgeContent') })
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testBucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testBucketEntry')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('testBucketEntryContent') })
            .build()
        )
        .build()
    )
    .build()
}

describe(
  'SockoProcessor', (): void => {
    let subject = new SockoProcessor()
    it('should process and _merge all nodes', function (): Bluebird<void> {
      return subject.process(getInputNode(), getHierarchyNode(), new ProcessorOptionsFactory().create())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)

            return Bluebird.props(
              {
                overrideTest: value.getNodeByPath('/_root/testOverride'),
                socketTest: value.getNodeByPath('/_root/testSocket'),
                bucketTest: value.getNodeByPath('/_root/testBucket'),
                staticTest: value.getNodeByPath('/_root/testStatic'),
                branchTest: value.getNodeByPath('/_root/testBranch')
              }
            )
          }
        )
        .then(
          value => {

            chai.expect(
              value.bucketTest.getChildren().length
            ).to.equal(1)

            chai.expect(
              (value.bucketTest.getChildren()[0] as OutputNodeInterface).name
            ).to.equal('testBucketEntry')

            chai.expect(
              value.branchTest.getChildren().length
            ).to.equal(1)

            chai.expect(
              (value.branchTest.getChildren()[0] as OutputNodeInterface).name
            ).to.equal('testStaticNodeInBranch')

            return Bluebird.props(
              {
                overrideTest: (value.overrideTest as OutputNodeInterface).readContent(),
                socketTest: (value.socketTest as OutputNodeInterface).readContent(),
                bucketTest: (value.bucketTest.getChildren()[0] as OutputNodeInterface).readContent(),
                staticTest: (value.staticTest as OutputNodeInterface).readContent(),
                branchTest: (value.branchTest.getChildren()[0] as OutputNodeInterface).readContent()
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              value.overrideTest
            ).to.equal('overriddenContent')

            chai.expect(
              value.socketTest
            ).to.equal('>>>cartridgeContent<<<')

            chai.expect(
              value.bucketTest
            ).to.equal('testBucketEntryContent')

            chai.expect(
              value.staticTest
            ).to.equal('staticContent')

            chai.expect(
              value.branchTest
            ).to.equal('staticContentInBranch')
          }
        )
    })

    it('should filter nodes', function (): Bluebird<void> {
      let options = new ProcessorOptionsFactory().create()
      options.processResultTreeNode = node => {
        if (node.name === 'testStatic') {
          return Bluebird.resolve(new SkippedNodeBuilder().build())
        }
        return Bluebird.resolve(node)
      }
      return subject.process(getInputNode(), getHierarchyNode(), options)
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)

            return chai.expect(
              value.getNodeByPath('/_root/testStatic')
            ).to.be.rejectedWith('Node with name testStatic not found')
          }
        )
    })
  }
)
