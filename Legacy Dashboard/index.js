/*
  Author: Neel Mehta
  Date: 19 November 2016
*/

$(function(){

  var avg_stats = "", parsed = "";

  var LAMBDA = 0.01;  // Learning rate base constant
  var GAMMA = 1;      // Learning rate exponential proportionality constant

  var v_optimize = null;
  var b_optimize = null;
  var v_static_floor = null;
  var b_static_floor = null;

  var max_length = 110;

  var v_data = null;
  var b_data = null; // Stores the data to be fed once initialised
  var countdown = null;
  var v_static_revenue = 0;
  var v_dynamic_revenue = 0;
  var b_static_revenue = 0;
  var b_dynamic_revenue = 0;
  var v_data_high = [];
  var v_data_avg = [];
  var v_data_floor = [];
  var v_data_revenue = [];
  var b_data_high = [];
  var b_data_avg = [];
  var b_data_floor = [];
  var b_data_revenue = [];
  var count = 0; // Stores the number of times called

  function init(platform) {
    console.log("this worked");
    $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/parsed.json", function(jsonData) {
        console.log("JSON Data logged");

        v_data = jsonData[platform]["video"];
        b_data = jsonData[platform]["banner"];

        $.getJSON("https://raw.githubusercontent.com/rahulbdominic/HackWithIX/master/Data/avg_stats.json", function(stat_data) {
            console.log("JSON Data: " + stat_data);

            v_optimize = OptimizeFloor();
            b_optimize = OptimizeFloor();
            v_optimize.init(stat_data["video_avg_mean"], 0.005, 2);
            b_optimize.init(stat_data["banner_avg_mean"], 0.2, 5);

            v_static_floor = stat_data.video_avg_mean;
            b_static_floor = stat_data.banner_avg_mean;
            countdown = setInterval(addDataPoint, 500);

            function addDataPoint() {
              // Doing stuff for video
              curr_data_point = v_data[count];
              var high = curr_data_point.high_bid;
              var avg = curr_data_point.avg_bid;

              var stat_rev_curr = calculateRevenue(v_static_floor, high, avg);
              var dyn_rev_curr = calculateRevenue(v_optimize.getCurrentState().floor, high, avg);

              v_static_revenue += stat_rev_curr;

              if (stat_rev_curr > dyn_rev_curr) {
                v_dynamic_revenue += stat_rev_curr;
              } else {
                v_dynamic_revenue += dyn_rev_curr;
              }

              document.getElementById("v_static_money").innerHTML = "$" + v_static_revenue.toFixed(2);
              document.getElementById("v_dynamic_money").innerHTML = "$" + v_dynamic_revenue.toFixed(2);
              document.getElementById("v_diff_text").innerHTML = "$" + (v_dynamic_revenue - v_static_revenue).toFixed(2)
              + " (" + (((v_dynamic_revenue - v_static_revenue) / v_static_revenue) * 100).toFixed(2) + "%)";

              v_data_high.push(high);
              v_data_avg.push(avg);
              v_data_floor.push(v_optimize.getCurrentState().floor);
              v_data_revenue.push(v_dynamic_revenue - v_static_revenue);

              if (v_data_high.length > max_length) {
                v_data_high = v_data_high.slice(1);
                v_data_avg = v_data_avg.slice(1);
                v_data_floor = v_data_floor.slice(1);
                v_data_revenue = v_data_revenue.slice(1);
              }

              var high_plot = [];
              var avg_plot = [];
              var dynamic_floor_plot = [];
              var revenue_plot = [];
              for (var i = 0; i < v_data_high.length; i++) {
                high_plot.push([i, v_data_high[i]]);
                avg_plot.push([i, v_data_avg[i]]);
                dynamic_floor_plot.push([i, v_data_floor[i]]);
                revenue_plot.push([i, v_data_revenue[i]]);
              }

              var high_plot_series = { color : "#F44336",
                                       data  : high_plot,
                                       lines: {
                                         fill : true
                                       }};
              var avg_plot_series = { color : "#4CAF50",
                                       data  : avg_plot,
                                       lines: {
                                         fill : true
                                       }};
              var dynamic_floor_plot_series = { color : "#03A9F4",
                                      data  : dynamic_floor_plot };
              var revenue_plot_series = { color : "#000",
                                          data  : revenue_plot,
                                          lines: {
                                            fill : true
                                          }};

              var plot = $.plot("#video_bid", [high_plot_series, avg_plot_series, dynamic_floor_plot_series], {});
              plot = $.plot("#video_revenue", [revenue_plot_series], {});

              v_optimize.updateState(curr_data_point.high_bid, curr_data_point.avg_bid);

              // Doing stuff for banner
              curr_data_point = b_data[count];
              high = curr_data_point.high_bid;
              avg = curr_data_point.avg_bid;

              stat_rev_curr = calculateRevenue(b_static_floor, high, avg);
              dyn_rev_curr = calculateRevenue(b_optimize.getCurrentState().floor, high, avg);

              b_static_revenue += stat_rev_curr;

              if (stat_rev_curr > dyn_rev_curr) {
                b_dynamic_revenue += stat_rev_curr;
              } else {
                b_dynamic_revenue += dyn_rev_curr;
              }

              document.getElementById("b_static_money").innerHTML = "$" + b_static_revenue.toFixed(2);
              document.getElementById("b_dynamic_money").innerHTML = "$" + b_dynamic_revenue.toFixed(2);
              document.getElementById("b_diff_text").innerHTML = "$" + (b_dynamic_revenue - b_static_revenue).toFixed(2)
              + " (" + (((b_dynamic_revenue - b_static_revenue) / b_static_revenue) * 100).toFixed(2) + "%)";

              b_data_high.push(high);
              b_data_avg.push(avg);
              b_data_floor.push(b_optimize.getCurrentState().floor);
              b_data_revenue.push(b_dynamic_revenue - b_static_revenue);

              if (b_data_high.length > max_length) {
                b_data_high = b_data_high.slice(1);
                b_data_avg = b_data_avg.slice(1);
                b_data_floor = b_data_floor.slice(1);
                b_data_revenue = b_data_revenue.slice(1);
              }

              high_plot = [];
              avg_plot = [];
              dynamic_floor_plot = [];
              revenue_plot = [];
              for (var i = 0; i < b_data_high.length; i++) {
                high_plot.push([i, b_data_high[i]]);
                avg_plot.push([i, b_data_avg[i]]);
                dynamic_floor_plot.push([i, b_data_floor[i]]);
                revenue_plot.push([i, b_data_revenue[i]]);
              }

              high_plot_series = { color : "#F44336",
                                       data  : high_plot,
                                       lines: {
                                         fill : true
                                       }};
              avg_plot_series = { color : "#4CAF50",
                                       data  : avg_plot,
                                       lines: {
                                         fill : true
                                       }};
              dynamic_floor_plot_series = { color : "#03A9F4",
                                      data  : dynamic_floor_plot };
              revenue_plot_series = { color : "#000",
                                          data  : revenue_plot,
                                          lines: {
                                            fill : true
                                          }};

              plot = $.plot("#banner_bid", [high_plot_series, dynamic_floor_plot_series, avg_plot_series], {});
              plot = $.plot("#banner_revenue", [revenue_plot_series], {});

              b_optimize.updateState(curr_data_point.high_bid, curr_data_point.avg_bid);

              count += 1;
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

  function clearData() {
    v_static_revenue = 0;
    v_dynamic_revenue = 0;
    b_static_revenue = 0;
    b_dynamic_revenue = 0;
    v_data_high = [];
    v_data_avg = [];
    v_data_floor = [];
    v_data_revenue = [];
    b_data_high = [];
    b_data_avg = [];
    b_data_floor = [];
    b_data_revenue = [];
    clearTimeout(countdown)
  }

  $('#tab1').click(function (e) {
    // Toggle on
    $('#tab1').addClass('active');

    // Toggle off
    $('#tab2').removeClass('active');
    $('#tab3').removeClass('active');

    clearData();
    init("desktop");
  });

  $('#tab2').click(function (e) {
    // Toggle on
    $('#tab2').addClass('active');

    // Toggle off
    $('#tab1').removeClass('active');
    $('#tab3').removeClass('active');

    clearData();
    init("app");
  });

  $('#tab3').click(function (e) {
    // Toggle on
    $('#tab3').addClass('active');

    // Toggle off
    $('#tab2').removeClass('active');
    $('#tab1').removeClass('active');

    clearData();
    init("mobile");
  });

  init("desktop");
});
