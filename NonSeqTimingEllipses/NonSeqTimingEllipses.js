var ellipses;
var handler;
var positionTask, radiiTask, colourTask;


function setup() {
    createCanvas(640, 360);
    timingHandler = new fpstiming.TimingHandler();
    ellipses = new Array(50);
    for ( var i =0 ; i < ellipses.length; i++)
	  ellipses[i] = new Elipse();

    positionTaskC = class extends  fpstiming.TimingTask {
    	execute() {
    	    setEllipsesPosition();
    	}
    };
    positionTask = new positionTaskC();
    registerTimingTask(positionTask);
    positionTask.run(1000);

    radiiTaskC = class extends fpstiming.TimingTask {
    	execute() {
    	    setEllipsesRadii();
    	}
    };
    radiiTask = new radiiTaskC();
    registerTimingTask(radiiTask);
    radiiTask.run(100);

    colourTaskC = class extends fpstiming.TimingTask {
    	 execute() {
    	    setEllipsesColor();
    	}
    };
    colourTask = new colourTaskC();
    registerTimingTask(colourTask);
    colourTask.run(50);


}

function registerTimingTask(task){
    timingHandler.registerTask(task, new NonSeqTimer(task));
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
