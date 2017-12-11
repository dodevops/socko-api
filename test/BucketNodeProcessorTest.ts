/**
 * @module socko-api-tests
 */
/**
 * Test the [[BucketNodeProcessor]]
 */

import 'mocha'
import { BucketNodeProcessor } from '../lib/processors/BucketNodeProcessor'
import { SockoNodeType } from '../lib/nodes/SockoNodeType'
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
import { RootNodeBuilder } from '../lib/builders/RootNodeBuilder'
import { BucketNodeBuilder } from '../lib/builders/BucketNodeBuilder'
import { SimpleNodeBuilder } from '../lib/builders/SimpleNodeBuilder'
import { BranchNodeBuilder } from '../lib/builders/BranchNodeBuilder'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')

chai.use(chaiAsPromised)

function getTestInput (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      new BucketNodeBuilder()
        .withName('infiniteDepthBucket')
        .withPattern('bucketItem*')
        .build()
    )
    .withChild(
      new BucketNodeBuilder()
        .withName('maxDepth0Bucket')
        .withMaxDepth(0)
        .withPattern('bucketItem*')
        .build()
    )
    .withChild(
      new BucketNodeBuilder()
        .withName('maxDepth1Bucket')
        .withMaxDepth(1)
        .withPattern('bucketItem*')
        .build()
    )
    .withChild(
      new BucketNodeBuilder()
        .withName('regexpPatternBucket')
        .withPattern(/bucketItem.*/)
        .build()
    )
    .build()
}

function getTestHierarchy (): SockoNodeInterface {
  return new RootNodeBuilder()
    .withChild(
      // infiniteDepthBucket @ root
      new BranchNodeBuilder()
        .withName('infiniteDepthBucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem1')
            .withContent('bucketContent1')
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withContent('bucketContent2')
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('notEligibleItem')
            .withContent('nothing')
            .build()
        )
        .build()
    )
    .withChild(
      // maxDepth0Bucket @ root
      new BranchNodeBuilder()
        .withName('maxDepth0Bucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem1')
            .withContent('bucketContent1')
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withContent('bucketContent2')
            .build()
        )
        .build()
    )
    .withChild(
      // maxDepth1Bucket @ root
      new BranchNodeBuilder()
        .withName('maxDepth1Bucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem1')
            .withContent('bucketContent1')
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withContent('bucketContent2')
            .build()
        )
        .build()
    )
    .withChild(
      // regexpPatternBucket @ root
      new BranchNodeBuilder()
        .withName('regexpPatternBucket')
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem1')
            .withContent('bucketContent1')
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withContent('bucketContent2')
            .build()
        )
        .build()
    )
    .withChild(
      // subnode
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          // infiniteDepthBucket @ subNode
          new BranchNodeBuilder()
            .withName('infiniteDepthBucket')
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem1')
                .withContent('bucketSubContent1')
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withContent('bucketSubContent3')
                .build()
            )
            .build()
        )
        .withChild(
          // maxDepth0Bucket @ subNode
          new BranchNodeBuilder()
            .withName('maxDepth0Bucket')
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem1')
                .withContent('bucketSubContent1')
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withContent('bucketSubContent3')
                .build()
            )
            .build()
        )
        .withChild(
          // maxDepth1Bucket @ subNode
          new BranchNodeBuilder()
            .withName('maxDepth1Bucket')
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem1')
                .withContent('bucketSubContent1')
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withContent('bucketSubContent3')
                .build()
            )
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('subSubNode')
            .withChild(
              // maxDepth0Bucket @ subNode
              new BranchNodeBuilder()
                .withName('maxDepth0Bucket')
                .withChild(
                  new SimpleNodeBuilder()
                    .withName('bucketItem1')
                    .withContent('bucketSubSubContent1')
                    .build()
                )
                .build()
            )
            .withChild(
              // maxDepth1Bucket @ subSubNode
              new BranchNodeBuilder()
                .withName('maxDepth1Bucket')
                .withChild(
                  new SimpleNodeBuilder()
                    .withName('bucketItem1')
                    .withContent('bucketSubSubContent1')
                    .build()
                )
                .withChild(
                  new SimpleNodeBuilder()
                    .withName('bucketItem4')
                    .withContent('bucketSubSubContent4')
                    .build()
                )
                .build()
            )
            .build()
        )
        .build()
    )
    .build()

}

