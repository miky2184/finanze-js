(function () {
    'use strict';
    angular.module('myApp').factory('andamentoAnnuoService', ['$http', '$timeout', '$strings', 'uiGridConstants', 'dataService', function ($http, $timeout, $strings, uiGridConstants, dataService) {
        var pivotData = [];
        var srvc = {
            gridOptionAndamentoAnnuo: {
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
                    name: 'anno',
                    displayName: 'ANNO',
                    field: 'anno',
                    width: '20%'
                }, {
                    name: 'contocomune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contocomune',
                    width: '20%',
                    footerCellFilter: 'currency',
                    headerCellClass: 'comune',
                    cellFilter: 'currency'
                }, {
                    name: 'contomarianna',
                    displayName: $strings.CONTO.CONTO_MARIANNA,
                    field: 'contomarianna',
                    width: '20%',
                    headerCellClass: 'marianna',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
                }, {
                    name: 'contopersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contopersonale',
                    width: '20%',
                    headerCellClass: 'personale',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionAndamentoAnnuo.gridApi = gridApi;
                    srvc.gridOptionAndamentoAnnuo.gridApi.core.handleWindowResize();
                }
            },
            loadAndamentoAnnuo: function () {
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
                            axisLabel: 'Year',
                            tickFormat: function (d) {
                                return d3.time.format('%Y')(new Date(d, 2, 1));
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
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/andamento_annuo', dto).then(function (resp) {
                    pivotData = resp.data;
                    srvc.gridOptionAndamentoAnnuo.data = resp.data;
                    dataService.data.dataGrafico = srvc.dataGrafico(resp.data);
                });
            },
            dataGrafico: function () {
                return [{
                    key: $strings.CONTO.CONTO_COMUNE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.anno,
                            'y': d.contocomune
                        };
                    }),
                    color: $strings.RGB.CONTO_COMUNE,   
                    strokeWidth: 2                 
                }, {
                    key: $strings.CONTO.CONTO_MARIANNA,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.anno,
                            'y': d.contomarianna
                        };
                    }),
                    color: $strings.RGB.CONTO_MARIANNA,
                    strokeWidth: 2
                }, {
                    key: $strings.CONTO.CONTO_PERSONALE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.anno,
                            'y': d.contopersonale
                        };
                    }),
                    color: $strings.RGB.CONTO_PERSONALE,
                    strokeWidth: 2,
                    classed: 'dashed'
                }];
            }
        };
        return srvc;
    }]);
})();