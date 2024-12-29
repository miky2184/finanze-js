(function () {
    'use strict';
    angular.module('myApp').factory('loggingService', ['$strings',  function ($strings) {
                
        const loggingService = {};

        loggingService.logWithTimestamp = function logWithTimestamp(message) {
                console.log(`[${new Date().toISOString()}] ${message}`);
        }

        return loggingService;        
    }]);
})();
