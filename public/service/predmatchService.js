(function () {
    'use strict';
    angular.module('myApp').factory('predmatchService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', '$strings', function (modalService, $http, $interval, $rootScope, utilService, dataService, $strings) {
        var scope = $rootScope.$new();
        
        var srvc = {
          loadPredMatch: angular.noop
        };
        
return srvc;
    }]);
})();        