/**
 * An interface describing a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) for creating nodes
 */
import Bluebird = require('bluebird')

export interface BuilderInterface<T> {

  /**
   * Set the name of the node
   * @param {string} name name
   * @return {BuilderInterface<T>}
   */
  withName (name: string): BuilderInterface<T>

  /**
   * Set the content reader of the node
   * @param {() => Bluebird<any>} content reader function
   * @return {BuilderInterface<T>}
   */
  withReadContent (reader: () => Bluebird<any>): BuilderInterface<T>

  /**
   * Set the content writer of the node
   * @param {(content: any) => Bluebird<void>} writer writer function
   * @return {BuilderInterface<T>}
   */
  withWriteContent (writer: (content: any) => Bluebird<void>): BuilderInterface<T>

  /**
   * Add a child to the node
   * @param {T} node
   * @return {BuilderInterface<T>}
   */
  withChild (node: T): BuilderInterface<T>

  /**
   * Assemble the node and return it
   * @return {T}
   */
  build (): T
}
