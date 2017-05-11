class Animator {
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
    if (typeof this.timingHandler === 'function') {
      throw new TypeError('setTimingHandler must be overrided');
    }
    // TODO: check for timingHandler : TimingHandler
    // TODO: check for timer : SeqTimer
  }
}

class SeqTimer {

  constructor({ handler, runOnlyOnce = false, task = null }) {
    this._task = task;
    this._handler = handler;
    this._active = false;
    this._runOnlyOnce = runOnlyOnce;
    this._counter = 0;
    this._period = 0;
    this._startTime = window.performance.now();
    this.create();
  }

  get timingTask() {
    return this._task;
  }

  execute() {
    const result = this.triggered();
    if (result) {
      this._task.execute();
      if (this._runOnlyOnce) {
        this.inactivate();
      }
    }
    return result;
  }

  cancel() {
    this.inactivate();
  }

  create() {
    this.inactivate();
  }

  run(period = null) {
    if (period !== null) {
      this._period = period;
    }
    if (period <= 0) {
      return;
    }
    this._counter = 1;
    this._active = true;
    this._startTime = window.performance.now();
  }

  stop() {
    this.inactivate();
  }

  isActive() {
    return this._active;
  }

  inactivate() {
    this._active = false;
  }

  triggered() {
    if (!this._active) {
      return false;
    }

    let result = false;

    const elapsedTime = window.performance.now() - this._startTime;
    const timePerFrame = (1 / this._handler.frameRate) * 1000;
    const threshold = this._counter * this._period;

    if (threshold >= elapsedTime) {
      const diff = (elapsedTime + timePerFrame) - threshold;
      if (diff >= 0) {
        if (threshold - elapsedTime < diff) {
          result = true;
        }
      }
    } else {
      result = true;
    }
    if (result) {
      this._counter += 1;
    }
    return result;
  }

  get period() {
    return this._period;
  }

  set period(period) {
    this._period = period;
  }

  isSingleShot() {
    return this._runOnlyOnce;
  }

  setSingleShot(singleShot) {
    this._runOnlyOnce = singleShot;
  }

}

class AnimatorObject /* extends Animator*/ {
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
    this._animationTimer = new SeqTimer({ handler });
    this._handler = handler;
    handler.registerAnimator(this);
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

class Taskable {
  constructor() {
    if (typeof this.execute === 'function') {
      throw new TypeError('execute must be overrided');
    }
  }
}

class Timer {
  constructor() {
    if (typeof this.run === 'function') {
      throw new TypeError('run must be overrided');
    }
    // TODO: check for timingTask : Taskable
    if (typeof this.stop === 'function') {
      throw new TypeError('stop must be overrided');
    }
    if (typeof this.cancel === 'function') {
      throw new TypeError('cancel must be overrided');
    }
    if (typeof this.create === 'function') {
      throw new TypeError('create must be overrided');
    }
    if (typeof this.isActive === 'function') {
      throw new TypeError('isActive must be overrided');
    }
    if (typeof this.period === 'number') {
      throw new TypeError('period must be overrided');
    }
    if (typeof this.setPeriod === 'function') {
      throw new TypeError('setPeriod must be overrided');
    }
    if (typeof this.isSingleShot === 'function') {
      throw new TypeError('isSingleShot must be overrided');
    }
    if (typeof this.setSingleShot === 'function') {
      throw new TypeError('setSingleShot must be overrided');
    }
  }
}

class TimingHandler {
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
    console.log(this._aPool);
    Array.from(this._aPool).forEach((aObj) => {
      if (aObj.animationStarted) {
        if (aObj.timer.triggered()) {
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
    if(this._fCount > 1) {
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

  registerAnimator(object, timer = null) {
    if (object.timingHandler !== this) {
      object.timingHandler = this;
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

class TimingTask {
  constructor() {
    this._timer = null;
  }

  setTimer(timer) {
    this._timer = timer;
  }

  run(period) {
    if (this._timer != null) {
      this._timer().setSingleShot(false);
      this._timer().run(period);
    }
  }

  runOnce(period) {
    if (this._timer != null) {
      this._timer().setSingleShot(true);
      this._timer().run(period);
    }
  }

  stop() {
    if (this._timer != null) {
      this._timer().stop();
    }
  }

  cancel() {
    if (this._timer != null) {
      this._timer().cancel();
    }
  }

  create() {
    if (this._timer != null) {
      this._timer().create();
    }
  }

  isActive() {
    if (this._timer != null) {
      this._timer().isActive();
    }
    return false;
  }
}

const fpstiming = {
  Animator,
  AnimatorObject,
  SeqTimer,
  Taskable,
  Timer,
  TimingHandler,
  TimingTask,
};

export default fpstiming;