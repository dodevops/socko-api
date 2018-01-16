/**
 * Test the [[OverrideNodeProcessor]]
 */

import 'mocha'
import { OverrideNodeProcessor } from '../lib/processors/OverrideNodeProcessor'
import { SockoNodeType } from '../lib/nodes/SockoNodeType'
import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
import { RootNodeBuilder } from '../lib/builders/RootNodeBuilder'
import { SimpleNodeBuilder } from '../lib/builders/SimpleNodeBuilder'
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'
import { ProcessorOptionsFactory } from '../lib/options/ProcessorOptionsFactory'
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
      new SimpleNodeBuilder()
        .withName('testOverride1')
        .withReadContent(
          function (): Bluebird<any> {
            return Bluebird.resolve('originalContent1')
          })
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride2')
        .withReadContent(
          function (): Bluebird<any> {
            return Bluebird.resolve('originalContent2')
          })
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testOverrideSubNode')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testOverrideSubNode1')
            .withReadContent(
              function (): Bluebird<any> {
                return Bluebird.resolve('originalContentSubNode1')
              })
            .build()
        )
        .build()
    )
    .build()
}

function getTestHierarchy (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride1')
        .withReadContent(
          function (): Bluebird<any> {
            return Bluebird.resolve('overriddenContent1')
          })
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testOverrideSubNode')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testOverrideSubNode1')
            .withReadContent(
              function (): Bluebird<any> {
                return Bluebird.resolve('overriddenSubContent1')
              })
            .build()
        )
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testOverride2')
            .withReadContent(
              function (): Bluebird<any> {
                return Bluebird.resolve('overriddenContent2')
              })
            .build()
        )
        .build()
    )
    .build()
}

describe(
  'OverrideNodeProcessor', function (): void {
    let subject = new OverrideNodeProcessor()
    it('should process a node correctly', function (): Bluebird<void> {
      return subject.process(getTestInput(), getTestHierarchy(), new ProcessorOptionsFactory().create())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)
            return Bluebird.props(
              {
                override1: value.getNodeByPath('/_root/testOverride1'),
                override2: value.getNodeByPath('/_root/testOverride2'),
                subnodes: value.getNodeByPath('/_root/testOverrideSubNode')
              }
            )
          }
        )
        .then(
          value => {

            chai.expect(
              value.subnodes.getChildren().length
            ).to.equal(1)

            return Bluebird.props(
              {
                override1: (value.override1 as OutputNodeInterface).readContent(),
                override2: (value.override2 as OutputNodeInterface).readContent(),
                subnode: (value.subnodes.getChildren()[0] as OutputNodeInterface).readContent()
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              value.override1
            ).to.equal('overriddenContent1')
            chai.expect(
              value.override2
            ).to.equal('originalContent2')

            chai.expect(
              value.subnode
            ).to.equal('originalContentSubNode1')
          }
        )
    })
    it('should work on a subnode',
      function (): Bluebird<void> {
        return getTestHierarchy().getNodeByPath('/_root/subNode')
          .then(
            testHierarchy => {
              return subject.process(
                getTestInput(),
                testHierarchy as SockoNodeInterface,
                new ProcessorOptionsFactory().create()
              )
            }
          )
          .then(
            value => {
              chai.expect(
                value.type
              ).to.equal(SockoNodeType.Root)
              return Bluebird.props(
                {
                  override1: value.getNodeByPath('/_root/testOverride1'),
                  override2: value.getNodeByPath('/_root/testOverride2'),
                  subnodes: value.getNodeByPath('/_root/testOverrideSubNode')
                }
              )
            }
          )
          .then(
            value => {

              chai.expect(
                value.subnodes.getChildren().length
              ).to.equal(1)

              return Bluebird.props(
                {
                  override1: (value.override1 as OutputNodeInterface).readContent(),
                  override2: (value.override2 as OutputNodeInterface).readContent(),
                  subnode: (value.subnodes.getChildren()[0] as OutputNodeInterface).readContent()
                }
              )
            }
          )
          .then(
            value => {
              chai.expect(
                value.override1
              ).to.equal('overriddenContent1')
              chai.expect(
                value.override2
              ).to.equal('overriddenContent2')

              chai.expect(
                value.subnode
              ).to.equal('originalContentSubNode1')
            }
          )
      }
    )
  }
)
