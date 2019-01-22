(function () {
    'use strict';
    angular.module('myApp').factory('spesaService', ['modalService', '$http', '$interval', '$rootScope', function (modalService, $http, $interval, $rootScope) {
        var scope = $rootScope.$new();
        var srvc = {
            gridOptionsSpesa: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 21,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    field: 'data',
                    width: 90,
                    type: 'date',
                    cellFilter: 'date:\'yyyy-MM-dd\''
                }, {
                    name: 'REPR_CD',
                    displayName: 'Reparto',
                    field: 'REPR_CD',
                    width: 100,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html'
                }, {
                    name: 'SOTT_CD',
                    displayName: 'Sottoreparto',
                    field: 'SOTT_CD',
                    width: 150,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html'
                }, {
                    name: 'FAMG_CD',
                    displayName: 'Famiglia',
                    field: 'FAMG_CD',
                    width: 200,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html'
                }, {
                    name: 'EAN',
                    displayName: 'EAN',
                    field: 'EAN',
                    width: 200,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html'
                }, {
                    name: 'REFR_DE',
                    displayName: 'Descrizione Referenza',
                    field: 'REFR_DE',
                    width: 160,
                    editableCellTemplate: 'templates/rows/uiSelect.html',
                    editDropdownOptionsArray: ['PANE FRESCO', 'LATTE', 'ALTRO']
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    scope.gridOptionsSpesa.gridApi = gridApi;
                }
            },
            loadSpesa: function () {
                scope.gridOptionsSpesa.data = [{
                    "REPR_CD": "XXX",
                    "SOTT_CD": "yyy",
                    "FAMG_CD": "UUU",
                    "EAN": "123456789",
                    "REFR_DE": "PANE FRESCO"
                }];
            }
        };
        return srvc;
    }]);
})();
