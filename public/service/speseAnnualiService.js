(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {

        var srvc = {
            getClass: function (perc) {
                switch (true) {
                    case perc > 5:
                        return 'red';
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
                    displayName: 'AMBITO',
                    field: 'ambito',
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: 'CATEGORIA',
                    displayName: 'CATEGORIA',
                    field: 'categoria',
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'SOTTOCATEGORIA',
                    field: 'sottocategoria',
                    width: '10%',
                    pinnedLeft: true
                }, {
                    name: '2018',
                    displayName: '2018',
                    field: '2018',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2017-2018']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2019',
                    displayName: '2019',
                    field: '2019',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2018-2019']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2020',
                    displayName: '2020',
                    field: '2020',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2019-2020']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2021',
                    displayName: '2021',
                    field: '2021',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2020-2021']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2022',
                    displayName: '2022',
                    field: '2022',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2021-2022']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2023',
                    displayName: '2023',
                    field: '2023',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2022-2023']);
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: '2024',
                    displayName: '2024',
                    field: '2024',
                    width: '10%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity['2023-2024']);
                    },
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
                dto.tipo_conto = pivot.tipo_conto;
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