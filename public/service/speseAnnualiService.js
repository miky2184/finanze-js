(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {
        
        var srvc = {
            getPerc: function(perc){
                switch (true){                  
                    case perc >= 25:
                        return 'red';
                    case perc > 0 && perc < 25:
                        return 'orange';
                    case perc < 0 && perc > -25:
                        return 'yellow';
                    case perc <= -25:
                        return 'green';
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
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'categoria',
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: '2018',
                    displayName: '2018',
                    field: '2018',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2017-2018']);
                    }                    
                },{
                    name: '2019',
                    displayName: '2019',
                    field: '2019',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2018-2019']);
                    }                    
                },{
                    name: '2020',
                    displayName: '2020',
                    field: '2020',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2019-2020']);
                    }                    
                },{
                    name: '2021',
                    displayName: '2021',
                    field: '2021',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2020-2021']);
                    }                    
                },{
                    name: '2022',
                    displayName: '2022',
                    field: '2022',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2021-2022']);
                    }                    
                },{
                    name: '2023',
                    displayName: '2023',
                    field: '2023',
                    width: '6%',
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
                    width: '4%',                                        
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {                        
                        return srvc.getPerc(row.entity['2022-2023']);
                    }                    
                },{
                    name: '2024',
                    displayName: '2024',
                    field: '2024',
                    width: '6%',
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
                    width: '4%',                                        
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
                return $http.post($strings.REST.SERVER + '/spese_annue', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridSpeseAnnuali.data = resp.data;
                    }
                });
            }
        };
        return srvc;
    }]);
})();
