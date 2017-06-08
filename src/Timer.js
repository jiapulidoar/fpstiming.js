/**
 * Interface defining timers.
 */
export default class Timer {
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



