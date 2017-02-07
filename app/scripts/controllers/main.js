'use strict';

/**
 * @ngdoc function
 * @name eezeDashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eezeDashApp
 */
angular.module('eezeDashApp')
  .controller('MainCtrl', function ($scope, chartGenerator, $timeout, $window) {
    

    //initiate Dashboard, checkbox and data set length
    $scope.checkBox = {};
    $scope.dashboard = {widgets : []};

    if($window.sessionStorage.getItem('dashboard')){
    	
    	var dashboard = JSON.parse($window.sessionStorage.getItem('dashboard'));
    	for(var i in dashboard.widgets){
    		//Due to "Unexpected NaN parssing ..." issue, I am forced to re-write 
    		//the code for each chart.
    		if(dashboard.widgets[i].type == 'disrceteBarChart'){
    			$scope.dashboard.widgets.push({
    		    			name: dashboard.widgets[i].name,
    				  		type: 'disrceteBarChart',
    				  		sizeX: 2,
    				  		sizeY: 2,
    			      		chart: {
    			      			options: chartGenerator.discreteBarChart.options(),
    			        		data: dashboard.widgets[i].chart.data,
    			        		api: {}
    			      	}
    		    		});
    		}else if(dashboard.widgets[i].type == 'pieChart'){
    			$scope.dashboard.widgets.push({
    		    			name: dashboard.widgets[i].name,
    				  		type: 'pieChart',
    			      		chart: {
    			      			options: chartGenerator.pieChart.options(),
    			        		data: dashboard.widgets[i].chart.data,
    			        		api: {}
    			      	}
    		    		});

    		}else if(dashboard.widgets[i].type == 'multiBarChart'){
    			$scope.dashboard.widgets.push({
    		    			name: dashboard.widgets[i].name,
    				  		type: 'multiBarChart',
    			      		chart: {
    			      			options: chartGenerator.multiBarChart.options(),
    			        		data: dashboard.widgets[i].chart.data,
    			        		api: {}
    			      	}
    		    		});
    		}else if(dashboard.widgets[i].type == 'lineChart'){
    			$scope.dashboard.widgets.push({
    		    			name: dashboard.widgets[i].name,
    				  		type: 'lineChart',
    			      		chart: {
    			      			options: chartGenerator.lineChart.options(),
    			        		data: dashboard.widgets[i].chart.data,
    			        		api: {}
    			      	}
    		    		});
    		}else if(dashboard.widgets[i].type == 'boxPlotChart'){
    			$scope.dashboard.widgets.push({
    		    			name: dashboard.widgets[i].name,
    				  		type: 'boxPlotChart',
    			      		chart: {
    			      			options: chartGenerator.boxPlotChart.options(),
    			        		data: dashboard.widgets[i].chart.data,
    			        		api: {}
    			      	}
    		    		});
    		}
    	}
    }
    

	
	$scope.dataset_length = 0;
	var item_names;

	if($window.sessionStorage.getItem('columns')){
		item_names = JSON.parse($window.sessionStorage.getItem('columns'));
		$scope.columns = JSON.parse($window.sessionStorage.getItem('columns'));
	}



	//Show JSON content
  $scope.showContent = function($fileContent){

  		$window.sessionStorage.setItem('data', JSON.stringify($fileContent));

  	 	//Load the uploaded data
		$scope.data =  JSON.parse($window.sessionStorage.getItem('data')); //$fileContent;


		//Number of datasets in the array
		$scope.dataset_length = Math.floor($scope.data.length/2);

		//Maximum range input to be the length of the dataset
		$scope.max = $scope.data.length

		//Let's take the first row of the data as a sample
		//to get the keys and value types.
		var sample = $scope.data[0];		


		$scope.filter = {};

		$scope.linechart_row = {};
		$scope.boxplot_row = {};

		
		/*Find the columns name from the first row*/
		if(!$window.sessionStorage.getItem('columns')){
			$window.sessionStorage.setItem('columns', JSON.stringify(_.allKeys(sample)));
		}

		item_names = JSON.parse($window.sessionStorage.getItem('columns'));
		$scope.columns = JSON.parse($window.sessionStorage.getItem('columns'));


		//Total number of items in a single set of object
		var item_counter = $scope.columns.length; 
		$scope.number_items = [];

		//Sort out the property of all items. For now, it only sorts out, numeric 
		//and non-numeric items
		do {
			//item from item names list to check their property.
			var item = item_names[item_counter-1];
			switch(typeof(sample[item])){
				case ('number') :
				//Number rturns Max, Min should be calculated
				if (item == 'id'){
					//#TODO this needs a RegExp to remove all IDs 
					//from the list. After all, no reason to plot an ID.
				}else{
					$scope.number_items.push(item);
				}				
				break;
				case ('boolean') :
				//#TODO Compares the rest fields for true and false
				
				break;

				default:
				
			}
		}while(--item_counter > 0);


		/*Sort out columns for frequency bar chart and pie chart, for now only
		items with 12 and less unique values would be analyzed, and for line chart 
		checkbox 7 unique values. 
		*/
		$scope.bar_pie_checkbox = [];
		$scope.line_checkbox = []; 
		$scope.line_chart_x_value_list = [];
		
		for (var i in item_names){
			var item_name = item_names[i], 
			item_values = _.pluck($scope.data, item_name),
			unique_values = (_.uniq(item_values));
			
			//for frequency bar and pie chart
			if (unique_values.length >1 && unique_values.length <= 30){
				$scope.bar_pie_checkbox.push(item_names[i]);
			}

			if(unique_values.length <= 12 && unique_values.length >= 4 || 
				unique_values.length == item_values.length){
				$scope.line_chart_x_value_list.push(item_names[i]);
			}

			//for line chart to filter data with certain properties
			//that have less than 3 unique values
			if (unique_values.length >1 && unique_values.length <= 3){
				$scope.line_checkbox[item_name] = [];
				for(var j in unique_values ){
					$scope.line_checkbox.push([item_name, unique_values[j]]);
				}
			}			
		}

		//Initiate x and y values for multi bar chart
		//e.g. To compare female(let's say (x)) and male(y) income (value)
		$scope.compare_x = true;
		$scope.compare_y = false;
		$scope.y_values = [];

		/*This function removes the selected checkbox 
		value and returns the rest for comparison so that one item not 
		to be selected twice*/
		$scope.checked_x = function(selected_item){
			$scope.x_value = selected_item;
			$scope.compare_x = false;
			$scope.compare_y = true;
			for(i in $scope.bar_pie_checkbox){
				if($scope.bar_pie_checkbox[i] != selected_item)
					$scope.y_values.push($scope.bar_pie_checkbox[i]);
			}

		};

		//Assigns y value from the second checkbox selection
		$scope.checked_y = function(selected_item){
			$scope.y_value = selected_item;
		};

		$scope.checked_numeric_item = function(selected_item){
			$scope.numeric_item = selected_item;
		};


		//multibar chart data nester
		var nestMultiBarGraphData = function(){		

			var multi_data = _.map($scope.data, function(result){
				//Pick only the selected data set from the checkbox
				if(!$scope.numeric_item){  //If numerical item is not selected from multibar chart form
					return _.pick(result, $scope.x_value, $scope.y_value);
				}else{
					return _.pick(result, $scope.x_value, $scope.y_value, $scope.numeric_item);
				}
			});
			
			var graph_data = [];
			//Find all values that are in in the selected x and y items
			var x_fields = _.uniq(_.pluck(multi_data, $scope.x_value));			
			var y_fields = _.uniq(_.pluck(multi_data, $scope.y_value));
			

			var filter = function(x, y){
				var filter_format = {};
				filter_format[$scope.x_value] = x;
				filter_format[$scope.y_value] = y;

				/*If numeric item is selcted it will return the sum/total of
				last selected numeric item in the checkbox, otherwise 
				it will return the frequency of the selected item*/
				if($scope.numeric_item){
					var filtered_data = _.where(multi_data, filter_format);
					var numeric_array = _.pluck(filtered_data, $scope.numeric_item);
					return _.reduce(numeric_array, function(memo, num){ return memo + num; }, 0);
				}
				else{
					return _.where(multi_data, filter_format).length;
				}
			};

			for (i in x_fields){
				var fields = [];
				for(j in y_fields){
					fields.push({
						y: filter(x_fields[i], y_fields[j]),
						x: y_fields[j]
					});					
				}
				graph_data.push({
					values: fields,
					key: x_fields[i]
				});
			}
			return graph_data; 			
		};

		//Multi bar chart 
		$scope.drawMultiBarGraph = function(){
			$scope.dashboard.widgets.push({
			name: $scope.x_value +" vs "+ $scope.y_value,
		  	type: 'multiBarChart',
	      	chart: {
	      		options: chartGenerator.multiBarChart.options(),
	        	data: nestMultiBarGraphData(),
	        	api: {}
	      	}
			});
			//save to local storage
			$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));

			//Reset x, y, and numeric values after drawing the graph
			$scope.y_value, $scope.x_value, $scope.numeric_item = null;
			$scope.compare_x = true;
			$scope.compare_y = false;
			$scope.y_values = [];
		};


		//#TODO Function to calculate numerical values property
		//e.g. Min, Max, Mean
		var getMinMaxMean = function(numerical_array){
			var min_value = _.min(numerical_array);
			var max_value = _.max(numerical_array);
		};

		//Data length for line chart
		$scope.rangeChange = function(value){
			$scope.dataset_length = value;
		};

		$scope.drawLineGraph = function(){
			//console.log(lineChartDataGenerator(data));
			for(var i in $scope.filter){
				//convert numerical input to integer
				if(typeof(sample[i]) == 'number'){
					$scope.filter[i] = parseInt($scope.filter[i]);
				}
				
			}
			$scope.line_chart_data = _.where($scope.data, $scope.filter);
			//If line chart data length is greater than range reduce it 
			//so that it becomes equal with the range.
			if($scope.line_chart_data.length > $scope.dataset_length){				
				$scope.line_chart_data = _.first($scope.line_chart_data, $scope.dataset_length);
				
			}

			$scope.dashboard.widgets.push({
			name: "Line Chart",
		  	type: 'lineChart',
	      	chart: {
	        	options: chartGenerator.lineChart.options(),
	        	data: lineChartDataGenerator(),
	        	api: {}
	      	}
			});
			//save to local storage
			$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
		};

		//Analyze each column for frequency bar/pie chart
		var findRow = function(column){
			//returns the given column's nested value with its frequency 
			return d3.nest()
               .key(function (d){return d[column]})
               .entries($scope.data)
               .map(function (d){
               return  {
                     key   : d.key,
                     value : d.values.length
                };
      		});
		};

		//Wrap the data for bar chart
		var wrap_data = function(data){
			return [{ 
				values : data
			}];	
		};

		$scope.drawLineChart = function(filter){
			$scope.filtered_data = _.where($scope.data, filter);
		};


		//Checked x value for line chart, NOTE: only the last selection is saved
		$scope.checked_line_chart_x = function(selected_item){
			$scope.linechart_x_value = selected_item;
		};

		var lineChartData = function(){
			var sample_data = _.first($scope.data, $scope.dataset_length);
		};


		var lineChartDataGenerator = function(){

			//data variable initialized for line chart & number of samples to be drown
			var line_chart_data = {},  data = {}, sorted_data=[] ;

			for(var i in $scope.number_items){
				data[$scope.number_items[i]] = [];
			}
			

			/*pick only n amount of data as given in the argument. We do not
			//have to analyze the whole set of data, considering there might be 	
			var selected_data = _.first(filtered_data, $scope.dataset_length);
			
			//Sort out data that has numeric values 
			if($scope.number_items.length > 0){
				line_chart_data = _.map(selected_data, function(result){
					return _.pick(result, $scope.number_items);
				});				
			}*/
			
			
			//map data if it is selected in the checkbox
			for(var i in $scope.number_items){
				if($scope.linechart_row[$scope.number_items[i]])	{
						data[$scope.number_items[i]] = $scope.line_chart_data.map(function(j, k){
										return {x: j[$scope.linechart_x_value], y: j[$scope.number_items[i]]};
									});
				

					sorted_data.push({
						values: data[$scope.number_items[i]],
	                    key: $scope.number_items[i]
					})				
				}
			}
			return sorted_data;
		};

		//Creates Pie chart and Bar graph when checkbox is checked
	$scope.checked = function(column){
		//If checkbox checked create a graph
		if($scope.checkBox[column]){
			var item_values = _.pluck($scope.data, column),
			unique_values = (_.uniq(item_values));
		if(unique_values.length > 4){
			$scope.dashboard.widgets.push({
				  name: "Bar Chart for "+ column,
			      type: 'disrceteBarChart',
			      chart: {
			        options: chartGenerator.discreteBarChart.options(),
			        data: wrap_data(findRow(column)),
			        api: {}
			      }
			    });
			//save to local storage
			$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
		}else
	    {
	    	$scope.dashboard.widgets.push({
	    		  name: "Pie Chart for "+ column,
	    		  type: 'pieChart',
	    	      chart: {
	    	        options: chartGenerator.pieChart.options(),
	    	        data: findRow(column),
	    	        api: {}
	    	      }
	    	    });
	    	//save to local storage
	    	$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
	    };
			}else{
				//TODO I was hoping to remove the chart when 
				//the user unchecks the checkbox, but it is not working.
				/*$scope.dashboard.widgets.splice($scope.dashboard.widgets.name("Bar Chart for "+ column), 1);
				$scope.dashboard.widgets.splice($scope.dashboard.widgets.name("Pie Chart for "+ column), 1);*/
				//console.log($scope.dashboard.widgets);
			}
		};

		//To remove a chart from dashboard
		$scope.remove = function(widget) {
		    $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		    //save to local storage
	    	$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
		};

		var getQuartiles = function(list, name){
			var quartiles = {};
			if((list.length%4) === 0){
				//Quartiles 				
				quartiles['Q1'] = (list[list.length/4] + list[(list.length/4)  + 1])/2;
				quartiles['Q2'] = (list[list.length/2] + list[(list.length/2)  + 1])/2;
				quartiles['Q3'] = (list[(list.length)*3/4] + list[((list.length)*3/4)  + 1])/2;	
				
			}else{
				//Quartiles
				if((list.length%2) === 0){
					quartiles['Q2'] = (list[list.length/2] + list[(list.length/2)  + 1])/2;
				}else{
					quartiles['Q2'] = (list[Math.floor(list.length/2)  + 1]);
				} 				
				quartiles['Q1'] = (list[Math.floor(list.length/4)  + 1]);
				quartiles['Q3'] = (list[Math.floor((list.length)*3/4)  + 1]);

			}

			//IQR interquartile range Q3-Q1
			var IQR = quartiles.Q3 - quartiles.Q1 ;

			//whisker low Q1-1.5(IQR) and Whisker high Q3+1.5(IQR)
			quartiles['whisker_low'] = quartiles.Q1 - 3*IQR/2;
			quartiles['whisker_high'] = quartiles.Q1 + 3*IQR/2;

			quartiles['outliers'] = [];
				for (var i in list){
					if(list[i] < quartiles['whisker_low'] || 
						list[i] > quartiles['whisker_high']){
						quartiles.outliers.push(list[i]);
					}
				}

			return {label: name, values: quartiles}

		};

		$scope.drawBoxPlot = function(){
			//Save all Box plot data 
			var chart_data = [];

			//map data if it is selected in the checkbox
			for(var i in $scope.number_items){
				if($scope.boxplot_row[$scope.number_items[i]])	{
					//
					var boxplot_data =  _.pluck($scope.data, $scope.number_items[i]);

					//Sort array 
					var sorted_data = _.sortBy(boxplot_data, function(num){
						return num;
					});

					chart_data.push(getQuartiles(sorted_data, $scope.number_items[i]));
					
				}
			}

			$scope.dashboard.widgets.push({
	    		  name: "Box Plot",
	    		  type: 'boxPlotChart',
	    	      chart: {
	    	        options: chartGenerator.boxPlotChart.options(),
	    	        data: chart_data,
	    	        api: {}
	    	      }
	    	    });
	    	//save to local storage
	    	$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
		};

		/*This is not working, it suppose to reset the table when a new file is uploaded
		I will work on it*/ 
		$scope.resetTable = function(){
			$scope.columns = null;  
			$scope.data = {};
		};


  }; //End of Show Content


  if($window.sessionStorage.getItem('data')){
		var data = JSON.parse($window.sessionStorage.getItem('data'));
		$scope.showContent(data);
	}

  //Save dashboard
  $scope.saveDash = function(){
  	$window.sessionStorage.setItem('dashboard', JSON.stringify($scope.dashboard));
  	/*for(var i in $scope.dashboard.widgets){
  		console.log($scope.dashboard.widgets[i].chart.data);
  	}
  	console.log($window.sessionStorage.getItem('dashboard'));*/
  };

