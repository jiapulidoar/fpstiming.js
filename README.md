fpstiming.js
============

# Description

fps-based timing library.

A sequential single-threaded timer on top of which Proscene animations 
and timing routines are built.

# Usage

```javascript
let aObj = new Test(); // object that must extend fpstiming.AnimatorObject
var handler = new fpstiming.TimingHandler(aObj); // declare the handler
aObj.startAnimation(); // startAnimation on AnimatorObject
function step(timestamp) {
  handler.handle();
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step); // use requestAnimationFrame or draw function in p5.js
```
# Code Style Guide

- Private variables starts with an underscore "_" (e.g., `_variable_name`).
- we recommend airbnb's Javascript Style [Guide](https://github.com/airbnb/javascrip)]

# Hacking

## Initial setup

This project uses [rollup](https://rollupjs.org/) as build system and
[esdoc](https://esdoc.org/) as documentation generator:

```sh
npm install --global rollup
npm install --global esdoc
```

there are 2 scripts available:

```sh
npm build # compiles fpstiming in a single file availabe on /build/fpstiming/.js
npm doc # generates the documentation on /doc folder
```

this project uses ES6 features, you can see an updated list of features
implemented in diferent transpilers or browsers [here](https://kangax.github.io/compat-table/es6/)

# Acknowledgements

[Jairo Suárez](https://github.com/xyos) for the js port.

# Author, core developer and maintainer

[Jean Pierre Charalambos](http://disi.unal.edu.co/profesores/pierre/), [National University of Colombia](http://www.unal.edu.co)
