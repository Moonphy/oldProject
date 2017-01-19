(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/scripts/demo.coffee":[function(require,module,exports){
angular.module('app.controllers', []).controller('FilterController', [
  '$scope', '$http', function($scope, $http) {
    $http.get('pages.json').success(function(data) {
      return $scope.files = data;
    });
    $scope.keyword = '';
    return $scope.tags = [
      {
        label: "首页"
      }
    ];
  }
]);

angular.module('app.directives', []).directive('filters', [
  function() {
    return {
      restrict: 'A',
      replace: true,
      controller: [
        '$scope', function($scope) {
          return {
            input: function(text) {
              return $scope.keyword = text;
            },
            clear: function() {
              return $scope.keyword = '';
            }
          };
        }
      ]
    };
  }
]).directive('tag', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        label: '='
      },
      require: '^?filters',
      template: '<span class="success label" ng-click="insert()" ng-model="label">{{label}}</span>',
      link: function(scope, element, attrs, filtersController) {
        return scope.insert = function() {
          return filtersController.input(element[0].textContent || element[0].innerText);
        };
      }
    };
  }
]).directive('eraseInput', [
  function() {
    return {
      restrict: 'A',
      require: '^?filters',
      link: function(scope, element, attrs, filtersController) {
        return scope.clear = function() {
          return filtersController.clear();
        };
      }
    };
  }
]).directive('toggleEraser', [
  function() {
    return {
      restrict: 'A',
      controller: [
        '$scope', '$element', function($scope, $element) {
          var getKeyword;
          $scope.showEraser = false;
          getKeyword = function() {
            return $scope.keyword;
          };
          return $scope.$watch(getKeyword, function() {
            if (getKeyword()) {
              return $scope.showEraser = true;
            } else {
              return $scope.showEraser = false;
            }
          });
        }
      ]
    };
  }
]);

angular.module('app', ['app.controllers', 'app.directives']);



},{}]},{},["./src/scripts/demo.coffee"]);
