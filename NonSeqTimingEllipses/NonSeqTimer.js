
class NonSeqTimer extends fpstiming.SequentialTimer {


    constructor(o) {
	super(o);
	this.tmnTask_ = o ;
    }
    //Override
    timingTask(){
	return this.tmntask_;
    }

    //Override
    create() {
	this.stop();

    }

    run(prd = null){
	this.create()
	function worker() {
	    setInterval(function() {
		window.onmessage()
	    }, 100);
	}

	var code = worker.toString();
	code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

	var blob = new Blob([code], {type: "application/javascript"});
	var worker = new Worker(URL.createObjectURL(blob));
	var j = "hhh";
	this.tmnTask_.execute();
	worker.onmessage = function(m) {
	    console.log(this.tmnTask_.from(m));

	};
	this.tmnTask_.execute();

	this.active = true;
    }

    static execute(){
	this.tmnTask_.execute();
    }
    cancel(){
	this.stop();
    }

    stop() {
	if ( this.worker != null) {
	    this.worker.terminate();
	}
	this.active = false;
    }

    isActive(){
	return this.worker != null && active;
    }
    // Period and Single Shot are missing

    setSingleShot(single){
	this.runOnlyOnce = single;
    }


}
