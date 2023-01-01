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
                    displayName: 'Conto',
                    field: 'conto',
                    width: '20%'
            }, {
                    name: 'contoComune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contoComune',
                    width: '*',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
            }, {
                    name: 'contoPersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contoPersonale',
                    width: '*',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }, {
                name: 'contoMarianna',
                displayName: 'CONTO MARIANNA',
                field: 'contoMarianna',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
        }, {
                    name: 'totale',
                    displayName: 'Totale',
                    field: 'totale',
                    width: '*',
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
                    field: 'DESCRIZIONE',
                     displayName: 'DA',
                    width: '25%'
            },{
                field: 'INFO',
                 displayName: 'INFO',
                    width: '35%'
        },{
            field: 'DATA_VAL',
             displayName: 'DATA',
                    width:'10%'
    }, {
                    field: 'contoComune',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    width: '10%'
            }, {
                    field: 'contoPersonale',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    width: '10%'
            }, {
                field: 'contoMarianna',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency',
                width: '10s%'
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
                    return $http.get($strings.REST.SERVER + '/saldoavere').then(function (resp) {
                        srvc.gridOptionsAvere.data = resp.data;
                    });
                });
            }
        };
        return srvc;
    }]);
})();
