/**
 * Interface defining the behavior animated objects should implement.
 */
class Animator {
  /**
   * Main callback method.
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
   * Returns the animation period in milliseconds.
   * @returns {number}
   */
  animationPeriod() {
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
   * Return `true` if animation was started or `false` otherwise.
   * @returns {boolean}
   */
  animationStarted() {
    throw new TypeError('animationStarted must be overrided');
  }
  /**
   * Sets the timing handler.
   * param {TimingHandler} handler
   */
  setTimingHandler(handler) {
    throw new TypeError('setTimingHandler must be overrided');
  }
  /**
   * Returns the timing handler.
   * @returns {TimingHandler}
   */
  timingHandler() {
    throw new TypeError('TimingHandler must be overrided');
  }
  /**
   * Returns the sequential timer.
   * @returns {SeqTimer}
   */
  timer() {
    throw new TypeError('timer must be overrided');
  }
}

/**
 * Interface defining timers.
 */
class Timer {
  /**
   * Sets the optional period and runs the timer according to {@link Timer#period}. The timer may be scheduled for repeated fixed-rate execution according to {@link Timer#isSingleShot}.
   *
   * @param {number} [period=null] time in milliseconds between successive task executions
   */
  run(period){
    throw new TypeError('run must be overrided');
  }
  /**
   * Returns the object defining the timer callback method. May be null.
   * @returns {TimingTask|null}
   */
  get timingTask(){
    throw new TypeError('get timingTask must be overrided');
  }
  /**
   * Stops the timer.
   */
  stop(){
    throw new TypeError('stop must be overrided');
  }
  /**
   * Stops the timer.
   */
  cancel(){
    throw new TypeError('cancel must be overrided');
  }
  /**
   * Creates the timer.
   */
  create(){
    throw new TypeError('create must be overrided');
  }
  /**
   * Tells whether or not the timer is active.
   * @returns {boolean}
   */
  isActive(){
    throw new TypeError('isActive must be overrided');
  }
  /**
   * Returns the timer period in milliseconds.
   * @returns {number}
   */
  period(){
    throw new TypeError('get period must be overrided');
  }
  /**
   * Defines the timer period in milliseconds.
   * @param {number} period in milliseconds
   */
  setPeriod(period){
    throw new TypeError('set period must be overrided');
  }
  /**
   * Returns whether or not the timer is scheduled to be executed only once.
   * @returns {boolean}
   */
  isSingleShot(){
    throw new TypeError('isSingleShot must be overrided');
  }
  /**
   * Defines the timer as a single shot or for repeated execution.
   * @param {boolean} singleShot
   */
  setSingleShot(singleShot){
    throw new TypeError('setSingleShot must be overrided');
  }
}

class SeqTimer extends Timer {
  constructor({ handler, runOnlyOnce = false, task = null }) {
    super();
    this._task = task;
    this._handler = handler;
    this._active = false;
    this._runOnlyOnce = runOnlyOnce;
    this._counter = 0;
    this._period = 0;
    this._startTime = window.performance.now();
    this.create();
  }

  timingTask() {
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

  period() {
    return this._period;
  }

  setPeriod(period) {
    this._period = period;
  }

  isSingleShot() {
    return this._runOnlyOnce;
  }

  setSingleShot(singleShot) {
    this._runOnlyOnce = singleShot;
  }
}

/**
 * Class implementing the main {@link Animator} behavior.
 */
class AnimatorObject extends Animator {
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

  timingHandler() {
    return this._handler;
  }

  timer() {
    return this._animationTimer;
  }

  animationStarted() {
    return this._started;
  }

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

class Taskable {
  execute(){
    throw new TypeError('execute must be overrided');
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

class TimingTask extends Taskable {
  constructor() {
    super();
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
