(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {
        
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
            gridSpeseAnnuali: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                    name: 'AMBITO',
                    displayName: 'Ambito',
                    field: 'ambito',
                    width: 165,
                    pinnedLeft: true
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'categoria',
                    width: 165,
                    pinnedLeft: true
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    width: '*',
                    pinnedLeft: true
                }, {
                    name: '2017',
                    displayName: '2017',
                    field: '2017',
                    width: 130  ,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',                    
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2018',
                    displayName: '2018',
                    field: '2018',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2018'] < 0 && row.entity['2017'] != 0 ) {
                            var perc = (Math.abs(row.entity['2018'])-Math.abs(row.entity['2017']))/Math.abs(row.entity['2018'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    },                    
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2019',
                    displayName: '2019',
                    field: '2019',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2019'] < 0 && row.entity['2018'] != 0 ) {
                            var perc = (Math.abs(row.entity['2019'])-Math.abs(row.entity['2018']))/Math.abs(row.entity['2019'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2020',
                    displayName: '2020',
                    field: '2020',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2020'] < 0 && row.entity['2019'] != 0 ) {
                            var perc = (Math.abs(row.entity['2020'])-Math.abs(row.entity['2019']))/Math.abs(row.entity['2020'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2021',
                    displayName: '2021',
                    field: '2021',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2021'] < 0 && row.entity['2020'] != 0 ) {
                            var perc = (Math.abs(row.entity['2021'])-Math.abs(row.entity['2020']))/Math.abs(row.entity['2021'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2022',
                    displayName: '2022',
                    field: '2022',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2022'] < 0 && row.entity['2021'] != 0 ) {
                            var perc = (Math.abs(row.entity['2022'])-Math.abs(row.entity['2021']))/Math.abs(row.entity['2022'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2023',
                    displayName: '2023',
                    field: '2023',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['2024'] < 0 && row.entity['2023'] != 0 ) {
                            var perc = (Math.abs(row.entity['2024'])-Math.abs(row.entity['2023']))/Math.abs(row.entity['2024'])*100;
                            return srvc.getPerc(perc);
                        } else {
                            return 'text-right';
                        }
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2022-2023',
                    displayName: '2022-2023',
                    field: '2022-2023',
                    width: 130,                    
                    cellFilter: 'percentage',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2022-2023']);                        
                    }                    
                },{
                    name: '2024',
                    displayName: '2024',
                    field: '2024',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2025',
                    displayName: '2025',
                    field: '2025',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridSpeseAnnuali.gridApi = gridApi;
                    srvc.gridSpeseAnnuali.gridApi.core.handleWindowResize(); 
                }
            },
            loadSpeseAnnue: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoconto;
                return $http.post($strings.REST.SERVER + '/speseAnnue', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridSpeseAnnuali.data = resp.data;
                    }
                });
            }
        };
        return srvc;
    }]);
})();
