/**
 * @interface defining the behavior animated objects should implement.
 */
export default class Animator {
  /**
   * Main callback method.
   */
  animate() {
    throw new TypeError('animate must be overrided');
  }
  /**
   * Returns the animation period in milliseconds.
   * @returns {number}
   */
  period() {
    throw new TypeError('period must be overrided');
  }
  /**
   * Sets the animation `period` in milliseconds and (optional) `restart` the animation.
   * @param {number} period
   * @param {boolean} [restart = false]
   */
  setPeriod(period, restart = true) {
    throw new TypeError('setPeriod must be overrided');
  }
  /**
   * Stops the animation
   */
  stop() {
    throw new TypeError('stop must be overrided');
  }
  /**
   * Starts the animation executing periodically the animated call back method.
   */
  start() {
    throw new TypeError('start must be overrided');
  }
  /**
   * Simply calls {@link Animator#stop} and then {@link Animator#start}.
   */
  restart() {
    throw new TypeError('restart must be overrided');
  }
  /**
   * Starts or stops the animation according to {@link Animator#started}.
   */
  toggle() {
    throw new TypeError('toggle must be overrided');
  }
  /**
   * Return `true` if animation was started or `false` otherwise.
   * @returns {boolean}
   */
  started() {
    throw new TypeError('started must be overrided');
  }
  /**
   * Returns the sequential timer.
   * @returns {SeqTimer}
   */
  timer() {
    throw new TypeError('timer must be overrided');
  }
}
