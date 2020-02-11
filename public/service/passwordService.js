(function () {
    'use strict';
    angular.module('myApp').factory('passwordService', ['modalService', '$http', '$interval', 'dataService', '$rootScope', 'settingsSpesaService', '$strings', function (modalService, $http, $interval, dataService, $rootScope, settingsSpesaService, $strings) {
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
                    displayName: 'Nome Sito.',
                    field: 'SITE',
                    type: 'text',
                    width: 250 
                },{
                    name: 'USER',
                    displayName: 'Username.',
                    field: 'USER',
                    type: 'text',
                    width: 250 
                },{
                    name: 'PWD',
                    displayName: 'Password',
                    field: 'PWD',
                    type: 'text',
                    width: 250 
                },{
                    name: 'URL',
                    displayName: 'URL',
                    field: 'URL',
                    type: 'text',
                    width: 350 
                }, {
                    name: 'NOTE',
                    displayName: 'Note',
                    field: 'NOTE',
                    type: 'text',
                    width: '*'                    
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptions.gridApi = gridApi;       
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            loadPassword: function () {
                return $http.get($strings.REST.SERVER+'/password').then(function (resp) {
                    srvc.gridOptionsPassword.data = resp.data;
                });
            }
        };
        return srvc;
    }]);
})();
