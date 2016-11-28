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

            })
            .state({
                name:'home.detail',
                url:'/detail',
                templateUrl:'templates/home.detail.html',
                controller:['$scope',function($scope){

                }]
            })
            ;
        $urlRouterProvider.otherwise('/');
    }])
    .controller('domotickRestAppController',[ '$log',function($log){
        $log.log('domotickRestAppController');
    }])
    .controller('HomeListController',['$log', '$scope','models', function($log,$scope,models){
        $log.log('HomeListController');
        $scope.models=models.data;
        
        $scope.slideToggle=false;
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
    .animation('.slide-toggle', ['$animateCss', function($animateCss) {
        var lastId = 0;
        var _cache = {};

        function getId(el) {
        var id = el[0].getAttribute("data-slide-toggle");
        if (!id) {
            id = ++lastId;
            el[0].setAttribute("data-slide-toggle", id);
        }
        return id;
        }

        function getState(id) {
        var state = _cache[id];
        if (!state) {
            state = {};
            _cache[id] = state;
        }
        return state;
        }

        function generateRunner(closing, state, animator, element, doneFn) {
        return function() {
            state.animating = true;
            state.animator = animator;
            state.doneFn = doneFn;
            animator.start().finally(function() {
            if (closing && state.doneFn === doneFn) {
                element[0].style.height = '';
            }
            state.animating = false;
            state.animator = undefined;
            state.doneFn();
            });
        }
        }

        return {
        addClass: function(element, className, doneFn) {
            if (className == 'ng-hide') {
            var state = getState(getId(element));
            var height = (state.animating && state.height) ?
                state.height : element[0].offsetHeight;

            var animator = $animateCss(element, {
                from: {
                height: height + 'px',
                opacity: 1
                },
                to: {
                height: '0px',
                opacity: 0
                }
            });
            if (animator) {
                if (state.animating) {
                state.doneFn =
                    generateRunner(true,
                    state,
                    animator,
                    element,
                    doneFn);
                return state.animator.end();
                } else {
                state.height = height;
                return generateRunner(true,
                    state,
                    animator,
                    element,
                    doneFn)();
                }
            }
            }
            doneFn();
        },
        removeClass: function(element, className, doneFn) {
            if (className == 'ng-hide') {
            var state = getState(getId(element));
            var height = (state.animating && state.height) ?
                state.height : element[0].offsetHeight;

            var animator = $animateCss(element, {
                from: {
                height: '0px',
                opacity: 0
                },
                to: {
                height: height + 'px',
                opacity: 1
                }
            });

            if (animator) {
                if (state.animating) {
                state.doneFn = generateRunner(false,
                    state,
                    animator,
                    element,
                    doneFn);
                return state.animator.end();
                } else {
                state.height = height;
                return generateRunner(false,
                    state,
                    animator,
                    element,
                    doneFn)();
                }
            }
            }
            doneFn();
        }
        };
    }])
    .run(['$log','$state',function($log,$state){
        $log.log('Domotick Admin Rest App Running..');
        //$state.go('home.list');
    }])
})(angular,window);
