import Timer from './Timer';

/**
 * Sequential timers are single-threaded timers handled by a TimingHandler.
 */
export default class SeqTimer extends Timer {
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
