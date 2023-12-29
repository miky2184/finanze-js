(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, $strings) {
        var pivotData = [];     
        var pivotDataPie = [];
        var pivotDataPieCategoria = [];
        var pivotDataPiePersonale = [];
        var pivotDataPiePersonaleCategoria = [];
        var pivotDataGraficoSpesoTotalePerAnno = [];
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
            dataGraficoSpesoTotalePerAnno: function dataGraficoSpesoTotalePerAnno(){
                return pivotDataGraficoSpesoTotalePerAnno;
            },
            dataGrafico: function dataGrafico() {
                return [{
                    key: $strings.CONTO.CONTO_COMUNE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': new Date(d.data_val).setMinutes(new Date(d.data_val).getMinutes() - new Date(d.data_val).getTimezoneOffset()),
                            'y': new Number(d.contocomune)
                        };
                    }),
                    color: $strings.RGB.CONTO_COMUNE,
                    strokeWidth: 2
            }, {
                    key: $strings.CONTO.CONTO_PERSONALE,
                    values: pivotData.map(function (d) {
                        return {
                            'x': new Date(d.data_val).setMinutes(new Date(d.data_val).getMinutes() - new Date(d.data_val).getTimezoneOffset()),
                            'y': new Number(d.contopersonale)
                        };
                    }),
                    color: $strings.RGB.CONTO_PERSONALE,
                    strokeWidth: 2
            }];
            },
            loadGrafico: function (year) {
                dataService.data.optionsGrafico = {
                    chart: {
                        type: 'lineChart',
                        height: 500,                        
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
                dto.id_db = dataService.data.idDb;        
                return $http.post($strings.REST.SERVER + '/totale_in_data', dto).then(function (resp) {
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
                dto.conto = 1;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/categoria_sottocategoria', dto).then(function (resp) {
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
                dto.conto = 1;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/ambito_categoria', dto).then(function (resp) {
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
                dto.conto = 2;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/categoria_sottocategoria', dto).then(function (resp) {
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
                dto.conto = 2;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/ambito_categoria', dto).then(function (resp) {
                    pivotDataPiePersonaleCategoria = resp.data;
                    dataService.data.dataGraficoPiePersonaleCategoria = srvc.dataGraficoPiePersonaleCategoria();
                });
            },
            loadGraficoSpesoTotalePerAnno: function (year){
                dataService.data.optionsGraficoSpesoTotalePerAnno= {                    
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 500,
                        showControls: false,
                        showValues: true,
                        duration: 500,                       
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        xAxis: {
                            axisLabel: 'Year',
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: 'Values',
                            tickFormat: function(d){
                                return d3.format(',.2f')(d);
                            }
                        },
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
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/totale_per_anno', dto).then(function (resp) {
                    pivotDataGraficoSpesoTotalePerAnno = resp.data[0]['spesototaleperanno'];
                    dataService.data.dataGraficoSpesoTotalePerAnno = srvc.dataGraficoSpesoTotalePerAnno();
                });
            }           
        };
        return srvc;
    }]);
})();