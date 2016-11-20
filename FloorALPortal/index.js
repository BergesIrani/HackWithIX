/*
  Author: Neel Mehta
  Date: 19 November 2016
*/

$(function(){

  var avg_stats="", parsed="";

  var LAMBDA = 0.01;  // Learning rate base constant
  var GAMMA = 1;      // Learning rate exponential proportionality constant

  var optimize = null;
  var static_floor = null;

  var data = null; // Stores the data to be fed once initialised
  var countdown = null;
  var static_revenue = 0;
  var dynamic_revenue = 0;
  var count = 0; // Stores the number of times called

  function init(platform, format) {
    console.log("this worked");
    $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/parsed.json", function(jsonData) {
        console.log("JSON Data logged");
        data = jsonData[platform][format];
        $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/avg_stats.json", function(stat_data) {
            console.log("JSON Data: " + stat_data);

              optimize = OptimizeFloor();
              optimize.init(stat_data["avg_mean"], 0.005, 2)
              static_floor = stat_data.avg_mean;
              countdown = setInterval(addDataPoint, 1);

            function addDataPoint() {
              curr_data_point = data[count];
              var high = curr_data_point.high_bid;
              var avg = curr_data_point.avg_bid;

              static_revenue += calculateRevenue(static_floor, high, avg);
              dynamic_revenue += calculateRevenue(optimize.getCurrentState().floor, high, avg);

              console.log((dynamic_revenue - static_revenue) / static_revenue, optimize.getCurrentState().floor);

              optimize.updateState(curr_data_point.high_bid, curr_data_point.avg_bid);

              // insertData(curr_data_point);
              count += 1;

              if (count == 100) {
                cancelTimer();
              }
            }

            function calculateRevenue(floor, high_bid, avg_bid) {
              if (floor > high_bid) {
                return 0;
              } else if (floor > avg_bid) {
                return floor;
              } else {
                return avg_bid;
              }
            }

            // Stops the running data entry
            function cancelTimer() {
              clearTimeout(countdown);
            }
        });
    });
  }

  init("app", "video");
});
