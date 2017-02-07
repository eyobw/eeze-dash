'use strict';

/**
 * @ngdoc service
 * @name eezeDashApp.chartGenerator
 * @description
 * # chartGenerator
 * Factory in the eezeDashApp.
 */
angular.module('eezeDashApp')
  .factory('chartGenerator', function () {
    // Service logic
    
    return {
      lineChart: {
        options: function(){
          return {
            chart: {
              type: 'lineChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
              },
              height: 200,
              x: function(d){ return d.x; },
              y: function(d){ return d.y; },
              useInteractiveGuideline: true,

              interpolate: 'linear',
              xAxis: {
                axisLabel: ''
              },
              yAxis: {
                axisLabel: '',                
                axisLabelDistance: -10
              },
              //rotateLabels: 30,
              showXAxis: false,
              zoom: {
                enabled: true,
                scale: 1,
                scaleExtent: [1, 10],
                translate: [0,0],
                useNiceScale: true
              }
            }
          }
        }
      },
      historicalBarChart: {
        options: function(){
          return {
            chart: {
              type: 'historicalBarChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 65
              },
              x: function(d){ return d[0]; },
              y: function(d){ return d[1]/100; },
              average: function(d) { return d.mean/100; },
              color: d3.scale.category10().range(),
              transitionDuration: 300,
              useVoronoi: false,
              showValues: true,
              xAxis: {
                axisLabel: 'X Axis',                
                showMaxMin: false
              },

              yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function(d){
                  return d3.format(',d')(d);
                },
                axisLabelDistance: 0
              },
              zoom : {
                enabled : true,

              }
            }
          }
        }
      },
      multiBarChart:{
        options: function(){
          return {
            chart: {
              type: 'multiBarChart',
              margin : {
                top: 10,
                right: 20,
                bottom: 30,
                left: 55
              },
              height: 200,
              x: function(d){return d.x;},
              y: function(d){return d.y;},
              useInteractiveGuideline: true,
              text: function(d){return d.key;},
              showLabels: true,
              showValues: true,
              rotateLabels: 30,
              //showXAxis: false,
              transitionduration: 300,
              xAxis: {
                  showMaxMin: false
              },
              yAxis: {
                  axisLabel: 'Values',
                  tickFormat: function(d){
                      return d3.format(',d')(d);
                  }
              }
            },

              zoom: {
                enabled: true,
                scale: 1,
                scaleExtent: [1, 10],
                translate: [0,0],
                useNiceScale: true
              }
          }
        }
      },
      cumulativeLineChart: {
        options: function(){
          return {
            chart: {
              type: 'cumulativeLineChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 65
              },
              x: function(d){ return d[0]; },
              y: function(d){ return d[1]/100; },
              average: function(d) { return d.mean/100; },
              color: d3.scale.category10().range(),
              transitionDuration: 300,
              clipVoronoi: false,
              xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                  return d3.time.format('%m/%d/%y')(new Date(d))
                },
                showMaxMin: false
              },

              yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function(d){
                  return d3.format(',d')(d);
                },
                axisLabelDistance: 0
              }
            }
          }
        }
      },
      stackedAreaChart: {
        options: function(){
          return {
            chart: {
              type: 'stackedAreaChart',
              margin : {
                top: 20,
                right: 20,
                bottom: 20,
                left: 44
              },
              x: function(d){return d[0];},
              y: function(d){return d[1];},
              useVoronoi: false,
              clipEdge: true,
              transitionDuration: 500,
              useInteractiveGuideline: true,
              xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                  return d3.time.format('%x')(new Date(d))
                }
              },
              yAxis: {
                tickFormat: function(d){
                  return d3.format(',.2f')(d);
                }
              }
            }
          }
        }
      },
      discreteBarChart: {
        options: function(){
          return {
            chart: {
              type: 'discreteBarChart',
              margin : {
                top: 10,
                right: 20,
                bottom: 30,
                left: 55
              },
              height : 200,
              x: function(d){return d.key;},
              y: function(d){return d.value;},
              useInteractiveGuideline: true,
              showLabels: false,
              showValues: false,
              useVoronoi : false,
              clipEdge : true,
              rotateLabels: 30,
              valueFormat: function(d){
                return d3.format(',f')(d);
              },
              transitionDuration: 500,
              xAxis: {
                axisLabel: 'X Axis'
              },
              yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
              },

              zoom: {
                enabled: true,
                scale: 1,
                useNiceScale: true
              }
            }
          }
        }
      },
      pieChart: {
        options: function(){
          return {
            chart: {
              type: 'pieChart',
              margin: {
                top: 0,
                right: 0,
                bottom: 30,
                left: 0
              },
              x: function(d){return d.key;},
              y: function(d){return d.value;},
              showLabels: false,
              labelSunbeamLayout: true,
              labelsOutside: true,
              height : 200,
              transitionDuration: 500,
              labelThreshold: 0.02,
              legend: {
                margin: {
                  top: 5,
                  right: 35,
                  bottom: 0,
                  left: 0
                }
              },

              zoom: {
                enabled: true,
                scale: 1,
                scaleExtent: [1, 10],
                translate: [0,0],
                useNiceScale: true
              }
            }
          }
        }
    },

    boxPlotChart :{
      options : function(){
        return {
          chart: {
              type: 'boxPlotChart',
              height: 200,
              labelSunbeamLayout: true,
              labelsOutside: true,
              margin: {
                top: 10,
                right: 20,
                bottom: 30,
                left: 55
              },
              x: function(d){return d.label;},
              yAxis: {
                showMaxMin: true,
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
              },
              showValues: true,
              maxBoxWidth: 75
          }
        }
      }
    }

    }
   
  });
