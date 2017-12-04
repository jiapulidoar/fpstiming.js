import Animator from './Animator';
import SequentialTimer from './SequentialTimer';

/**
 * Class implementing the main {@link Animator} behavior.
 */
export default class AnimatorObject extends Animator {
  /**
  * Constructs an animated object with a default {@link AnimatorObject#animationPeriod}
  * of 40 milliseconds (25Hz)
  * @param {TimingHandler} handler
  */
  constructor(handler) {
    super();

    this._animationPeriod = 40;
    this._started = false;

    this._animationTimer = null;
    this._handler = handler;
  }

  /**
   * @returns {SequentialTimer}
   */
  timer() {
    return this._animationTimer;
  }

  /**
   * Return true when the animation loop is started.
   * The timing handler will check when {@link AnimatorObject#started} and then called the
   * animation callback method every {@link AnimatorObject#period} milliseconds.
   * Use {@link AnimatorObject#start} and {@link AnimatorObject#stop}.
   * @see AnimatorObject#start
   * @see AnimatorObject#animate
   * @returns {boolean}
   */
  started() {
    return this._started;
  }

  /**
   * The animation loop period, in milliseconds. When {@link AnimatorObject#started}, this is
   * the delay that takes place between two consecutive iterations of the animation loop.
   * This delay defines a target frame rate that will only be achieved if your
   * {@link AnimatorObject#animate} methods is fast enough.
   * Default value is 40 milliseconds (25 Hz).
   * Note: This value is taken into account only the next time you call
   * {@link AnimatorObject#start}. If {@link AnimatorObject#started}, you should
   * {@link AnimatorObject#stop} first. See {@link AnimatorObject#restart} and
   * {@link AnimatorObject#setPeriod}.
   * @see AnimatorObject#setPeriod
   * @returns {number}
   */
  period() {
    return this._animationPeriod;
  }

  /**
   * Sets the {@link AnimatorObject#period}, in milliseconds. If restart is true and
   * {@link AnimatorObject#started} then {@link AnimatorObject#restart} is called.
   * @see AnimatorObject#start
   * @param {number} period
   * @param {boolean} [restart = true]
   */
  setPeriod(period, restart = true) {
    if (period > 0) {
      this._animationPeriod = period;
      if (this._started && restart) {
        this.restart();
      }
    }
  }

  /**
   * Stops animation.
   * @see AnimatorObject#start
   */
  stop() {
    this._started = false;
    if (this._animationTimer != null) {
      this._animationTimer.stop();
    }
  }

  /**
   * Starts the animation loop.
   * @see AnimatorObject#started
   */
  start() {
    this._started = true;
    if (this._animationTimer != null) {
      this._animationTimer.run(this._animationPeriod);
    }
  }

  toggle() {
    if (this._started) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Simply calls {@link AnimatorObject#stop} and then {@link AnimatorObject#start}.
   */
  restart() {
    this.stop();
    this.start();
  }
}
