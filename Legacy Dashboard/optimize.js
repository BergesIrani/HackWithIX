/*
  Author: Rahul Dominic
  Date: 19 November 2016
*/

// Requires JQuery
var OptimizeFloor = function(){

  // Constants
  var LAMBDA = 0.01;  // Learning rate base constant
  var GAMMA = 1;      // Learning rate exponential proportionality constant

  // State variables
  var currFloor = null;
  var oldFloor = null;

  // Prototype for State Object
  function State(maxBid, avgBid, delta, avg_delta, floor = null) {
    this.maxBid = maxBid;
    this.avgBid = avgBid;
    this.delta = delta;   // (high bid) - (floor)
    this.avg_delta = avg_delta;     // (average bid) - (floor)
    this.floor = floor;
  }

      this.init = function(baseFloor, _LAMBDA, _GAMMA) {
        currFloor = new State(null, null, null, null, baseFloor);
        LAMBDA = _LAMBDA;
        GAMMA = _GAMMA;
      }
      // Computes current floor based on old floor
      this.optimizeFloor = function () {
        var newFloor = 0;
        if (currFloor.avg_delta > 0) {
          newFloor = Math.max(oldFloor.floor + currFloor.delta *
                     (Math.pow(LAMBDA, (GAMMA / currFloor.avg_delta))), 0);
        } else if (currFloor.avg_delta == 0) {
          newFloor = Math.max(oldFloor.floor + currFloor.delta * LAMBDA, 0);
        } else if (currFloor.delta < 0) {
          newFloor = Math.max(oldFloor.floor + currFloor.delta *
                     (Math.pow(LAMBDA, (GAMMA / Math.abs(currFloor.avg_delta)))), 0);
        } else {
          newFloor = Math.max(oldFloor.floor + currFloor.avg_delta *
                     (Math.pow(LAMBDA, (GAMMA / currFloor.delta))), 0);
        }
        currFloor.floor = newFloor;
      }

      // Updates current state
      this.updateState = function (maxBid, avgBid) {
        oldFloor = currFloor;
        currFloor = new State (maxBid, avgBid, (maxBid - oldFloor.floor),
                              (avgBid - oldFloor.floor), null);
        this.optimizeFloor();

        return currFloor;
      }

      // Returns the current state variable as State Object
      this.getCurrentState = function () {
        return currFloor;
      }

  // Returns the constructor
  // Setting initial values for data
  return {
      "init": init,
      "optimizeFloor": optimizeFloor,
      "updateState": updateState,
      "getCurrentState": getCurrentState
    }

  }
