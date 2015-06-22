'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

      var api_key = "c2561c22dc8ad7980b5e1f2f7e78d778";
      var url_base = "http://api.themoviedb.org/3";
      var search_movie = "/search/movie";
      var discover_movie = "/discover/movie";

      $scope.getMovies = function(movie) {
        return $http.get(url_base + search_movie, {
          params: {
            api_key: api_key,
            query: movie,
            search_type: 'ngram'
          }
        }).then(function (response) {
          return response.data.results;
        });
      };

        $http.get(url_base + discover_movie, {
            params: {
                api_key: api_key,
                'vote_average.lte': 2
            }
        }).success(function (response) {
            $scope.total_pages = response.total_pages;
        });

      $scope.russianRoulette = function() {
          var page = Math.floor((Math.random() * $scope.total_pages) + 1) % 1000;
        $http.get(url_base + discover_movie, {
          params: {
            api_key: api_key,
            'vote_average.lte': 2,
              page: page
          }
        }).success(function (response) {
            slides = $scope.slides = [];
            var filmNumber = Math.floor((Math.random() * 20) + 1);
            $scope.bulletFilm = response.results[filmNumber];

            $scope.addSlide($scope.selectedFilm1);
            $scope.addSlide($scope.selectedFilm2);
            $scope.addSlide($scope.selectedFilm3);
            $scope.addSlide($scope.selectedFilm4);
            $scope.addSlide($scope.bulletFilm);

            $scope.myInterval = 100;
            $timeout(function(){
                $scope.myInterval = 0;
                $scope.chosenFilm = $scope.getActiveSlide().value;

                if ($scope.chosenFilm.id == $scope.bulletFilm.id) {
                    $scope.dealWithIt = true;
                }
            }, 10000);
        });
      };

        $scope.myInterval = 0;
        var slides = $scope.slides = [];

        $scope.addSlide = function(element) {
            var newWidth = 600 + slides.length + 1;
            if (element.poster_path != null) {
                slides.push({
                    image: 'https://image.tmdb.org/t/p/w185' + element.poster_path + newWidth + '/300',
                    value: element
                });
            } else {
                slides.push({
                    image: 'https://d3a8mw37cqal2z.cloudfront.net/assets/f996aa2014d2ffddfda8463c479898a3/images/no-poster-w185.jpg',
                    value: element
                });
            }
        };

        $scope.getActiveSlide = function () {
            return slides.filter(function (s) { return s.active; })[0];
        };
}]);