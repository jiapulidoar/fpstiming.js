/**
 * Interface used to define a timer callback method.
 */
export default class Taskable {
  /**
   * Timer callback method
   */
  execute() {
    throw new TypeError('execute must be overrided');
  }
}
