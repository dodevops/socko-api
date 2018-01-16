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
    .withChild(
      new BranchNodeBuilder()
        .withName('subNode')
        .withChild(
          new BucketNodeBuilder()
            .withName('subNodeBucket')
            .withPattern('bucketItem*')
            .build()
        )
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent1') })
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent2') })
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('notEligibleItem')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('nothing') })
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent1') })
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent2') })
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent1') })
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent2') })
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
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent1') })
            .build()
        )
        .withChild(
          new SimpleNodeBuilder()
            .withName('bucketItem2')
            .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketContent2') })
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
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent1') })
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent3') })
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
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent1') })
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent3') })
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
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent1') })
                .build()
            )
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem3')
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubContent3') })
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
                    .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubSubContent1') })
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
                    .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubSubContent1') })
                    .build()
                )
                .withChild(
                  new SimpleNodeBuilder()
                    .withName('bucketItem4')
                    .withReadContent((): Bluebird<any> => { return Bluebird.resolve('bucketSubSubContent4') })
                    .build()
                )
                .build()
            )
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('subNodeBucket')
            .withChild(
              new SimpleNodeBuilder()
                .withName('bucketItem1')
                .withReadContent((): Bluebird<any> => { return Bluebird.resolve('subNodeBucketContent1') })
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
      return getTestHierarchy().getNodeByPath('/_root/subNode/subSubNode')
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
                infiniteDepthBucket: value.getNodeByPath('/_root/infiniteDepthBucket'),
                maxDepth0Bucket: value.getNodeByPath('/_root/maxDepth0Bucket'),
                maxDepth1Bucket: value.getNodeByPath('/_root/maxDepth1Bucket'),
                regexpPatternBucket: value.getNodeByPath('/_root/regexpPatternBucket'),
                subNodeBucket: value.getNodeByPath('/_root/subNode/subNodeBucket')
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

            // test maxDepth0

            chai.expect(
              value.maxDepth0Bucket.getChildren().length
            ).to.equal(1)
            chai.expect(
              value.maxDepth0Bucket.getChildByName('bucketItem1')
            ).to.not.equal(null)

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

            // test subnode

            chai.expect(
              value.subNodeBucket.getChildren().length
            ).to.equal(1)
            chai.expect(
              value.subNodeBucket.getChildByName('bucketItem1')
            ).to.not.equal(null)

            // test contents

            return Bluebird.props(
              {
                infiniteDepthBucketBucketItem1:
                  (value.infiniteDepthBucket.getChildByName('bucketItem1') as OutputNodeInterface).readContent(),
                infiniteDepthBucketBucketItem2:
                  (value.infiniteDepthBucket.getChildByName('bucketItem2') as OutputNodeInterface).readContent(),
                infiniteDepthBucketBucketItem3:
                  (value.infiniteDepthBucket.getChildByName('bucketItem3') as OutputNodeInterface).readContent(),
                maxDepth0BucketBucketItem1:
                  (value.maxDepth0Bucket.getChildByName('bucketItem1') as OutputNodeInterface).readContent(),
                maxDepth1BucketBucketItem1:
                  (value.maxDepth1Bucket.getChildByName('bucketItem1') as OutputNodeInterface).readContent(),
                maxDepth1BucketBucketItem3:
                  (value.maxDepth1Bucket.getChildByName('bucketItem3') as OutputNodeInterface).readContent(),
                maxDepth1BucketBucketItem4:
                  (value.maxDepth1Bucket.getChildByName('bucketItem4') as OutputNodeInterface).readContent(),
                subNodeBucketBucketItem1:
                  (value.subNodeBucket.getChildByName('bucketItem1') as OutputNodeInterface).readContent()
              }
            )
              .then(
                contents => {
                  chai.expect(
                    contents.infiniteDepthBucketBucketItem1
                  ).to.equal('bucketSubContent1')
                  chai.expect(
                    contents.infiniteDepthBucketBucketItem2
                  ).to.equal('bucketContent2')
                  chai.expect(
                    contents.infiniteDepthBucketBucketItem3
                  ).to.equal('bucketSubContent3')

                  chai.expect(
                    contents.maxDepth0BucketBucketItem1
                  ).to.equal('bucketSubSubContent1')

                  chai.expect(
                    contents.maxDepth1BucketBucketItem1
                  ).to.equal('bucketSubSubContent1')
                  chai.expect(
                    contents.maxDepth1BucketBucketItem3
                  ).to.equal('bucketSubContent3')
                  chai.expect(
                    contents.maxDepth1BucketBucketItem4
                  ).to.equal('bucketSubSubContent4')

                  chai.expect(
                    contents.subNodeBucketBucketItem1
                  ).to.equal('subNodeBucketContent1')
                }
              )
          }
        )
    })
    it('should fail when called directly from a hierachy node', function (): Bluebird<void> {
      return getTestHierarchy().getNodeByPath('/_root/infiniteDepthBucket')
        .then(
          testHierarchy => {
            return chai.expect(
              subject.process(
                getTestInput(),
                testHierarchy as SockoNodeInterface,
                new ProcessorOptionsFactory().create()
              )
            ).to.be.rejectedWith('Process was called from a bucket node: infiniteDepthBucket')
          }
        )
    })
  }
)
