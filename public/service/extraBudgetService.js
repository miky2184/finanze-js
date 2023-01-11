(function () {
    'use strict';
    angular.module('myApp').factory('extraBudgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {
        
        var srvc = {
            getPerc: function(perc){
                switch (true){
                    case perc < 0:
                        return 'centoperc';                                    
                    case perc >= 0 && perc < 25:
                        return 'settcinqueperc';
                    case perc >= 25 && perc < 50:
                        return 'cinquantaperc';
                    case perc >= 50 && perc < 100:
                        return 'venticinqperc';
                    case perc >= 100:
                        return 'zeroperc';
                    default:
                        return 'text-right'
                }
            },
            gridExtraBudget: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                    name: 'IDAMB',
                    displayName: 'ID AMB',
                    field: 'IDAMB',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'IDCAT',
                    displayName: 'ID CAT',
                    field: 'IDCAT',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'IDSOT',
                    displayName: 'ID SOT',
                    field: 'IDSOT',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'AMBITO',
                    displayName: 'Ambito',
                    field: 'AMBITO',
                    width: 120,
                    pinnedLeft: true
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'CATEGORIA',
                    width: 165,
                    pinnedLeft: true
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'SOTTOCATEGORIA',
                    width: '*',
                    pinnedLeft: true
                }, /*{
                    name: 'TOTALE_2015',
                    displayName: '2015',
                    field: 'TOTALE_2015',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'TOTALE_2016',
                    displayName: '2016',
                    field: 'TOTALE_2016',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },*/{
                    name: 'TOTALE_2017',
                    displayName: '2017',
                    field: 'TOTALE_2017',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',                    
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2018',
                    displayName: '2018',
                    field: 'TOTALE_2018',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOTALE_2018'] < 0 && row.entity['TOTALE_2017'] != 0 ) {
                            var perc = (Math.abs(row.entity['TOTALE_2018'])-Math.abs(row.entity['TOTALE_2017']))/Math.abs(row.entity['TOTALE_2017'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    },                    
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2019',
                    displayName: '2019',
                    field: 'TOTALE_2019',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOTALE_2019'] < 0 && row.entity['TOTALE_2018'] != 0 ) {
                            var perc = (Math.abs(row.entity['TOTALE_2019'])-Math.abs(row.entity['TOTALE_2018']))/Math.abs(row.entity['TOTALE_2018'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2020',
                    displayName: '2020',
                    field: 'TOTALE_2020',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOTALE_2020'] < 0 && row.entity['TOTALE_2019'] != 0 ) {
                            var perc = (Math.abs(row.entity['TOTALE_2020'])-Math.abs(row.entity['TOTALE_2019']))/Math.abs(row.entity['TOTALE_2019'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2021',
                    displayName: '2021',
                    field: 'TOTALE_2021',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOTALE_2021'] < 0 && row.entity['TOTALE_2020'] != 0 ) {
                            var perc = (Math.abs(row.entity['TOTALE_2021'])-Math.abs(row.entity['TOTALE_2020']))/Math.abs(row.entity['TOTALE_2020'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }/*,{
                    name: 'TOTALE_2022',
                    displayName: '2022',
                    field: 'TOTALE_2022',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2023',
                    displayName: '2023',
                    field: 'TOTALE_2023',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2024',
                    displayName: '2024',
                    field: 'TOTALE_2024',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2025',
                    displayName: '2025',
                    field: 'TOTALE_2025',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }*/],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridExtraBudget.gridApi = gridApi;
                    srvc.gridExtraBudget.gridApi.core.handleWindowResize(); 
                }
            },
            loadExtraBudget: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoconto;
                return $http.post($strings.REST.SERVER + '/extraBudget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridExtraBudget.data = resp.data;
                    }
                });
            }
        };
        return srvc;
    }]);
})();
