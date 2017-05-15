import SeqTimer from './SeqTimer';

/**
 * A timing handler holds a {@link TimingHandler#timerPool} and an {@link TimingHandler#animatorPool}. The timer
 * pool are all the tasks scheduled to be performed in the future (one single time or
 * periodically). The animation pool are all the objects that implement an animation
 * callback function. For an introduction to FPSTiming please refer to {@link fpstiming}
 */
export default class TimingHandler {
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
