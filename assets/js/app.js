'use strict';
(function(angular,window){

    angular
    .module('domotickRestApp',['ui.router','ui.bootstrap','sailsResource','ngAnimate'])
    .config([ '$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state({
                name:'home',
                url:'',
                abstract:true,
                template:'<div ui-view></div>'
            })
            .state({
                name:'home.list',
                url:'/',
                templateUrl:'templates/home.list.html',
                controller:'HomeListController',
                resolve:{
                    models:function(ModelService){
                        return ModelService.all();
                    }
                }

            });
        $urlRouterProvider.otherwise('/');
    }])
    .controller('domotickRestAppController',[ '$log',function($log){
        $log.log('domotickRestAppController');
    }])
    .controller('HomeListController',['$log', '$scope','models', function($log,$scope,models){
        $log.log('HomeListController');
        $scope.models=models.data;
    }])
    .service('ModelService',[ '$http',function($http){
       

        this.all = function(){
            return $http.get('/models');
        }
        
    }])
    .filter('titleCase', function () {
        return function (input) {
           
            if (!angular.isDefined(input)) {
                return input;
            } 
            var temp= input.toLowerCase();
            return temp.charAt(0).toUpperCase()+temp.substr(1);
        };
    })
    .run(['$log','$state',function($log,$state){
        $log.log('Domotick Admin Rest App Running..');
        //$state.go('home.list');
    }])
})(angular,window);
