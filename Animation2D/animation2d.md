---
title: Animation 2D
permalink: animation2d.html
layout: default

---

# Animation2D Exampe:

>* Press 'A' to speed up the animation.
* Press 'D' to speed down the animation.
* Press 'S' (the space bar) to toggle the animation.

<div id="Animation2D">
<!-- Ellipses sketch will go here! -->  
</div>

## Source Code:

```javascript

class Particle2D {
  constructor() {
    this.speed = new p5.Vector();
    this.pos = new p5.Vector();
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
    this.init();
  }

  init() {
    this.pos = new p5.Vector();
    const angle = 2 * PI * random(1);
    const norm = 0.04 * random(1);
    this.speed = new p5.Vector(norm * cos(angle), norm * sin(angle));
    this.age = 0;
    this.ageMax = 50 + parseInt(random(100));
  }

  animate() {
    this.speed.z -= 0.05;
    this.pos = p5.Vector.add(this.pos, p5.Vector.mult(this.speed, 10));
    if (++this.age === floor(this.ageMax)) {
      this.init();
    }
  }

  draw() {
    stroke(255 * (this.age / this.ageMax), 255 * (this.age / this.ageMax), 255);
    vertex(this.pos.x, this.pos.y);
  }
}

class ParticleSystem extends fpstiming.AnimatorObject {
  constructor(handler) {
    super(handler);
    this.nbPart = 2000;
    this.particle = Array(this.nbPart);
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i] = new Particle2D();
    }
  }
  animate() {
    for (let i = 0; i < this.nbPart; i++) {
      this.particle[i].animate();
    }
  }
}

let handler, system;

function setup() {
  canvas = createCanvas(600, 338);
  canvas.parent('Animation2D');
  handler = new fpstiming.TimingHandler();
  system = new ParticleSystem(handler);
  system.start();
  smooth();
}

function draw() {
  background(0);
  push();
  translate(width/2, height/2);
  strokeWeight(3); // Default
  beginShape();
  for (let i = 0; i < system.particle.length; i++) {
    system.particle[i].draw();
  }
  endShape();
  pop();
  handler.handle();
}
function keyPressed() {
  if (key === 'A' ){
      system.setPeriod(system.animationPeriod-10);
  }

  if (key === 'D' )
    system.setPeriod(system.animationPeriod+10);
  if (key === 'S' )
    system.toggle();
}

```


<!-- Javascript Code -->
<!-- Adjust sketch size to 600x338px  -->

<script src="./js/fpstiming.js"></script>
<script src="./js/p5.js"></script>

<script src="./Animation2D/sketch.js"></script>
