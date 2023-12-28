(function () {
    'use strict';
    angular.module('myApp').factory('andamentoMeseService', ['$http', '$timeout', 'dataService', 'uiGridConstants', '$strings', function ($http, $timeout, dataService, uiGridConstants, $strings) {
        var pivotData = [];
        var srvc = {
            getClass: function (entity, field) {
                if (entity[field] < 0) {
                    return 'red';
                }
                return 'text-right';
            },
            gridOptionPivotMese: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 23,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'nome_mese',
                    displayName: 'MM',
                    field: 'nome_mese',
                    width: '34%'
                }, {
                    name: 'contocomune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contocomune',
                    width: '33%',
                    headerCellClass: 'comune',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity, col.field);
                    }
                }, {
                    name: 'contopersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contopersonale',
                    width: '33%',
                    headerCellClass: 'personale',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity, col.field);
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionPivotMese.gridApi = gridApi;
                    srvc.gridOptionPivotMese.gridApi.core.handleWindowResize();
                }
            },
            loadPivotMese: function (year) {
                dataService.data.optionsGrafico = {
                    chart: {
                        type: 'lineChart',
                        height: 720,
                        margin: {
                            top: 20,
                            right: 20,
                            bottom: 60,
                            left: 65
                        },
                        x: function (d) {
                            if (d) {
                                return d.x;
                            }
                        },
                        y: function (d) {
                            if (d) {
                                return d.y;
                            }
                        },
                        useInteractiveGuideline: true,
                        xAxis: {
                            axisLabel: 'Month',
                            tickFormat: function (d) {
                                return d3.time.format('%B')(new Date(year, d - 1, 1));
                            }
                        },
                        yAxis: {
                            axisLabel: 'Totale (€)',
                            tickFormat: function (d) {
                                return d3.round(d, 2) + " €";
                            }
                        },
                        callback: function (chart) {
                            $timeout(function () {
                                d3.selectAll('.nvtooltip').style('opacity', 0);
                            }, 100);
                        }
                    }
                };
                var dto = {};
                dto.anno = year;
                return $http.post($strings.REST.SERVER + '/andamento_mensile', dto).then(function (resp) {
                    pivotData = resp.data;
                    srvc.gridOptionPivotMese.data = resp.data;
                    dataService.data.dataGrafico = srvc.dataGrafico();
                });
            },
            dataGrafico: function dataGrafico() {
                return [{
                    key: $strings.CONTO.CONTO_COMUNE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.mese,
                            'y': d.contocomune
                        };
                    }),
                    color: $strings.RGB.CONTO_COMUNE,
                    strokeWidth: 2
                }, {
                    key: $strings.CONTO.CONTO_PERSONALE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.mese,
                            'y': d.contopersonale
                        };
                    }),
                    color: $strings.RGB.CONTO_PERSONALE,
                    strokeWidth: 2,
                    classed: 'dashed'
                }];
            }
        }
        return srvc;
    }]);
})();