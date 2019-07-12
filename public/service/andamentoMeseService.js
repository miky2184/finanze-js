(function () {
    'use strict';
    angular.module('myApp').factory('andamentoMeseService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', 'utilService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, utilService, $strings) {
        var pivotData = [];
        var srvc = {
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
                    name: 'mese',
                    displayName: 'Mese',
                    field: 'mese',
                    width: '16%'
            }, {
                    name: 'contocomune',
                    displayName: $strings.CONTO.CONTO_COMUNE,
                    field: 'contocomune',
                    width: '28%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }, {
                    name: 'contopersonale',
                    displayName: $strings.CONTO.CONTO_PERSONALE,
                    field: 'contopersonale',
                    width: '28%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }, {
                    name: 'contodaniela',
                    displayName: $strings.CONTO.CONTO_DANIELA,
                    field: 'contodaniela',
                    width: '28%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency'
            }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionPivotMese.gridApi = gridApi;
                    srvc.gridOptionPivotMese.gridApi.core.handleWindowResize();
                }
            },
            loadPivotMese: function (year) {
                var balanceData = angular.copy(listaMovimentiService.gridOptions.data).filter(function (obj) {
                    return obj.anno === year && obj.visualizzare && obj.conto !== 4;
                });
                var months = [{
                    value: 1,
                    mese: 'Gennaio'
            }, {
                    value: 2,
                    mese: 'Febbraio'
            }, {
                    value: 3,
                    mese: 'Marzo'
            }, {
                    value: 4,
                    mese: 'Aprile'
            }, {
                    value: 5,
                    mese: 'Maggio'
            }, {
                    value: 6,
                    mese: 'Giugno'
            }, {
                    value: 7,
                    mese: 'Luglio'
            }, {
                    value: 8,
                    mese: 'Agosto'
            }, {
                    value: 9,
                    mese: 'Settembre'
            }, {
                    value: 10,
                    mese: 'Ottobre'
            }, {
                    value: 11,
                    mese: 'Novembre'
            }, {
                    value: 12,
                    mese: 'Dicembre'
            }];
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
                months.forEach(function (month) {
                        var newRow = {};
                        newRow.value = month.value;
                        newRow.mese = month.mese;
                        newRow.contocomune = utilService.filterArray(dataContoComune.map(function (obj) {
                            if (obj.mese === month.value) {
                                return obj.importo;
                            }
                        })).reduce(utilService.add, 0);
                        newRow.contopersonale = utilService.filterArray(dataContoPersonale.map(function (obj) {
                            if (obj.mese === month.value) {
                                return obj.importo;
                            }
                        })).reduce(utilService.add, 0);
                        newRow.contodaniela = utilService.filterArray(dataContoDaniela.map(function (obj) {
                            if (obj.mese === month.value) {
                                return obj.importo;
                            }
                        })).reduce(utilService.add, 0);
                        pivotData.push(newRow);
                    }),
                    srvc.gridOptionPivotMese.data = pivotData;
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
                dataService.data.dataGrafico = srvc.dataGrafico();
            },
            dataGrafico: function dataGrafico() {
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
            }, {
                    key: $strings.CONTO.CONTO_DANIELA,
                    values: pivotData.map(function (d) {
                        return {
                            'x': d.value,
                            'y': d.contodaniela
                        };
                    }),
                    color: $strings.RGB.CONTO_DANIELA
            }];
            }
        }
        return srvc;
    }]);
})();
