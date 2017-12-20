import { ProcessorOptionsInterface } from './ProcessorOptionsInterface'
import { ProcessorOptions } from './ProcessorOptions'
import Bluebird = require('bluebird')

/**
 * A factory for [[ProcessorOptionsInterface]]
 */
export class ProcessorOptionsFactory {
  public create (): ProcessorOptionsInterface {
    let processorOptions = new ProcessorOptions()
    processorOptions.processCartridgeNode = node => {
      return Bluebird.resolve(node)
    }
    processorOptions.processResultTreeNode = node => {
      return Bluebird.resolve(node)
    }
    return processorOptions
  }
}
