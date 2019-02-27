(function () {
    'use strict';
    angular.module('myApp').factory('pivotSpesaService', ['modalService', '$http', '$interval', 'dataService', '$rootScope', 'settingsSpesaService', '$strings', function (modalService, $http, $interval, dataService, $rootScope, settingsSpesaService, $strings) {
       
        var srvc = {
            gridOptionsPivotSpesa: {
                minRowsToShow: 21,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'repr',
                    displayName: 'Repr.',
                    field: 'repr',
                    type: 'text',
                    width: 250 
                },{
                    name: 'sott',
                    displayName: 'Sott.',
                    field: 'sott',
                    type: 'text',
                    width: 250 
                },{
                    name: 'famg',
                    displayName: 'Famg.',
                    field: 'famg',
                    type: 'text',
                    width: 250 
                },{
                    name: 'ean',
                    displayName: 'EAN',
                    field: 'ean',
                    type: 'text',
                    width: 120 
                }, {
                    name: 'descr',
                    displayName: 'Desc. Referenza',
                    field: 'descr',
                    type: 'text',
                    width: '*'                    
                }, {
                    name: 'nva',
                    displayName: 'Nr Acqs.',
                    field: 'nva',
                    type: 'text',
                    width: 80
                }, {
                    name: 'mnva',
                    displayName: 'Merc Nr Acqs.',
                    field: 'mnva',
                    type: 'text',
                    width: 80
                }, {
                    name: 'pm',
                    displayName: 'Prezzo Medio',
                    field: 'pm',
                    type: 'number',
                    width: 80
                }, {
                    name: 'mpm',
                    displayName: 'Merc Prezzo Medio',
                    field: 'mpm',
                    type: 'number',
                    width: 80
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPivotSpesa.gridApi = gridApi;                    
                }
            },
            loadPivotSpesa: function () {
                return $http.get($strings.REST.SERVER+'/pivotSpesa').then(function (resp) {
                    srvc.gridOptionsPivotSpesa.data = resp.data;
                });
            }
        };
        return srvc;
    }]);
})();
