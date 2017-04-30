(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fpstiming = factory());
}(this, (function () { 'use strict';

class Animator {}

class AnimatorObject {}

class SeqTimer {}

class Taskable {}

class Timer {}

class TimingHandler {}

class TimingTask {}

const fpstiming = {
  Animator,
  AnimatorObject,
  SeqTimer,
  Taskable,
  Timer,
  TimingHandler,
  TimingTask,
};

return fpstiming;

})));
