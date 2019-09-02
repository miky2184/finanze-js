(function () {
    'use strict';
    angular.module('myApp').factory('andamentoAnnuoService', ['modalService', '$http', '$timeout', '$strings', 'uiGridConstants', 'listaMovimentiService', 'utilService', 'dataService', function (modalService, $http, $timeout, $strings, uiGridConstants, listaMovimentiService, utilService, dataService) {
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
                    name: 'year',
                    displayName: 'Anno',
                    field: 'year',
                    width: '16%'
                }, {
                    name: 'contocomune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contocomune',
                    width: '28%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
                }, {
                    name: 'contopersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contopersonale',
                    width: '28%',
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
                var lowest = Number.POSITIVE_INFINITY;
                var highest = Number.NEGATIVE_INFINITY;
                var tmp;
                var dataTmp = angular.copy(listaMovimentiService.gridOptions.data);
                for (var i = dataTmp.length - 1; i >= 0; i--) {
                    tmp = dataTmp[i].anno;
                    if (tmp < lowest) lowest = tmp;
                    if (tmp > highest) highest = tmp;
                }
                var years = [];
                years.push(lowest);
                for (i = 1; i < highest - lowest; i++) {
                    var y = lowest + i;
                    years.push(y);
                }
                years.push(highest);
                var balanceData = angular.copy(listaMovimentiService.gridOptions.data).filter(function (obj) {
                    return obj.conto !== 4;
                });
                var dataContoComune = angular.copy(balanceData).filter(function (obj) {
                    return obj.tipoConto === 1;
                });
                var dataContoPersonale = angular.copy(balanceData).filter(function (obj) {
                    return obj.tipoConto === 2;
                });
                var dataContoDaniela = angular.copy(balanceData).filter(function (obj) {
                    return obj.tipoConto === 3;
                });
                pivotData = [];
                years.forEach(function (year) {
                    var newRow = {};
                    newRow.value = year;
                    newRow.year = year;
                    newRow.contocomune = utilService.filterArray(dataContoComune.map(function (obj) {
                        if (obj.anno <= year) {
                            return obj.importo;
                        }
                    })).reduce(utilService.add, 0);
                    newRow.contopersonale = utilService.filterArray(dataContoPersonale.map(function (obj) {
                        if (obj.anno <= year) {
                            return obj.importo;
                        }
                    })).reduce(utilService.add, 0);
                    newRow.contodaniela = utilService.filterArray(dataContoDaniela.map(function (obj) {
                        if (obj.anno <= year) {
                            return obj.importo;
                        }
                    })).reduce(utilService.add, 0);
                    pivotData.push(newRow);
                });
                srvc.gridOptionAndamentoAnnuo.data = pivotData;
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
                dataService.data.dataGrafico = srvc.dataGrafico();
            },
            dataGrafico: function () {
                return [{
                    key: $strings.CONTO.CONTO_COMUNE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.value,
                            'y': d.contocomune
                        };
                    }),
                    color: $strings.RGB.CONTO_COMUNE,
                    area: true
            }, {
                    key: $strings.CONTO.CONTO_PERSONALE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.value,
                            'y': d.contopersonale
                        };
                    }),
                    color: $strings.RGB.CONTO_PERSONALE
            }];
            }
        };
        return srvc;
    }]);
})();