describe(
  'BucketNodeProcessor', function (): void {
    let subject = new BucketNodeProcessor()
    it('should collect bucket entries into a bucket', function (): Bluebird<void> {
      return getTestHierarchy().getNodeByPath('_root/subNode/subSubNode')
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
                infiniteDepthBucket: value.getNodeByPath('_root/infiniteDepthBucket'),
                maxDepth0Bucket: value.getNodeByPath('_root/maxDepth0Bucket'),
                maxDepth1Bucket: value.getNodeByPath('_root/maxDepth1Bucket'),
                regexpPatternBucket: value.getNodeByPath('_root/regexpPatternBucket')
              }
            )
          }
        )
        .then(
          value => {
            // test infinite depth

            chai.expect(
              value.infiniteDepthBucket.getChildren().length
            ).to.equal(3)
            chai.expect(
              value.infiniteDepthBucket.getChildByName('bucketItem1')
            ).to.not.equal(null)
            chai.expect(
              value.infiniteDepthBucket.getChildByName('bucketItem2')
            ).to.not.equal(null)
            chai.expect(
              value.infiniteDepthBucket.getChildByName('bucketItem3')
            ).to.not.equal(null)

            chai.expect(
              (value.infiniteDepthBucket.getChildByName('bucketItem1') as OutputNodeInterface).content
            ).to.equal('bucketSubContent1')
            chai.expect(
              (value.infiniteDepthBucket.getChildByName('bucketItem2') as OutputNodeInterface).content
            ).to.equal('bucketContent2')
            chai.expect(
              (value.infiniteDepthBucket.getChildByName('bucketItem3') as OutputNodeInterface).content
            ).to.equal('bucketSubContent3')

            // test maxDepth0

            chai.expect(
              value.maxDepth0Bucket.getChildren().length
            ).to.equal(1)
            chai.expect(
              value.maxDepth0Bucket.getChildByName('bucketItem1')
            ).to.not.equal(null)
            chai.expect(
              (value.maxDepth0Bucket.getChildByName('bucketItem1') as OutputNodeInterface).content
            ).to.equal('bucketSubSubContent1')

            // test maxDepth1

            chai.expect(
              value.maxDepth1Bucket.getChildByName('bucketItem1')
            ).to.not.equal(null)
            chai.expect(
              value.maxDepth1Bucket.getChildByName('bucketItem3')
            ).to.not.equal(null)
            chai.expect(
              value.maxDepth1Bucket.getChildByName('bucketItem4')
            ).to.not.equal(null)

            chai.expect(
              (value.maxDepth1Bucket.getChildByName('bucketItem1') as OutputNodeInterface).content
            ).to.equal('bucketSubSubContent1')
            chai.expect(
              (value.maxDepth1Bucket.getChildByName('bucketItem3') as OutputNodeInterface).content
            ).to.equal('bucketSubContent3')
            chai.expect(
              (value.maxDepth1Bucket.getChildByName('bucketItem4') as OutputNodeInterface).content
            ).to.equal('bucketSubSubContent4')

            // test regexp patterns

            chai.expect(
              value.regexpPatternBucket.getChildren().length
            ).to.equal(2)
            chai.expect(
              value.regexpPatternBucket.getChildByName('bucketItem1')
            ).to.not.equal(null)
            chai.expect(
              value.regexpPatternBucket.getChildByName('bucketItem2')
            ).to.not.equal(null)
          }
        )
    })
    it('should fail when called directly from a hierachy node', function (): Bluebird<void> {
      return getTestHierarchy().getNodeByPath('_root/infiniteDepthBucket')
        .then(
          testHierarchy => {
            return chai.expect(
              subject.process(getTestInput(), testHierarchy as SockoNodeInterface)
            ).to.be.rejectedWith('Process was called from a bucket node: infiniteDepthBucket')
          }
        )
    })
  }
)
