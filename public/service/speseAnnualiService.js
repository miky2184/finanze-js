(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {
        
        var srvc = {
            getPerc: function(perc){
                switch (true){
                    case perc >= 75:
                        return 'centoperc';
                    case perc >= 50 && perc < 75:
                        return 'settcinqueperc';
                    case perc >= 25 && perc < 50:
                        return 'cinquantaperc';
                    case perc > 0 && perc < 25:
                        return 'venticinqueperc';
                    case perc < 0 && perc > -25:
                        return 'zeroperc';
                    case perc <= -25 && perc > -50:
                        return 'menocinquantaperc';
                    case perc <= -50 && perc > -75:
                        return 'menosettcinqueperc';
                    case perc <= -75:
                        return 'menocentoperc';
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
                    name: '2018',
                    displayName: '2018',
                    field: '2018',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2017-2018']);
                    },                    
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2017-2018',
                    displayName: '2017-2018',
                    field: '2017-2018',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2017-2018']);
                    }                    
                },{
                    name: '2019',
                    displayName: '2019',
                    field: '2019',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2018-2019']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2018-2019',
                    displayName: '2018-2019',
                    field: '2018-2019',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2018-2019']);
                    }                    
                },{
                    name: '2020',
                    displayName: '2020',
                    field: '2020',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2019-2020']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2019-2020',
                    displayName: '2019-2020',
                    field: '2019-2020',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2019-2020']);
                    }                    
                },{
                    name: '2021',
                    displayName: '2021',
                    field: '2021',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2020-2021']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2020-2021',
                    displayName: '2020-2021',
                    field: '2020-2021',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2020-2021']);
                    }                    
                },{
                    name: '2022',
                    displayName: '2022',
                    field: '2022',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2021-2022']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2021-2022',
                    displayName: '2021-2022',
                    field: '2021-2022',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2021-2022']);
                    }                    
                },{
                    name: '2023',
                    displayName: '2023',
                    field: '2023',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2022-2023']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2022-2023',
                    displayName: '2022-2023',
                    field: '2022-2023',
                    width: 80,                                        
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
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity['2023-2024']);
                    }, 
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: '2023-2024',
                    displayName: '2023-2024',
                    field: '2023-2024',
                    width: 80,                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2023-2024']);                        
                    }                    
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
