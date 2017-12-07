
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

    
