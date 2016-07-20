/* global _: false */
'use strict';

/**
 * @ngdoc function
 * @name wrWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wrWebApp
 */
angular.module('wrWebApp')
  .controller('MainCtrl', ['$scope', '$filter', 'model', function ($scope, $filter, model) {

    $scope.rankings = [];
    $scope.games = [];
    $scope.autocomplete = [];
    $scope.tags = [];
    $scope.page = {
      size: 5,
      index: 1
    };
    var isTeamIncludedArr = [];
    var isEventIncludedArr = [];

    model.load().then(function(){
      $scope.rankings = model.rankings.get();
      $scope.games = model.games.get();
      $scope.autocomplete = model.autocomplete.get();
    });

    $scope.loadTags = function(query) {
      return $scope.autocomplete.filter(function(auto) {
        var name = auto._autocompleteName;
        if (_.isArray(name)) { name = name[0]; }
        return name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    };

    $scope.$watchCollection('tags', function(){
      isTeamIncludedArr = [];
      isEventIncludedArr = [];
      angular.forEach($scope.tags, function(tag){
        if (tag.team) {
          isTeamIncludedArr.push(tag.team.id);
        } else if (tag.id) {
          isEventIncludedArr.push(tag.id);
        }
      });
    });

    $scope.isIncluded = function(game){
      if ($scope.tags.length === 0) { return true; }
      var isTeamIncluded = false;
      var isEventIncluded = false;
      angular.forEach(game.events, function(event){
        if (_.contains(isEventIncludedArr, event.id)) {
          isEventIncluded = true;
        }
      });
      angular.forEach(game.teams, function(team){
        if (_.contains(isTeamIncludedArr, team.id)) {
          isTeamIncluded = true;
        }
      });
      return isTeamIncluded || isEventIncluded;
    };

    $scope.selectOutcome = function(game, outcome) {
      if ($scope.isOutcomeSelected(game, outcome)) {
        model.games.outcomes.remove(game);
      } else {
        model.games.outcomes.add(game, outcome);
      }
    };

    $scope.isOutcomeSelected = function(game, outcome) {
      return model.games.outcomes.has(game, outcome);
    };

    $scope.getOutcomeDiff = function(game, outcome) {
      if (game && outcome) {
        return model.games.outcomes.calculate(game, outcome);
      }
    };

    $scope.resetOutcomes = function() {
      return model.games.outcomes.clear();
    };


  }]);
