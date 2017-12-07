import 'mocha'
import { getTestHierarchy, getTestInput } from './TestFixtures'
import { SockoNodeType } from '../lib/nodes/SockoNodeType'
import { SocketNodeProcessor } from '../lib/processors/SocketNodeProcessor'
import { OutputNodeInterface } from '../lib/nodes/OutputNodeInterface'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')
import { SocketNodeInterface } from '../lib/nodes/SocketNodeInterface'

chai.use(chaiAsPromised)

describe(
  'SocketNodeProcessor', function (): void {
    let subject = new SocketNodeProcessor()
    it('should work with a simple cartridge insertion', function (): Bluebird<void> {
      return subject.process(getTestInput(), getTestHierarchy())
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)

            return value.getNodeByPath('_root/testsocket1')
          }
        )
        .then(
          (node: OutputNodeInterface) => {
            chai.expect(
              node.content
            ).to.equal('this >>>CARTRIDGE<<< is the cartridge content')
          }
        )
    })
    it('should work with a cartridge collector', function (): Bluebird<void> {
      return subject.process(getTestInput(), getTestHierarchy().getChildren()[1] as SocketNodeInterface)
        .then(
          value => {
            chai.expect(
              value.type
            ).to.equal(SockoNodeType.Root)

            return Bluebird.props(
              {
                infiniteDepth: value.getNodeByPath('_root/testsocket2'),
                maxDepth: value.getNodeByPath('_root/testsocket3')
              }
            )
          }
        )
        .then(
          value => {
            chai.expect(
              (value.infiniteDepth as OutputNodeInterface).content
            ).to.equal('1:CARTRIDGESUBCARTRIDGE')
            chai.expect(
              (value.maxDepth as OutputNodeInterface).content
            ).to.equal('1:SUBCARTRIDGE')
          }
        )
    })
  }
)
