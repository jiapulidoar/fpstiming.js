export default class Timer {
  run(){
    throw new TypeError('run must be overrided');
  }
  get timingTask(){
    throw new TypeError('get timingTask must be overrided');
  }
  stop(){
    throw new TypeError('stop must be overrided');
  }
  cancel(){
    throw new TypeError('cancel must be overrided');
  }
  create(){
    throw new TypeError('create must be overrided');
  }
  isActive(){
    throw new TypeError('isActive must be overrided');
  }
  get period(){
    throw new TypeError('get period must be overrided');
  }
  set period(number){
    throw new TypeError('set period must be overrided');
  }
  setPeriod(){
    throw new TypeError('setPeriod must be overrided');
  }
  isSingleShot(){
    throw new TypeError('isSingleShot must be overrided');
  }
  setSingleShot(){
    throw new TypeError('setSingleShot must be overrided');
  }
}
