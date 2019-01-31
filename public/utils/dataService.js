(function () {
    'use strict';
    angular.module('myApp').factory('dataService', [function () {
        var _data = {};
        var _commonData = {};
        var _filter = {};
        var srvc = {
            get data() {
                return _data;
            },
            get commonData() {
                return _commonData;
            },
            get filter() {
                return _filter;
            }
        };
        return srvc;
    }]);
})();
