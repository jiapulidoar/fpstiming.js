import Animator from './Animator';
import AnimatorObject from './AnimatorObject';
import SeqTimer from './SeqTimer';
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
  SeqTimer,
  Taskable,
  Timer,
  TimingHandler,
  TimingTask,
};

export default fpstiming;
