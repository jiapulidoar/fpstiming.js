export default class Taskable {
  execute(){
    throw new TypeError('execute must be overrided');
  }
}
