/* global _: false */
'use strict';

/**
 * @ngdoc service
 * @name wrWebApp.model
 * @description
 * # model
 * Factory in the wrWebApp.
 */
angular.module('wrWebApp')
  .factory('model', ['$http', '$q', '$filter', function ($http, $q, $filter) {
    // Service logic
    // ...

    var original = [];
    var rankings = [];
    var autocomplete = [];
    var games = [];
    var outcomes = {};

    var getEntryByPos = function(p) {
			return _.where(rankings, {pos: p})[0];
		};

		var getEntryById = function(id) {
      return _.filter(rankings, function(entry){ return entry.team.id === id; })[0];
		};

    function getEndDate() {
      var d = getStartDate();
      var diff = d.getDate() + (7 * 52);
      return new Date(d.setDate(diff));
    }

    function getStartDate() {
      var d = new Date();
      var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1);
      return new Date(d.setDate(diff));
    }

    function getDiff(score1, score2, gap, weight) {
			var diff = func(score1, score2)(gap);
			if (Math.abs(score1 - score2) > 15) {
        diff *= 1.5;
      }
			diff *= weight;
			return diff;
		}

		function func(score1, score2) {
			if (score1 > score2) {
				return win;
			} else if (score1 < score2) {
				return loose;
			} else{
				return draw;
      }
		}

		function draw(x) {
			return fixDecimal((x>-10) ? ((x<10) ? x/10 : 1) : -1);
		}
		function loose(x) {
			return fixDecimal(draw(x) + 1);
		}
		function win(x) {
			return fixDecimal(draw(x) - 1);
		}
		function fixDecimal(num){
			return Math.round(num * 100) / 100;
		}

    var getOutcomeDiff = function(game, outcome) {
      var team1 = getEntryById(game.teams[0].id);
      var team2 = getEntryById(game.teams[1].id);
      if (team1 && team2) {
        var weight = _.max(game.events, function(event){
          return event.rankingsWeight;
        }).rankingsWeight || 0;

        var gap = fixDecimal((team1.pts + 3) - team2.pts);
        return getDiff(outcome.team1, outcome.team2, gap, weight);
      }
    };

    function buildOutcome(score1, score2) {
      return {
        team1: score1,
        team2: score2
      };
    }

    function applyOutcomeDiff(game) {
      angular.forEach(game._outcomes, function(outcome){
        outcome.diff = getOutcomeDiff(game, outcome);
      });
    }

    function fixGames(games) {
      _.map(games, function(game){
				var date = new Date(game.time.millis);
				date.setHours(date.getHours() + game.time.gmtOffset);
				game.time.millis = date.getTime();
				game.time.day = $filter('date')(game.time.millis, 'yyyy-MM-dd');

        var team1 = getEntryById(game.teams[0].id);
        var team2 = getEntryById(game.teams[1].id);
        var maxWeight = _.max(game.events, function(event){
          return event.rankingsWeight;
        }).rankingsWeight || 0;

        if (team1 && team2 && maxWeight > 0) {
          game._outcomes = [
            buildOutcome(20, 0),
            buildOutcome(5,  0),
            buildOutcome(0,  0),
            buildOutcome(0,  5),
            buildOutcome(0, 20)
          ];
          applyOutcomeDiff(game);
        }
      });
      return games;
    }

    var loadGames = function(page) {
      var sDate = $filter('date')(getStartDate(), 'yyyy-MM-dd');
      var eDate = $filter('date')(getEndDate(), 'yyyy-MM-dd');
      return $http.get('https://cmsapi.pulselive.com/rugby/match?' +
        'sports=mru' +
        '&page=' + page +
        '&startDate=' + sDate +
        '&endDate=' + eDate +
        '&pageSize=200').then(function(response){
          if (response && response.data) {
            games = games.concat(fixGames(response.data.content));
            if (response.data.pageInfo && (response.data.pageInfo.numPages > page + 1)) {
              return loadGames(page + 1);
            }
          }
          return games;
        });
    };

    var load = function() {
      var thisYear = $filter('date')(new Date(), 'yyyy-MM-dd');
      return $q.all([
        $http.get('https://cmsapi.pulselive.com/rugby/rankings/mru'),
        $http.get('https://cmsapi.pulselive.com/rugby/event?startDate=' + thisYear + '&pageSize=200'),
      ]).then(function(responses){
        original = responses[0].data.entries;
        rankings = angular.copy(original);

        angular.forEach(rankings, function(entry) {
          entry._originalPts = entry.pts;
          var val = angular.copy(entry);
          val._autocompleteName = entry.team.name;
          autocomplete.push(val);
        });

        angular.forEach(responses[1].data.content, function(value) {
          if (value.sport === 'mru') {
            var val = angular.copy(value);
            val._autocompleteName = value.label;
            autocomplete.push(val);
          }
        });

        return loadGames(0);
      });
    };

    var applyOutcomes = function() {
      _.map(rankings, function(entry) {
        entry.pts = entry._originalPts;
      });
      angular.forEach(games, function(game){
        applyOutcomeDiff(game);
        var outcome = outcomes[game.matchId];
        if (outcome) {
          var team1 = getEntryById(game.teams[0].id);
          var team2 = getEntryById(game.teams[1].id);

          team1.pts -= outcome.diff;
          team2.pts += outcome.diff;
        }
      });
    };

    var addOutcome = function(game, outcome) {
      outcomes[game.matchId] = outcome;
      applyOutcomes();
    };

    var removeOutcome = function(game) {
      delete outcomes[game.matchId];
      applyOutcomes();
    };

    var hasOutcome = function(game, outcome) {
      return outcomes[game.matchId] === outcome;
    };

    var clearOutcomes = function() {
      outcomes = {};
      applyOutcomes();
    };

    // Public API here
    return {
      load: load,
      autocomplete: {
        get: function() {
          return autocomplete;
        }
      },
      rankings: {
        get: function() {
          return rankings;
        },
        id: getEntryById,
        pos: getEntryByPos
      },
      games: {
        get: function() {
          return games;
        },
        outcomes: {
          add: addOutcome,
          remove: removeOutcome,
          has: hasOutcome,
          calculate: getOutcomeDiff,
          clear: clearOutcomes
        }
      }
    };
  }]);
