export default class Animator {
  constructor() {
    if (typeof this.animate === 'function') {
      throw new TypeError('animate must be overrided');
    }
    if (typeof this.invokeAnimationHandler === 'function') {
      throw new TypeError('invokeAnimationHandler must be overrided');
    }
    if (typeof this.setAnimationPeriod === 'function') {
      throw new TypeError('setAnimationPeriod must be overrided');
    }
    if (typeof this.setAnimationPeriod === 'function') {
      throw new TypeError('setAnimationPeriod must be overrided');
    }
    if (typeof this.stopAnimation === 'function') {
      throw new TypeError('stopAnimation must be overrided');
    }
    if (typeof this.startAnimation === 'function') {
      throw new TypeError('startAnimation must be overrided');
    }
    if (typeof this.restartAnimation === 'function') {
      throw new TypeError('restartAnimation must be overrided');
    }
    if (typeof this.toggleAnimation === 'function') {
      throw new TypeError('toggleAnimation must be overrided');
    }
    if (typeof this.animationStarted === 'function') {
      throw new TypeError('animationStarted must be overrided');
    }
    if (typeof this.setTimingHandler === 'function') {
      throw new TypeError('setTimingHandler must be overrided');
    }
    // TODO: check for timingHandler : TimingHandler
    // TODO: check for timer : SeqTimer
  }
}
