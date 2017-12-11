/**
 * @module socko-api-tests
 */
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
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'

chai.use(chaiAsPromised)

function getTestInput (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride1')
        .withContent('originalContent1')
        .build()
    )
    .withChild(
      new SimpleNodeBuilder()
        .withName('testOverride2')
        .withContent('originalContent2')
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testOverrideSubNode')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testOverrideSubNode1')
            .withContent('originalContentSubNode1')
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
        .withContent('overriddenContent1')
        .build()
    )
    .withChild(
      new BranchNodeBuilder()
        .withName('testOverrideSubNode')
        .withChild(
          new SimpleNodeBuilder()
            .withName('testOverrideSubNode1')
            .withContent('overriddenContentSubNode1')
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
            .withContent('overriddenContent2')
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
      return subject.process(getTestInput(), getTestHierarchy())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)
            return Bluebird.props(
              {
                override1: value.getNodeByPath('_root/testOverride1'),
                override2: value.getNodeByPath('_root/testOverride2'),
                subnodes: value.getNodeByPath('_root/testOverrideSubNode')
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              (value.override1 as OutputNodeInterface).content
            ).to.equal('overriddenContent1')
            chai.expect(
              (value.override2 as OutputNodeInterface).content
            ).to.equal('originalContent2')
            chai.expect(
              value.subnodes.getChildren().length
            ).to.equal(1)
            chai.expect(
              (value.subnodes.getChildren()[0] as OutputNodeInterface).content
            ).to.equal('originalContentSubNode1')

          }
        )
    })
    it('should work on a subnode',
      function (): Bluebird<void> {
        return getTestHierarchy().getNodeByPath('_root/subNode')
          .then(
            testHierarchy => {
              return subject.process(getTestInput(), testHierarchy as SockoNodeInterface)
            }
          )
          .then(
            value => {
              chai.expect(
                value.type
              ).to.equal(SockoNodeType.Root)
              return Bluebird.props(
                {
                  override1: value.getNodeByPath('_root/testOverride1'),
                  override2: value.getNodeByPath('_root/testOverride2'),
                  subnodes: value.getNodeByPath('_root/testOverrideSubNode')
                }
              )
            }
          )
          .then(
            value => {
              chai.expect(
                (value.override1 as OutputNodeInterface).content
              ).to.equal('overriddenContent1')
              chai.expect(
                (value.override2 as OutputNodeInterface).content
              ).to.equal('overriddenContent2')
              chai.expect(
                value.subnodes.getChildren().length
              ).to.equal(1)
              chai.expect(
                (value.subnodes.getChildren()[0] as OutputNodeInterface).content
              ).to.equal('originalContentSubNode1')

            }
          )
      }
    )
  }
)
