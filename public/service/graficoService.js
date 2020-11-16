(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, $strings) {
        var pivotData = [];        
        var srvc = {
            dataGrafico: function dataGrafico() {
                return [{
                    key: $strings.CONTO.CONTO_COMUNE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': new Date(d.data_val).setMinutes(new Date(d.data_val).getMinutes() - new Date(d.data_val).getTimezoneOffset()),
                            'y': d.contocomune
                        };
                    }),
                    color: $strings.RGB.CONTO_COMUNE,
                    area: true
            }, {
                    key: $strings.CONTO.CONTO_PERSONALE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': new Date(d.data_val).setMinutes(new Date(d.data_val).getMinutes() - new Date(d.data_val).getTimezoneOffset()),
                            'y': d.contopersonale
                        };
                    }),
                    color: $strings.RGB.CONTO_PERSONALE
            }];
            },
            loadGrafico: function (year) {
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
                        useInteractiveGuideline: true,
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
                        xAxis: {
                            axisLabel: 'Date (dd/mm/yy)',
                            tickFormat: function (d) {
                                return d3.time.format('%d/%m/%y')(new Date(d))
                            }
                        },
                        yAxis: {
                            axisLabel: 'Totale (€)',
                            tickFormat: function (d) {
                                return d3.round(d, 0) +"€";
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
                return $http.post($strings.REST.SERVER + '/graph', dto).then(function (resp) {
                    pivotData = resp.data;                                                      
                    dataService.data.dataGrafico = srvc.dataGrafico();                    
                });
            }
        };
        return srvc;
    }]);
})();
