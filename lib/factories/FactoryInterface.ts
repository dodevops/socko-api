/**
 * @module socko-api
 */
/**
 * An interface for creating reference implementations of the given interfaces
 */
export interface FactoryInterface<T> {
  /**
   * Create the new implementation and set default values
   * @return {T}
   */
  create (): T
}
