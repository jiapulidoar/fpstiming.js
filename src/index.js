import Animator from './Animator';
import AnimatorObject from './AnimatorObject';
import SequentialTimer from './SequentialTimer';
import Taskable from './Taskable';
import Timer from './Timer';
import TimingHandler from './TimingHandler';
import TimingTask from './TimingTask';

/**
 * fps-based timing.
 * A sequential single-threaded timer on top of which Proscene animations and timing routines are built.
 */
const fpstiming = {
  Animator,
  AnimatorObject,
  SequentialTimer,
  Taskable,
  Timer,
  TimingHandler,
  TimingTask,
};

export default fpstiming;
