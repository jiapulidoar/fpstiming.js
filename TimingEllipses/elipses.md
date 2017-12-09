---
title: Ellipses
permalink: ellipses.html
layout: default

---

# Ellipses Example:

> * Press 'c' to toggle the ellipses' color timer.
* Press 'p' to toggle the ellipses' positioning timer.
* Press 'r' to toggle the ellipses' set-radii timer.

<div id="Ellipses">
<!-- Ellipses sketch will go here! -->  
</div>


## Source Code:

### implementing the Ellipse class:

```javascript

class Elipse {
    constructor() {
	this.contourColour = color(random(0,255),random(0,255),random(0,255));
	this.setColor();
	this.setPosition();
	this.setRadii();

    }

    setColor() {
	this.colour = color(random(0,255),random(0,255),random(0,255));
    }



    setRadii(rx = null, ry = null) {
	if (rx != null && ry != null){
	    this.radiusX = rx;
	    this.radiusY = ry;
	}else {
	var maxRadius = 50;
	this.setRadii(random(20, maxRadius), random(20,maxRadius));
	}
    }



    setPosition() {
	var maxRadius = 50;
	var low = maxRadius;
	var highX = width - maxRadius;
	var highY =  height - maxRadius;
	this.center = new createVector(random(low,highX),random(low,highY));
    }



    draw() {
	 stroke(this.contourColour);
	 strokeWeight(4);
	 fill(this.colour);
	 ellipse(this.center.x, this.center.y, 2 * this.radiusX, 2*this.radiusY);
    }
}

```
### Using FPSTiming TimingTask

```javascript
var ellipses;
var handler;
var positionTask, radiiTask, colourTask;


function setup() {
    var canvas = createCanvas(640, 360);
    canvas.parent('Ellipses');
    timingHandler = new fpstiming.TimingHandler();
    ellipses = new Array(50);
    for ( var i =0 ; i < ellipses.length; i++)
	     ellipses[i] = new Elipse();

    positionTaskC = class extends  fpstiming.TimingTask {
	     execute() {
	     setEllipsesPosition();
	   }
   }; // class

   positionTask = new positionTaskC();
    timingHandler.registerTask(positionTask);
    positionTask.run(1000);

    radiiTaskC = class extends fpstiming.TimingTask {
	    execute() {
	    setEllipsesRadii();
	}
    };
    radiiTask = new radiiTaskC();  //Instance
    timingHandler.registerTask(radiiTask);
    radiiTask.run(100);

    colourTaskC = class extends fpstiming.TimingTask {
	    execute() {
	    setEllipsesColor();
	}
    };
    colourTask = new colourTaskC;
    timingHandler.registerTask(colourTask);
    colourTask.run(50);


}

function setEllipsesColor() {
  for (var i = 0; i < ellipses.length; i++)
    ellipses[i].setColor();
}


function setEllipsesPosition() {
  for (var i = 0; i < ellipses.length; i++)
    ellipses[i].setPosition();
}

function setEllipsesRadii() {
  for (var i = 0; i < ellipses.length; i++)
    ellipses[i].setRadii();
}


function draw() {
    background(50);
    //translate(width/2, height/2);
    for ( i = 0; i < ellipses.length; i++)
	ellipses[i].draw();
    timingHandler.handle();
}

function keyPressed(){
    if (key == 'C'){
	if(colourTask.isActive())
	    colourTask.stop();
	else
	    colourTask.run(50);
    }
    if (key == 'P'){
	if(positionTask.isActive())
	    positionTask.stop();
	else
	    positionTask.run(1000);
    }
    if ( key == 'R'){
	if (radiiTask.isActive())
	    radiiTask.stop();
	else
	    radiiTask.run(100);
    }

}

```






<!-- Javascript Code -->
<!-- Adjust sketch size to 600x338px  -->

<script src="./js/fpstiming.js"></script>
<script src="./js/p5.js"></script>

<script src="./TimingEllipses/Ellipse.js"></script>
<script src="./TimingEllipses/TimingEllipses.js"></script>
