'use strict';

/**
 * @ngdoc directive
 * @name eezeDashApp.directive:onReadFile
 * @description
 * # onReadFile
 */
angular.module('eezeDashApp')
  .directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						//Convert the text file into JSON 
						fn(scope, {$fileContent:JSON.parse(onLoadEvent.target.result)});
					});
				};

				reader.readAsBinaryString((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
    };
  });
