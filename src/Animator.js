export default class Animator {
  animate() {
    throw new TypeError('animate must be overrided');
  }
  invokeAnimationHandler() {
    throw new TypeError('invokeAnimationHandler must be overrided');
  }
  get animationPeriod() {
    throw new TypeError('animationPeriod must be overrided');
  }
  setAnimationPeriod(number) {
    throw new TypeError('setAnimationPeriod must be overrided');
  }
  stopAnimation() {
    throw new TypeError('stopAnimation must be overrided');
  }
  startAnimation() {
    throw new TypeError('startAnimation must be overrided');
  }
  restartAnimation() {
    throw new TypeError('restartAnimation must be overrided');
  }
  toggleAnimation() {
    throw new TypeError('toggleAnimation must be overrided');
  }
  animationStarted() {
    throw new TypeError('animationStarted must be overrided');
  }
  set timingHandler(handler) {
    throw new TypeError('set timingHandler must be overrided');
  }
  get timingHandler() {
    throw new TypeError('get TimingHandler must be overrided');
  }
  get timer() {
    throw new TypeError('get timer must be overrided');
  }
}
