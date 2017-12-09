/**
 * Animation 2D.
 * by Jean Pierre Charalambos.
 *
 * Documentation found on the online tutorial: https://github.com/nakednous/fpstiming/wiki/1.1.-Animation2D
 *
 * Press 'x' to speed up the camera animation.
 * Press 'y' to speed down the camera animation.
 * Press 'z' (the space bar) to toggle the camera animation.
 * Press 'c' to speed up the particles animation.
 * Press 'v' to speed down the particles animation.
 * Press 'b' (the space bar) to toggle the particles animation.
 */

class AnimatedParticle extends fpstiming.AnimatorObject {
  constructor(handler){
    super(handler);
    this.speed = new p5.Vector();
    this.pos = new p5.Vector();
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
    this.init();
    this.start();
  }

  animate() {
    this.speed.z -= 0.05;
    this.pos = p5.Vector.add(this.pos, p5.Vector.mult(this.speed, 10));
    if (this.pos.z < 0.0) {
      this.speed.z = -0.8 * this.speed.z;
      this.pos.z = 0.0;
    }
    if (++this.age == floor(this.ageMax)) {
      this.init();
    }
  }

  draw() {
    push();
    stroke( 255 * (this.age * 1.0 / this.ageMax), 255 * (this.age * 1.0 / this.ageMax), 255);
    ambientMaterial( 255 * (this.age * 1.0 / this.ageMax), 255 * (this.age * 1.0 / this.ageMax), 255);
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(3,10,10);
    pop();
  }

  init() {
    this.pos = new p5.Vector();
    const angle = 2.0 * PI * random(1);
    const norm = 0.04 * random(1);
    this.speed = new p5.Vector(norm * cos(angle), norm  * sin(angle), random(1));
    this.age = 0;
    this.ageMax = 50 + random(100);
  }
}

class ParticleSystem extends fpstiming.AnimatorObject {
  constructor(handler) {
    super(handler);
    this.nbPart = 300;
    this.particle = Array(this.nbPart);
    this.rotation = 0;
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i] = new AnimatedParticle(handler);
    }
    this.start();
  }
  animate() {
    const orbitRadius= mouseX/2+50;
    const ypos= mouseY/3;
    const xpos= cos( radians( this.rotation )) * orbitRadius;
    const zpos= sin( radians( this.rotation )) * orbitRadius;
    camera(xpos, ypos, zpos, 0, 0, 0, 0, -1, 0);
    this.rotation++;
  }

  setParticlesAnimationPeriod(period) {
    for (let i = 0; i < this.particle.length; i++)
      this.particle[i].setPeriod(period);
  }

  particlesAnimationPeriod() {
    return this.particle[0].period();
  }

  toggleParticlesAnimation() {
    for (let i = 0; i < this.particle.length; i++)
      this.particle[i].toggle();
  }
}

let handler, system;

function setup() {
  canvas = createCanvas(600, 338, WEBGL);
  canvas.parent('Animation3D');
  handler = new fpstiming.TimingHandler();
  system = new ParticleSystem(handler);
  //smooth();
}

function draw() {
  background(0);

  push();
  strokeWeight(3); // Default
  for (let i = 0; i < system.particle.length; i++) {
    system.particle[i].draw();
  }
  pop();


  handler.handle();
}

function keyPressed() {
  if ((key == 'x') || (key == 'X'))
    system.setPeriod(system.period()-2);
  if ((key == 'y') || (key == 'Y'))
    system.setPeriod(system.period()+2);
  if ((key == 'z') || (key == 'Z'))
    system.toggle();
  if ((key == 'c') || (key == 'C'))
    system.setParticlesAnimationPeriod(system.particlesAnimationPeriod()-2);
  if ((key == 'v') || (key == 'V'))
    system.setParticlesAnimationPeriod(system.particlesAnimationPeriod()+2);
  if ((key == 'b') || (key == 'B'))
    system.toggleParticlesAnimation();
}
