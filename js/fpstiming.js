(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fpstiming = factory());
}(this, (function () { 'use strict';

/**
 * Sequential timers are single-threaded timers handled by a TimingHandler.
 */
class SequentialTimer {
  /**
  * Defines a sequential (single-threaded) timer.
  *
  * @param {TimingHandler} options.handler timing handler owner
  * @param {boolean} options.singleShot Defines a single shot sequential (single-threaded) timer
  * @param {TimingTask} options.task if not null, register a callback task
  */
  constructor({ handler, singleShot = false, task = null }) {
    this._task = task;
    this._handler = handler;
    this._active = false;
    this._once = singleShot;
    this._counter = 0;
    this._period = 0;
    this._startTime = window.performance.now();
    this.create();
  }

  timingTask() {
    return this._task;
  }
  /**
  * Executes the callback method defined by the {@link SequentialTimer#timingTask}.
  * *Note:* You should not call this method since it's done by the
  * timing handler (see {@link TimingHandler#handle}).
  */
  _execute() {
    const result = this.triggered();
    if (result) {
      this._task.execute();
      if (this._once) {
        this.inactivate();
      }
    }
    return result;
  }

  cancel() {
    this.stop();
    this._handler.unregisterTask(this);
  }

  create() {
    this.inactivate();
  }

  run(period = null) {
    if (period !== null) {
      this.setPeriod(period);
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
   * Deactivates the SequentialTimer.
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
    const timePerFrame = (1 / this._handler.frameRate()) * 1000;
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
    return this._once;
  }

  setSingleShot(singleShot) {
    this._once = singleShot;
  }
}

/**
 * Class implementing the main Animator behavior.
 */
class AnimatorObject{
  /**
  * Constructs an animated object with a default {@link AnimatorObject#animationPeriod}
  * of 40 milliseconds (25Hz)
  * @param {TimingHandler} handler
  */
  constructor(handler) {
    this._handler = handler;
    this._handler.registerAnimator(this);
    this._animationTimer = new SequentialTimer({ handler: this._handler });
    this.setPeriod(40); // 25Hz
    this.stop();
  }

  /**
   * @returns {SequentialTimer}
   */
  timer() {
    return this._animationTimer;
  }

  /**
   * Return true when the animation loop is started.
   * The timing handler will check when {@link AnimatorObject#started} and then called the
   * animation callback method every {@link AnimatorObject#period} milliseconds.
   * Use {@link AnimatorObject#start} and {@link AnimatorObject#stop}.
   * @see AnimatorObject#start
   * @see AnimatorObject#animate
   * @returns {boolean}
   */
  started() {
    return this._started;
  }

  /**
   * The animation loop period, in milliseconds. When {@link AnimatorObject#started}, this is
   * the delay that takes place between two consecutive iterations of the animation loop.
   * This delay defines a target frame rate that will only be achieved if your
   * {@link AnimatorObject#animate} methods is fast enough.
   * Default value is 40 milliseconds (25 Hz).
   * Note: This value is taken into account only the next time you call
   * {@link AnimatorObject#start}. If {@link AnimatorObject#started}, you should
   * {@link AnimatorObject#stop} first. See {@link AnimatorObject#restart} and
   * {@link AnimatorObject#setPeriod}.
   * @see AnimatorObject#setPeriod
   * @returns {number}
   */
  period() {
    return this._animationPeriod;
  }

  /**
   * Sets the {@link AnimatorObject#period}, in milliseconds. If restart is true and
   * {@link AnimatorObject#started} then {@link AnimatorObject#restart} is called.
   * @see AnimatorObject#start
   * @param {number} period
   */
  setPeriod(period) {
    if (period > 0) {
      this._animationPeriod = period;
      if (this.started()) {
        this.restart();
      }
    }
  }

  /**
   * Stops animation.
   * @see AnimatorObject#start
   */
  stop() {
    this._started = false;
    if (this.timer() != null) {
      this.timer().stop();
    }
  }

  /**
   * Starts the animation loop.
   * @see AnimatorObject#started
   */
  start() {
    this._started = true;
    if (this.timer() != null) {
      this.timer().run(this._animationPeriod);
    }
  }

  toggle() {
    if (this.started()) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Simply calls {@link AnimatorObject#stop} and then {@link AnimatorObject#start}.
   */
  restart() {
    this.stop();
    this.start();
  }

  /**
   * Main callback method.
   */
  animate() {
    throw new TypeError('animate must be overrided');
  }

}

/**
 * Interface is used to check if an Object implements a desired set of behaviors
 * Adapted from {@link http://jscriptpatterns.blogspot.com.co/2013/01/javascript-interfaces.html}
 */

class Interface {
  /**
   * @param methods
   */
  constructor({ name, methods }) {
    this._name = name;
    this._methods = [];

    for (let i = 0, len = methods.length; i < len; i++) {
      if (typeof methods[i] !== 'string') {
        throw new Error("Interface constructor expects method names to be passed in as a string.");
      }
      this._methods.push(methods[i]);
    }
  }

  ensureImplements(object) {
    for (let j = 0, methodsLen = this._methods.length; j < methodsLen; j++) {
      const method = this._methods[j];
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error("Function Interface.ensureImplements: object does not implement the " + this._name + " interface. Method " + method + " was not found.");
      }
    }
  }
}

const Timing = {"Animator": new Interface( { name: "Animator", methods: ["animate","period", "setPeriod", "stop", "start", "restart", "toggle", "started", "timer"] }),
  "Timer": new Interface({ name: "Timer", methods: ["run","timingTask", "stop", "cancel", "create", "isActive","period", "setPeriod", "isSingleShot", "setSingleShot"] }),
  "Taskable": new Interface({ name: "Taskable", methods: ["execute"] })};

/**
 * A timing handler holds a {@link TimingHandler#timerPool}
 * and an {@link TimingHandler#animatorPool}. The timer
 * pool are all the tasks scheduled to be performed in the future (one single time or
 * periodically). The animation pool are all the objects that implement an animation
 * callback function. For an introduction to FPSTiming please refer to {@link fpstiming}
 */
class TimingHandler {
  /**
   * Main Constructor
   */
  constructor() {
    this._taskPool = new Set();
    this._animatorPool = new Set();
    this._frameRateLastMillis = window.performance.now();
    this._frameRate = 10;
    this._localCount = 0;
    this._deltaCount = TimingHandler.frameCount;
  }

  /**
   * Handler's main method. It should be called from within your main event loop. It does
   * the following: 1. Recomputes the frame rate; 2. Executes the all timers (those in the
   * {@link TimingHandler#timerPool}) callback functions; and, 3. Performs all the animated objects
   * (those in the {@link TimingHandler#animatorPool}) animation functions.
   */
  handle() {
    this._updateFrameRate();
    this._taskPool.forEach((task) => {
      if (task.timer() !== null) {
        if (task.timer() instanceof SequentialTimer) {
          if (task.timer().timingTask() !== null) {
            task.timer()._execute();
          }
        }
      }
    });
    this._animatorPool.forEach((aObj) => {
      if (aObj.started()) {
        if (aObj.timer().triggered()) {
          aObj.animate();
        }
      }
    });
  }
  /**
   * Returns the timer pool.
   * @returns {Set<TimingTask>} timingTasks callbacks
   */
  timerPool() {
    return this._taskPool;
  }

  /**
   * Register a task in the timer pool and creates a sequential timer for it with an optional timer.
   * @param {TimingTask} task
   * @param {Timer} [timer = null]
   */
  registerTask(task, timer = null) {
    if (timer === null) {
      task.setTimer(new SequentialTimer({ handler: this, task }));
    } else {
      // Check if timer implements Timer methods
      Timing.Timer.ensureImplements(timer);
      task.setTimer(timer);
    }
    this._taskPool.add(task);
  }

  /**
   * Unregisters the timer. You may also unregister the task this timer is attached to.
   * @param {TimingTask|SequentialTimer} task
   */
  unregisterTask(task) {
    if (task instanceof SequentialTimer) {
      this._taskPool.delete(task.timingTask());
    } else {
      this._taskPool.delete(task);
    }
  }

  /**
   * Returns `true` if the task is registered and `false` otherwise.
   * @returns {boolean}
   */
  isTaskRegistered(task) {
    this._taskPool.has(task);
  }

  /**
   * Recomputes the frame rate based upon the frequency at which {@link TimingHandler#handle} is
   * called from within the application main event loop. The frame rate is needed to sync
   * all timing operations.
   */
  _updateFrameRate() {
    const now = window.performance.now();
    if (this._localCount > 1) {
      // update the current _frameRate
      const rate = 1000.0 / ((now - this._frameRateLastMillis) / 1000.0);
      const instantaneousRate = rate / 1000.0;
      this._frameRate = (this._frameRate * 0.9) + (instantaneousRate * 0.1);
    }
    this._frameRateLastMillis = now;
    this._localCount++;
    //TODO needs testing but I think is also safe and simpler
    //if (TimingHandler.frameCount < frameCount())
    //TimingHandler.frameCount = frameCount();
    if (TimingHandler.frameCount < this.frameCount() + this._deltaCount)
      TimingHandler.frameCount = this.frameCount() + this._deltaCount;
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
    return this._localCount;
  }

  /**
   * Converts all registered timers to single-threaded timers.
   */
  restoreTimers() {
    this._taskPool.forEach((task) => {
      let period = 0;
      let rOnce = false;
      const isActive = task.isActive();
      if (isActive) {
        period = task.period();
        rOnce = task.timer().isSingleShot();
      }
      task.stop();
      task.setTimer(new SequentialTimer({ handler: this, task }));
      if (isActive) {
        if (rOnce) { task.runOnce(period); } else { task.run(period); }
      }
    });
    console.log('single threaded timers set');
  }

  // Animation -->

  /**
   * Returns all the animated objects registered at the handler.
   * @returns {Set<AnimatorObject>} Animator Objects
   */
  animatorPool() {
    return this._animatorPool;
  }

  /**
   * Registers the animation object.
   * @param {AnimatorObject} object
   */
  registerAnimator(animator) {
    // Check if animator implements Animator methods
    Timing.Animator.ensureImplements(animator);
    this._animatorPool.add(animator);
  }

  /**
   * Unregisters the animation object.
   * @param {AnimatorObject} object
   */
  unregisterAnimator(animator) {
    this._animatorPool.delete(animator);
  }

  /**
   * Returns `true` if the animation object is registered and `false`
   * otherwise.
   */
  isAnimatorRegistered(object) {
    this._animatorPool.has(object);
  }
}
// static field
TimingHandler.frameCount = 0;

/**
 * An abstract wrapper class holding a {@link TimingTask#timer} together with its callback method
 * ( {@link Taskable#execute}) which derived classes should implement.
 */
class TimingTask {
  /**
   * Default Constructor.
   */
  constructor() {
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
   * @param timer
   */
  setTimer(timer) {
    // check if timer implements Timer methods
    Timing["Timer"].ensureImplements(timer);
    this._timer = timer;
  }

  /**
   * Run the {@link TimingTask#timer} with a repeated fixed-rate execution according to `period`.
   * @param {number} period in milliseconds.
   */
  run(period) {
    if (this.timer() != null) {
      this.timer().setSingleShot(false);
      this.timer().run(period);
    }
  }

  /**
   * Run the {@link TimingTask#timer} once, according to `period`.
   * @param {number} period in milliseconds.
   */
  runOnce(period) {
    if (this.timer() != null) {
      this.timer().setSingleShot(true);
      this.timer().run(period);
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  stop() {
    if (this.timer() != null) {
      this.timer().stop();
    }
  }

  /**
   * Stops the {@link TimingTask#timer}.
   */
  cancel() {
    if (this.timer() != null) {
      this.timer().cancel();
    }
  }

  /**
   * Creates the {@link TimingTask#timer}.
   */
  create() {
    if (this.timer() != null) {
      this.timer().create();
    }
  }

  /**
   * Tells whether or not the timer is active.
   * @returns {boolean}
   */
  isActive() {
    if (this.timer() != null) {
      return this.timer().isActive();
    }
    return false;
  }

  /**
  * Timer wrapper method.
  * @returns {number}
  */
  period() {
    return this.timer().period();
  }
}

/**
 * fps-based timing.
 * A sequential single-threaded timer on top of which Proscene animations and
 * timing routines are built.
 */
const fpstiming = {
  Timing,
  AnimatorObject,
  SequentialTimer,
  TimingHandler,
  TimingTask,
};

return fpstiming;

})));
