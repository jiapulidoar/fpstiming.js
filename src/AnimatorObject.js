import Animator from './Animator';
import SeqTimer from './SeqTimer';

/**
 * Class implementing the main {@link Animator} behavior.
 */
export default class AnimatorObject extends Animator {
  /**
   * Constructs an animated object with a default {@link AnimatorObject#animationPeriod} of 40 milliseconds (25Hz), if no handler is supplied, the handler should explicitly be defined afterwards {@link AnimatorObject#setTimingHandler}.
   * @param {TimingHandler} [handler = null] optional {@link TimingHandler}
   */
  constructor(handler = null) {
    super();

    this._animationPeriod = 40;
    this._started = false;

    this._animationTimer = null;
    this._handler = null;

    if (handler !== null) {
      this.setTimingHandler(handler);
    }
  }

  setTimingHandler(handler) {
    this._animationTimer = new SeqTimer({ handler });
    this._handler = handler;
    handler.registerAnimator(this);
  }

  /**
   * @returns {TimingHandler} the timing handler.
   */
  timingHandler() {
    return this._handler;
  }

  /**
   * @returns {SeqTimer} the sequential timer.
   */
  timer() {
    return this._animationTimer;
  }

  /**
   * @returns {boolean} `true` if animation was started or `false` otherwise.
   */
  animationStarted() {
    return this._started;
  }

  /**
   * @returns {number} the animation period in milliseconds.
   */
  animationPeriod() {
    return this._animationPeriod;
  }

  setAnimationPeriod(period, restart = true) {
    if (period > 0) {
      this._animationPeriod = period;
      if (this._started && restart) {
        this.restartAnimation();
      }
    }
  }

  stopAnimation() {
    this._started = false;
    if (this._animationTimer != null) {
      this._animationTimer.stop();
    }
  }

  startAnimation() {
    this._started = true;
    if (this._animationTimer != null) {
      this._animationTimer.run(this._animationPeriod);
    }
  }

  restartAnimation() {
    this.stopAnimation();
    this.startAnimation();
  }

  toggleAnimation() {
    if (this._started) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  invokeAnimationHandler() {
    return false;
  }
}
