# Ellipses Example:

<div id="Ellipses">
<!-- Ellipses sketch will go here! -->  
</div>


## Source Code:

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
