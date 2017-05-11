import Animator from './Animator';
import SeqTimer from './SeqTimer';

export default class AnimatorObject extends Animator {
  constructor(handler = null) {
    super();

    this.animationTimer = null;

    if (handler !== null) {
      this.setTimingHandler(handler);
    }
    this.setAnimationPeriod(40, false);
    this.stopAnimation();
  }

  set timingHandler(handler) {
    this.handler = handler;
    handler.registerAnimator(this);
    this.animationTimer = new SeqTimer(handler);
  }

  get timingHandler() {
    return this.handler;
  }

  get timer() {
    return this.animationTimer;
  }

  get animationStarted() {
    return this.started;
  }

  get animationPeriod() {
    return this.animationPeriod;
  }

  setAnimationPeriod(period, restart = true) {
    if (period > 0) {
      this.animationPeriod = period;
      if (this.started && restart) {
        this.restartAnimation();
      }
    }
  }

  stopAnimation() {
    this.started = false;
    if (this.animationTimer != null) {
      this.animationTimer.stop();
    }
  }

  startAnimation() {
    this.started = true;
    if (this.animationTimer != null) {
      this.animationTimer.run(this.animationPeriod);
    }
  }

  restartAnimation() {
    this.stopAnimation();
    this.startAnimation();
  }

  toggleAnimation() {
    if (this.started) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

}
