'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {

      $scope.imagen_no_encontrada = "https://d3a8mw37cqal2z.cloudfront.net/assets/91c0541cff7ec4947514edd379f0ffd1/images/no-profile-w185.jpg";
      $scope.base_imagen = "https://image.tmdb.org/t/p/w185";

        $scope.current_page = 1;
        $scope.total_pages = 0;
        $scope.total_results = 0;

      var api_key = "c2561c22dc8ad7980b5e1f2f7e78d778";
      var url_base = "http://api.themoviedb.org/3";

        var search_person = "/search/person";
        var discover_movie = "/discover/movie";
        var get_genres = "/genre/movie/list";

        $scope.getActors = function(actor) {
            return $http.get(url_base + search_person, {
                params: {
                    api_key: api_key,
                    query: actor,
                    search_type: 'ngram'
                }
            }).then(function (response) {
                    return response.data.results;
                });
        };

        $scope.getGenres = function() {
            return $http.get(url_base + get_genres, {
                params: {
                    api_key: api_key
                }
            }).success(function (response) {
                $scope.genres = response.genres;
            });
        };

        $scope.searchFilms = function() {
            var params = {api_key: api_key, sort_by: 'vote_average.desc', page: $scope.current_page,
                with_people: $scope.selectedActor.id};
            if ($scope.genre) {
                params["with_genres"] = $scope.genre.id;
            }
            $http.get(url_base + discover_movie, {
                params: params
            }).success(function (response) {
                $scope.movies = response.results;
                $scope.total_results = response.total_results;
                $scope.total_pages = response.total_pages;
            });
        };

        $scope.$watch('current_page', function(){
            if ($scope.selectedActor) {
                $scope.searchFilms();
            }
        });

      $scope.greaterThan = function(prop, val){
        return function(item){
            alert(item[prop]);
          if (val) {
            return item[prop] > val;
          }
          else {
            return true;
          }
        }
      }

        function init() {
            $scope.getGenres();
        }

        init();
}]);