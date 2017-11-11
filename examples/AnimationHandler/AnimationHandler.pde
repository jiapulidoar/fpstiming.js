/**
 * Animation Handler.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.3.-AnimationHandler
 *
 * Press '+' to speed up the animation.
 * Press '-' to speed down the animation.
 * Press ' ' (the space bar) to toggle the animation.
 */

import remixlab.fpstiming.*;
import java.lang.reflect.Method;

ParticleSystem system;
TimingHandler handler;

public void setup() {
  size(640, 360, P2D);
  system = new ParticleSystem();
  handler = new TimingHandler(system);
  //new two lines:
  system.addAnimationHandler(this, "animateSystem");
  system.startAnimation();
  smooth();
}

public void draw() {
  background(0);
  pushStyle();
  pushMatrix();
  translate(width/2, height/2);
  strokeWeight(3); // Default
  beginShape(POINTS);
  for (int i = 0; i < system.particle.length; i++) {
    system.particle[i].draw();
  }
  endShape();
  popMatrix();
  popStyle();
  handler.handle();
}

public void keyPressed() {
  if (key == '+')
    system.setAnimationPeriod(system.animationPeriod()-2);
  if (key == '-')
    system.setAnimationPeriod(system.animationPeriod()+2);
  if (key == ' ')
    if(system.animationStarted())
      system.stopAnimation();
    else
      system.startAnimation();
}

// *Externally* define here your animation.
void animateSystem(ParticleSystem sys) {
  for (int i = 0; i < sys.nbPart; i++)
    if (sys.particle[i] != null)
      sys.particle[i].animate();
}