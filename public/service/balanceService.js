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
                    name: 'contocomune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contocomune',
                    width: '20%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
            }, {
                    name: 'contopersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contopersonale',
                    width: '20%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }, {
                name: 'contomarianna',
                displayName: 'CONTO MARIANNA',
                field: 'contomarianna',
                width: '20%',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
        }, {
                    name: 'totale',
                    displayName: 'Totale',
                    field: 'totale',
                    width: '20%',
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
                    field: 'descrizione',
                     displayName: 'DA',
                    width: '25%'
            },{
                field: 'info',
                 displayName: 'INFO',
                    width: '35%'
        },{
            field: 'dataavere',
             displayName: 'DATA',
                    width:'10%',
                    type: 'date', 
                    cellFilter: 'date:\'yyyy-MM-dd\''
    }, {
                    field: 'contocomune',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    width: '10%'
            }, {
                    field: 'contopersonale',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    width: '10%'
            }, {
                field: 'contomarianna',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency',
                width: '10%'
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
