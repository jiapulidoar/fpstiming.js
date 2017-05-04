export default class Timer {
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
