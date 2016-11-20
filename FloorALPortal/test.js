$(function(e){

  var avg_stats="", parsed="";

  var optimize = null;
  var static_floor = null;

  var data = null; // Stores the data to be fed once initialised
  var countdown = null;
  var static_revenue = 0;
  var dynamic_revenue = 0;

  var mainEl = $('#main-content');

  var profits = [];

  function testData(platform, format, startL, endL, startG, endG, stepL = 0.005, stepG = 0.1) {
    for(var i = startL; i < endL; i+=stepL) {
      for(var j = startG; j < endG; j+=startG) {
        var str = "";
        str = "Lambda: " + i.toString() + " Gamma: " + j.toString() + "</br>";
        mainEl.html(mainEl.html() + str)
        init(platform, format, i, j);
      }
    }
  }

  function init(platform, format, i, j) {
    var count = 0;
    console.log("this worked");
    $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/parsed.json", function(jsonData) {
        console.log("JSON Data logged");
        data = jsonData[platform][format];
        $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/avg_stats.json", function(stat_data) {

              optimize = OptimizeFloor();
              optimize.init(stat_data["avg_mean"], i, j)
              static_floor = stat_data.avg_mean;
              countdown = setInterval(addDataPoint, 1);

            function addDataPoint() {
              curr_data_point = data[count];
              var high = curr_data_point.high_bid;
              var avg = curr_data_point.avg_bid;
              console.log("high: " + high);

              static_revenue += calculateRevenue(static_floor, high, avg);
              dynamic_revenue += calculateRevenue(optimize.getCurrentState().floor, high, avg);

              optimize.updateState(curr_data_point.high_bid, curr_data_point.avg_bid);

              // insertData(curr_data_point);
              count += 1;

              if (count == 100) {
                cancelTimer();
                $('#main-content2').html($('#main-content2').html() +
                ((dynamic_revenue - static_revenue) / static_revenue).toString() + "</br>");
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
  testData("app", "video", 0, 0.2, 0.5, 2.5);
  alert();
});
