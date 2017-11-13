/**
 * Animation 2D.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.1.-Animation2D
 *
 * Press '+' to speed up the animation.
 * Press '-' to speed down the animation.
 * Press ' ' (the space bar) to toggle the animation.
 */

import remixlab.timing.*;

ParticleSystem system;
TimingHandler handler;

public void setup() {
  size(640, 360, P2D);
  handler = new TimingHandler();
  system = new ParticleSystem(handler);
  system.start();
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
    system.setPeriod(system.period()-2);
  if (key == '-')
    system.setPeriod(system.period()+2);
  if (key == ' ')
    system.toggle();
}