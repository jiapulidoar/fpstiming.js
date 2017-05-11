import SeqTimer from './SeqTimer';

export default class TimingHandler {
  constructor(aObject = null) {
    this._tPool = new WeakSet();
    this._aPool = new WeakSet();
    this._frameRateLastMillis = 0;
    this._frameRate = 10;
    this._fCount = 0;
    if (aObject === null) {
      this.registerAnimator(aObject);
    }
  }

  handle() {
    this.updateFrameRate();
    Array.from(this._tPool).forEach((task) => {
      if (task.timer !== null) {
        if (task.timer instanceof SeqTimer) {
          if (task.timer.timingTask !== null) {
            task.timer.execute();
          }
        }
      }
    });
    Array.from(this._aPool).forEach((aObj) => {
      if (aObj.animationStarted()) {
        if (aObj.timer.triggered()) {
          if (aObj.invokeAnimationHandler()) {
            aObj.animate();
          }
        }
      }
    });
  }

  registerTask(task, timer = null) {
    if (timer === null) {
      task.setTimer(new SeqTimer(this, task));
    } else {
      task.setTimer(timer);
    }
    this._tPool.add(task);
  }

}
