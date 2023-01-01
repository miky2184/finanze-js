(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, $strings) {
        var pivotData = [];     
        var pivotDataPie = [];
        var pivotDataPieCategoria = [];
        var pivotDataPiePersonale = [];
        var pivotDataPiePersonaleCategoria = [];        
        var srvc = {
            dataGraficoPie: function dataGraficoPie(){
                return pivotDataPie;
            },
            dataGraficoPieCategoria : function dataGraficoPieCategoria(){
                return pivotDataPieCategoria;
            },
            dataGraficoPiePersonale: function dataGraficoPiePersonale(){
                return pivotDataPiePersonale;
            },
            dataGraficoPiePersonaleCategoria: function dataGraficoPiePersonaleCategoria(){
                return pivotDataPiePersonaleCategoria;
            },
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
                        height: 1000,
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
            },
            loadGraficoPie: function (year){
                dataService.data.optionsGraficoPie = {                    
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        showLabels: true,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
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
                return $http.post($strings.REST.SERVER + '/pie', dto).then(function (resp) {
                    pivotDataPie = resp.data;
                    dataService.data.dataGraficoPie = srvc.dataGraficoPie();
                });
            },
            loadGraficoPieCategoria: function (year){
                dataService.data.optionsGraficoPieCategoria = {                    
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        showLabels: true,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
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
                return $http.post($strings.REST.SERVER + '/pieCategoria', dto).then(function (resp) {
                    pivotDataPieCategoria = resp.data;
                    dataService.data.dataGraficoPieCategoria = srvc.dataGraficoPieCategoria();
                });
            },
            loadGraficoPiePersonale: function (year){
                dataService.data.optionsGraficoPiePersonale = {                    
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        showLabels: true,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
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
                return $http.post($strings.REST.SERVER + '/piePersonale', dto).then(function (resp) {
                    pivotDataPiePersonale = resp.data;
                    dataService.data.dataGraficoPiePersonale = srvc.dataGraficoPiePersonale();
                });
            } ,
            loadGraficoPiePersonaleCategoria: function (year){
                dataService.data.optionsGraficoPiePersonaleCategoria= {                    
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        showLabels: true,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
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
                return $http.post($strings.REST.SERVER + '/piePersonaleCategoria', dto).then(function (resp) {
                    pivotDataPiePersonaleCategoria = resp.data;
                    dataService.data.dataGraficoPiePersonaleCategoria = srvc.dataGraficoPiePersonaleCategoria();
                });
            }           
        };
        return srvc;
    }]);
})();