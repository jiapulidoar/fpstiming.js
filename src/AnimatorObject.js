import Animator from './Animator';
import SeqTimer from './SeqTimer';

export default class AnimatorObject/* extends Animator*/ {
  constructor(handler = null) {
    //super();

    this._animationPeriod = 40;
    this._started = false;

    this._animationTimer = null;
    this._handler = null;

    if (handler !== null) {
      this.setTimingHandler(handler);
    }
  }

  set timingHandler(handler) {
    handler.registerAnimator(this);
    this._animationTimer = new SeqTimer(handler);
    this._handler = handler;
  }

  get timingHandler() {
    return this._handler;
  }

  get timer() {
    return this._animationTimer;
  }

  get animationStarted() {
    return this._started;
  }

  get animationPeriod() {
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
    if (this.animationTimer != null) {
      this.animationTimer.stop();
    }
  }

  startAnimation() {
    this._started = true;
    if (this.animationTimer != null) {
      this.animationTimer.run(this.animationPeriod);
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

}
