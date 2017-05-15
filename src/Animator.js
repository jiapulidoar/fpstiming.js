/**
 * Interface defining the behavior animated objects should implement.
 */
export default class Animator {
  /**
   * Main callback method
   */
  animate() {
    throw new TypeError('animate must be overrided');
  }
  /**
   * Whether or not the animated method is defined externally, as when register it through reflection.
   * @returns {boolean}
   */
  invokeAnimationHandler() {
    throw new TypeError('invokeAnimationHandler must be overrided');
  }
  /**
   * @returns {number} the animation period in milliseconds.
   */
  get animationPeriod() {
    throw new TypeError('animationPeriod must be overrided');
  }
  /**
   * Sets the animation `period` in milliseconds and (optional) `restart` the animation.
   * @param {number} period
   * @param {boolean} [restart = false]
   */
  setAnimationPeriod(period, restart = true) {
    throw new TypeError('setAnimationPeriod must be overrided');
  }
  /**
   * Stops the animation
   */
  stopAnimation() {
    throw new TypeError('stopAnimation must be overrided');
  }
  /**
   * Starts the animation executing periodically the animated call back method.
   */
  startAnimation() {
    throw new TypeError('startAnimation must be overrided');
  }
  /**
   * Simply calls {@link Animator#stopAnimation} and then {@link Animator#startAnimation}.
   */
  restartAnimation() {
    throw new TypeError('restartAnimation must be overrided');
  }
  /**
   * Starts or stops the animation according to {@link Animator#animationStarted}.
   */
  toggleAnimation() {
    throw new TypeError('toggleAnimation must be overrided');
  }
  /**
   * @returns {boolean} `true` if animation was started or `false` otherwise.
   */
  animationStarted() {
    throw new TypeError('animationStarted must be overrided');
  }
  /**
   * Sets the timing handler.
   * param {TimingHandler} handler
   */
  set timingHandler(handler) {
    throw new TypeError('set timingHandler must be overrided');
  }
  /**
   * @returns {TimingHandler} the timing handler.
   */
  get timingHandler() {
    throw new TypeError('get TimingHandler must be overrided');
  }
  /**
   * @returns {SeqTimer} the sequential timer.
   */
  get timer() {
    throw new TypeError('get timer must be overrided');
  }
}
