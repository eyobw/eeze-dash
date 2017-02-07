'use strict';

/**
 * @ngdoc overview
 * @name eezeDashApp
 * @description
 * # eezeDashApp
 *
 * Main module of the application.
 */
angular
  .module('eezeDashApp', [
    'ngRoute', 'nvd3', 'gridster'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })


  ;
