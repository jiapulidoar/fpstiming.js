import SeqTimer from './SeqTimer';

export default class TimingHandler {
  constructor(aObject = null) {
    this._tPool = new Set();
    this._aPool = new Set();
    this._frameRateLastMillis = 0;
    this._frameRate = 10;
    this._fCount = 0;
    if (aObject !== null) {
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
        if (aObj.timer().triggered()) {
          if (!aObj.invokeAnimationHandler()) {
            aObj.animate();
          }
        }
      }
    });
  }

  registerTask(task, timer = null) {
    if (timer === null) {
      task.setTimer(new SeqTimer({ handler: this, task }));
    } else {
      task.setTimer(timer);
    }
    this._tPool.add(task);
  }

  unregisterTask(task) {
    this._tPool.delete(task);
  }

  isTaskRegistered(task) {
    this._tPool.has(task);
  }

  updateFrameRate() {
    const now = window.performance.now();
    if (this._fCount > 1) {
      const rate = 1000 / ((now - this._frameRateLastMillis) / 1000);
      const instantaneousRate = rate / 1000;
      this._frameRate = (this._frameRate * 0.9) + (instantaneousRate * 0.1);
    }
    this._frameRateLastMillis = now;
    this._fCount += 1;
  }

  get frameRate() {
    return this._frameRate;
  }

  get frameCount() {
    return this._fCount;
  }

  registerAnimator(object) {
    if (object.timingHandler() !== this) {
      object.setTimingHandler(this);
    }
    this._aPool.add(object);
  }

  unregisterAnimator(object) {
    this._aPool.delete(object);
  }

  isObjectAnimator(object) {
    this.__aPool.has(object);
  }

}
