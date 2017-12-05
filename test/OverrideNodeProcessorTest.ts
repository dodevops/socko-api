import 'mocha'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import { OverrideNodeProcessor } from '../lib/processors/OverrideNodeProcessor'
import { getTestHierarchy, getTestInput } from './TestFixtures'
import { SockoNodeType } from '../lib/nodes/SockoNodeType'
import { OutputNode } from '../lib/nodes/OutputNode'
import { SockoNodeInterface } from '../lib/nodes/SockoNodeInterface'
chai.use(chaiAsPromised)

describe(
  'OverrideNodeProcessor', function () {
    let subject = new OverrideNodeProcessor()
    it('should process a node correctly', function () {
      return subject.process(getTestInput(), getTestHierarchy())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)
            return value.getNodeByPath('_root/testfile1')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('ABC')
            return value.getNodeByPath('_root/testfile2')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('456')
          }
        )
    })
    it('should work on a subnode', function () {
      return subject.process(getTestInput(), getTestHierarchy().getChildren()[1] as SockoNodeInterface)
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)
            return value.getNodeByPath('_root/testfile1')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('DEF')
            return value.getNodeByPath('_root/testfile2')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('456')
          }
        )
    })
    it('should work on a subnode without override', function () {
      return subject.process(getTestInput(), getTestHierarchy().getChildren()[2] as SockoNodeInterface)
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)
            return value.getNodeByPath('_root/testfile1')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('ABC')
            return value.getNodeByPath('_root/testfile2')
          }
        )
        .then(
          (value: OutputNode) => {
            chai.expect(
              value.content
            ).to.equal('456')
          }
        )
    })
  }
)
