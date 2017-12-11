/**
 * @module socko-api
 */
/**
 * An interface describing a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) for creating nodes
 */
export interface BuilderInterface<T> {

  /**
   * Set the name of the node
   * @param {string} name name
   * @return {BuilderInterface<T>}
   */
  withName (name: string): BuilderInterface<T>

  /**
   * Set the content of the node
   * @param {string} content content
   * @return {BuilderInterface<T>}
   */
  withContent (content: string): BuilderInterface<T>

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
