/**
 * Non Sequential Timing Ellipses.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.4.-TimingEllipses
 *
 * Press 'c' to toggle the ellipses' color timer.
 * Press 'p' to toggle the ellipses' positioning timer.
 * Press 'r' to toggle the ellipses' set-radii timer.
 * Press 's' to toggle the timer types (sequential/non-sequential).
 */

import remixlab.timing.*;

Ellipse [] ellipses;
TimingHandler timingHandler;
TimingTask positionTask, radiiTask, colourTask;

boolean  javaTiming;

void setup() {
  size(600, 600);
  timingHandler = new TimingHandler();
  ellipses = new Ellipse[50];
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i] = new Ellipse();
  positionTask = new TimingTask() {
    @Override
    public void execute() {
      setEllipsesPosition();
    }
  };
  registerTimingTask(positionTask);
  positionTask.run(1000);
  radiiTask = new TimingTask() {
    @Override
    public void execute() {
      setEllipsesRadii();
    }
  };
  registerTimingTask(radiiTask);
  radiiTask.run(100);
  colourTask = new TimingTask() {
    @Override
    public void execute() {
      setEllipsesColor();
    }
  };
  registerTimingTask(colourTask);
  colourTask.run(50);
}

public void registerTimingTask(TimingTask task) {
  if (areTimersSeq())
    timingHandler.registerTask(task);
  else
    timingHandler.registerTask(task, new NonSeqTimer(task));
}

public void setSeqTimers() {
  if (areTimersSeq())
    return;

  javaTiming = false;
  timingHandler.restoreTimers();
}

public void setNonSeqTimers() {
  if (!areTimersSeq())
    return;

  boolean isActive;

  for (TimingTask task : timingHandler.timerPool ()) {
    long period = 0;
    boolean rOnce = false;
    isActive = task.isActive();
    if (isActive) {
      period = task.period();
      rOnce = task.timer().isSingleShot();
    }
    task.stop();
    task.setTimer(new NonSeqTimer(task));
    if (isActive) {
      if (rOnce)
        task.runOnce(period);
      else
        task.run(period);
    }
  }

  javaTiming = true;
  println("java util timers set");
}

public boolean areTimersSeq() {
  return !javaTiming;
}

public void switchTimers() {
  if (areTimersSeq())
    setNonSeqTimers();
  else
    setSeqTimers();
}

void setEllipsesColor() {
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i].setColor();
}

void setEllipsesPosition() {
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i].setPosition();
}

void setEllipsesRadii() {
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i].setRadii();
}

void draw() {
  background(25, 75, 125);
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i].draw();
  timingHandler.handle();
}

void keyPressed() {
  if (key == 'c')
    if (colourTask.isActive())
      colourTask.stop();
    else
      colourTask.run(50);
  if (key == 'p')
    if (positionTask.isActive())
      positionTask.stop();
    else
      positionTask.run(1000);
  if (key == 'r')
    if (radiiTask.isActive())
      radiiTask.stop();
    else
      radiiTask.run(100);
  if (key == 's')
    switchTimers();
}
