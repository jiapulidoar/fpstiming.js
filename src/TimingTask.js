import Taskable from './Taskable';

/**
 * An abstract wrapper class holding a {@link TimingTask#timer} together with its callback method
 * ( {@link Taskable#execute}) which derived classes should implement.
 */
export default class TimingTask extends Taskable {
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
