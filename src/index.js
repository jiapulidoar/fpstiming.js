import AnimatorObject from './AnimatorObject';
import SequentialTimer from './SequentialTimer';
import TimingHandler from './TimingHandler';
import TimingTask from './TimingTask';
import Timing from './Interface';

/**
 * fps-based timing.
 * A sequential single-threaded timer on top of which Proscene animations and
 * timing routines are built.
 */
const fpstiming = {
  Timing,
  AnimatorObject,
  SequentialTimer,
  TimingHandler,
  TimingTask,
};

export default fpstiming;