//Clear Dashboard
$scope.clearDash = function(){
	$window.sessionStorage.clear();
	location.reload();
};

  //Gridster options, grids for drawing charts
	$scope.gridsterOptions = {
	        margins: [-25, 10],
	        columns: 4,
	        //mobileBreakPoint: 1000,
	        mobileModeEnabled: false,
	        draggable: {
	          handle: 'h3'
	        },
	        resizable: {
	          enabled: true,
	          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

	          // optional callback fired when resize is started
	          start: function(event, $element, widget) {
	          	widget.chart.api.refresh();
	          },

	          // optional callback fired when item is resized,
	          resize: function(event, $element, widget) {
	            if (widget.chart.api) widget.chart.api.update();	            
	          },
	          defaultSizeX: 2,
	          defaultSizeY: 2,

	          // optional callback fired when item is finished resizing
	          stop: function(event, $element, widget) {
	            $timeout(function(){
	              if (widget.chart.api) widget.chart.api.update();
	            },400)
	          }
	        }
	};

$scope.events = {
    resize: function(e, scope){
      $timeout(function(){
        scope.api.update()
      },200)
    }
  };

  angular.element(window).on('resize', function(e){
    window.dispatchEvent(new Event('resize'));
  });

 // We want to hide the charts until the grid will be created and all widths and heights will be defined.
  // So that use `visible` property in config attribute
  $scope.config = {
    visible: false
  };
  $timeout(function(){
    $scope.config.visible = true;
  }, 200);

  });
