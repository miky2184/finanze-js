(function () {
    'use strict';
    angular.module('myApp').factory('predmatchService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', '$strings', function (modalService, $http, $interval, $rootScope, utilService, dataService, $strings) {
        var scope = $rootScope.$new();

        var srvc = {
            gridOptionsPredMatch: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 22,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,                
                columnDefs: [
                    {
                    name: 'DATA_GAME',
                    displayName: 'DATA',
                    field: 'DATA_GAME',
                    width: 35,
                    pinnedLeft: true
                }, {
                    name: 'GIORNATA',
                    displayName: 'GIORNATA',
                    field: 'GIORNATA',
                    width: 120,
                    pinnedLeft: true
                }, {
                    name: 'CHAMPIONSHIP',
                    displayName: 'DIV',
                    field: 'CHAMPIONSHIP',
                    width: 35
                }, {
                    name: 'HOME',
                    displayName: 'HOME',
                    field: 'HOME',
                    width: 35
                }, {
                    name: 'AWAY',
                    displayName: 'AWAY',
                    field: 'AWAY',
                    width: 35
                }, {
                    name: 'PERC_1',
                    displayName: '%1',
                    field: 'PERC_1',
                    width: 35
                }, {
                    name: 'PERC_X',
                    displayName: '%X',
                    field: 'PERC_X',
                    width: 35
                }, {
                    name: 'PERC_2',
                    displayName: '%2',
                    field: 'PERC_2',
                    width: 35
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPredMatch.gridApi = gridApi;
                    srvc.gridOptionsPredMatch.gridApi.core.handleWindowResize();
                }
            },
            loadPredMatch: function (season) {
                var dto = {
                    season: season.value.id
                };
                return $http.post($strings.REST.SERVER + '/predmatch', dto).then(function (resp) {
                    srvc.gridOptionsPredMatch.data = resp.data;
                });
            }
        };

        return srvc;
    }]);
})();
