// @flow
export default class SeqTimer {
  create() {}

  constuctor(options) {
    this.handler = options.handler;
    this.runOnlyOnce = options.runOnlyOnce || false;
    this.task = options.task;
    this.create();
    // aliases
    this.stop = this.inactivate;
  }

  execute() {
    const result = this.triggered();
    if (result) {
      this.task.execute();
      if (this.runOnlyOnce) {
        this.active = false;
      }
    }
  }

  triggered() {
    if (!this.active) {
      return false;
    }
    let result = false;
    const elapsedTime = 0;
    const timePerFrame = (1 / this.handler.frameRate) * 1000;
    const threshold = this.counter * this.period;
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
      this.counter += 1;
    }

    return result;
  }

  inactivate() {
    this.active = false;
  }

  run(period) {
    if (period !== undefined) {
      this.period = period;
    }
    if (period <= 0) {
      return;
    }
    this.counter = 1;
    this.active = true;
    // this.startTime =
  }
}
