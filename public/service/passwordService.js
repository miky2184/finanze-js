(function () {
    'use strict';
    angular.module('myApp').factory('passwordService', ['modalService', '$http', '$interval', 'dataService', '$rootScope', '$strings', function (modalService, $http, $interval, dataService, $rootScope, $strings) {
        var scope = $rootScope.$new();
        var afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            dataService.data.dirty = true;
            rowEntity.dirty = true;
        };
        var srvc = {
            gridOptionsPassword: {
                minRowsToShow: 21,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'SITE',
                    displayName: 'SITO',
                    field: 'site',
                    type: 'text',
                    headerCellClass: 'text-center',
                    width: '20%'
                }, {
                    name: 'USER',
                    displayName: 'USERNAME',
                    field: 'user',
                    type: 'text',
                    headerCellClass: 'text-center',
                    width: '20%'
                }, {
                    name: 'PWD',
                    displayName: 'PASSWORD',
                    field: 'pwd',
                    type: 'text',
                    headerCellClass: 'text-center',
                    width: '20%'
                }, {
                    name: 'URL',
                    displayName: 'URL',
                    field: 'url',
                    type: 'text',
                    headerCellClass: 'text-center',
                    width: '20%'
                }, {
                    name: 'NOTE',
                    displayName: 'Note',
                    field: 'note',
                    type: 'text',
                    headerCellClass: 'text-center',
                    width: '20%'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPassword.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            loadPassword: function () {
                return $http.get($strings.REST.SERVER + '/password').then(function (resp) {
                    srvc.gridOptionsPassword.data = resp.data;
                });
            }
        };
        return srvc;
    }]);
})();