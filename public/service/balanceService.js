(function () {
    'use strict';
    angular.module('myApp').factory('balanceService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService, $strings) {
        var srvc = {
            gridOptionsBalance: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 23,
                enableFiltering: true,
                selectionRowHeaderWidth: 35,
                columnDefs: [{
                    name: 'conto',
                    displayName: 'CONTO',
                    field: 'conto',
                    width: '20%'
            }, {
                    name: 'conto_comune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'conto_comune',
                    width: '20%',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
            }, {
                    name: 'conto_personale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'conto_personale',
                    width: '20%',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }, {
                name: 'conto_marianna',
                displayName: $strings.CONTO.CONTO_MARIANNA,
                field: 'conto_marianna',
                width: '20%',
                cellClass: 'text-right',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
        }, {
                    name: 'totale',
                    displayName: 'TOTALE',
                    field: 'totale',
                    width: '20%',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsBalance.gridApi = gridApi;
                    srvc.gridOptionsBalance.gridApi.core.handleWindowResize();
                }
            },
            gridOptionsAvere: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 23,
                enableFiltering: true,
                selectionRowHeaderWidth: 35,
                columnDefs: [{
                    field: 'beneficiario',
                     displayName: 'DA/A',
                    width: '14%'
            },{
                field: 'info',
                 displayName: 'INFO',
                    width: '*'
        },{
            field: 'anno',
            diplayName: 'ANNO',
            cellClass: 'text-center',
            width: '7%'            
        }, {
            field: 'mese',
            diplayName: 'MESE',
            cellClass: 'text-center',
            width: '7%',            
        }, {
            diplayName: 'CONTO COMUNE',
                    field: 'conto_comune',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    width: '12%'
            }, {
                diplayName: 'CONTO PERSONALE',
                    field: 'conto_personale',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    width: '12%'
            }, {
                diplayName: 'CONTO MARIANNA',
                field: 'conto_marianna',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency',
                cellClass: 'text-right',
                width: '12%'
        }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAvere.gridApi = gridApi;
                    srvc.gridOptionsAvere.gridApi.core.handleWindowResize();
                }
            },
            loadBalance: function () {
                return $http.get($strings.REST.SERVER + '/saldo').then(function (resp) {
                    srvc.gridOptionsBalance.data = resp.data;
                    return $http.get($strings.REST.SERVER + '/dare_avere').then(function (resp) {
                        srvc.gridOptionsAvere.data = resp.data;
                    });
                });
            }
        };
        return srvc;
    }]);
})();
