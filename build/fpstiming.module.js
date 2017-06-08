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

/**
 * Sequential timers are single-threaded timers handled by a TimingHandler.
 */
class SeqTimer extends Timer {
    /**
   * Defines a sequential (single-threaded) timer.
   *
   * @param {Object} options defines the handler, singleShot and task options
   * @param {TimingHandler} options.handler timing handler owner
   * @param {boolean} options.runOnlyOnce Defines a single shot sequential (single-threaded) timer
   * @param {TimingTask} options.task if not null, register a callback task
   */
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
  /**
   * Executes the callback method defined by the {@link SeqTimer#timingTask}.
   * *Note:* You should not call this method since it's done by the timing handler (see {@link TimingHandler#handle}).
   */
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

  /**
   * Deactivates the SeqTimer.
   */
  inactivate() {
    this._active = false;
  }

  /**
   * Returns `true` if the timer was triggered at the given frame.
   * *Note:* You should not call this method since it's done by the timing handler
   * (see {@link TimingHandler#handle}).
   * @returns {boolean}
   */
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

/**
 * Interface used to define a timer callback method.
 */
class Taskable {
  /**
   * Timer callback method
   */
  execute() {
    throw new TypeError('execute must be overrided');
  }
}

/**
 * A timing handler holds a {@link TimingHandler#timerPool} and an {@link TimingHandler#animatorPool}. The timer
 * pool are all the tasks scheduled to be performed in the future (one single time or
 * periodically). The animation pool are all the objects that implement an animation
 * callback function. For an introduction to FPSTiming please refer to {@link fpstiming}
 */
class TimingHandler {
  /**
   * Constructor that optionally takes and registers an animation object.
   * @param {AnimationObject|null} [aObject=null] animation object.
   */
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

  /**
   * Handler's main method. It should be called from within your main event loop. It does
   * the following: 1. Recomputes the frame rate; 2. Executes the all timers (those in the
   * {@link TimingHandler#timerPool}) callback functions; and, 3. Performs all the animated objects
   * (those in the {@link TimingHandler#animatorPool}) animation functions.
   */
  handle() {
    this.updateFrameRate();
    Array.from(this._tPool).forEach((task) => {
      if (task.timer() !== null) {
        if (task.timer() instanceof SeqTimer) {
          if (task.timer().timingTask() !== null) {
            task.timer().execute();
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
  /**
   * Returns the timer pool.
   * @returns {Set<TimingTask>} timingTasks callbacks
   */
  timerPool() {
    return this._tPool;
  }

  /**
   * Register a task in the timer pool and creates a sequential timer for it with an optional timer.
   * @param {TimingTask} task
   * @param {Timer} [timer = null]
   */
  registerTask(task, timer = null) {
    if (timer === null) {
      task.setTimer(new SeqTimer({ handler: this, task }));
    } else {
      task.setTimer(timer);
    }
    this._tPool.add(task);
  }

  /**
   * Unregisters the timer. You may also unregister the task this timer is attached to.
   * @param {TimingTask|SeqTimer} task
   */
  unregisterTask(task) {
    if(task instanceof SeqTimer){
      this._tPool.delete(task.timingTask());
    } else {
      this._tPool.delete(task);
    }

  }

  /**
   * Returns `true` if the task is registered and `false` otherwise.
   * @returns {boolean}
   */
  isTaskRegistered(task) {
    this._tPool.has(task);
  }

  /**
   * Recomputes the frame rate based upon the frequency at which {@link TimingHandler#handle} is
   * called from within the application main event loop. The frame rate is needed to sync
   * all timing operations.
   */
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

  /**
   * Returns the approximate frame rate of the software as it executes. The initial value
   * is 10 fps and is updated with each frame. The value is averaged (integrated) over
   * several frames. As such, this value won't be valid until after 5-10 frames.
   * @returns {number} frame-rate
   */
  frameRate() {
    return this._frameRate;
  }

  /**
   * Returns the number of frames displayed since the program started.
   * @returns {number} frame-count
   */
  frameCount() {
    return this._fCount;
  }

  /**
   * Returns all the animated objects registered at the handler.
   * @returns {Set<AnimatorObject>} Animator Objects
   */
  animatorPool() {
    return this._aPool;
  }

  /**
   * Registers the animation object.
   * @param {AnimatorObject} object
   */
  registerAnimator(object) {
    if (object.timingHandler() !== this) {
      object.setTimingHandler(this);
    }
    this._aPool.add(object);
  }

  /**
   * Unregisters the animation object.
   * @param {AnimatorObject} object
   */
  unregisterAnimator(object) {
    this._aPool.delete(object);
  }

  /**
   * Returns `true` if the animation object is registered and `false`
   * otherwise.
   */
  isObjectAnimator(object) {
    this._aPool.has(object);
  }

}

/**
 * An abstract wrapper class holding a {@link TimingTask#timer} together with its callback method
 * ( {@link Taskable#execute}) which derived classes should implement.
 */
class TimingTask extends Taskable {
  /**
   * Default Constructor.
   */
  constructor() {
    super();
    this._timer = null;
  }
  /**
   * Returns the timer instance.
   * @returns {Timer}
   */
  timer() {
    return this._timer;
  }

  /**
   * Sets the timer instance.
   * @param {Timer} timer
   */
  setTimer(timer) {
    this._timer = timer;
  }

  /**
   * Run the {@link TimingTask#timer} with a repeated fixed-rate execution according to `period`.
   * @param {number} period in milliseconds.
   */
  run(period) {
    if (this._timer != null) {
      this._timer().setSingleShot(false);
      this._timer().run(period);
    }
  }

  /**
   * Run the {@link TimingTask#timer} once, according to `period`.
   * @param {number} period in milliseconds.
   */
  runOnce(period) {
    if (this._timer != null) {
      this._timer().setSingleShot(true);
      this._timer().run(period);
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  stop() {
    if (this._timer != null) {
      this._timer().stop();
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  cancel() {
    if (this._timer != null) {
      this._timer().cancel();
    }
  }

  /**
   * Creates the {@link TimingTask#timer}.
   */
  create() {
    if (this._timer != null) {
      this._timer().create();
    }
  }

  /**
   * Tells whether or not the timer is active.
   * @returns {boolean}
   */
  isActive() {
    if (this._timer != null) {
      return this._timer().isActive();
    }
    return false;
  }
}

/**
 * fps-based timing.  
 * A sequential single-threaded timer on top of which Proscene animations and timing routines are built.
 */
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
