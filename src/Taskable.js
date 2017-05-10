export default class Taskable {
  constructor() {
    if (typeof this.execute === 'function') {
      throw new TypeError('execute must be overrided');
    }
  }
}
