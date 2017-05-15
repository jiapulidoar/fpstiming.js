import Taskable from './Taskable.js';

export default class TimingTask extends Taskable {
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
