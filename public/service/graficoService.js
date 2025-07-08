(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, $strings) {
        const graficoService = {};

        var pivotData = [];     
        var pivotDataGraficoSpesoTotalePerAnno = [];

        function parseResponse(data) {
            const parsedData = [];
            data.forEach(item => {
                const row = { data_val: item.data_val };
                item.conti.forEach(conto => {
                    const [key, value] = Object.entries(conto)[0];
                    row[key] = value;
                });
                parsedData.push(row);
            });
            return parsedData;
        }

        function parseResponseTotali(data) {
            const parsedData = [];
            data.forEach(item => {
                const row = { anno: item.anno };
                item.conti.forEach(conto => {
                    const [key, value] = Object.entries(conto)[0];
                    row[key] = value;
                });
                parsedData.push(row);
            });
            return parsedData;
        }

        graficoService.dataGraficoSpesoTotalePerAnno = function dataGraficoSpesoTotalePerAnno(data){
            const datiGrafico = [];
            dataService.data.conti.forEach(function (item) {
                const key = Object.keys(item)[0]; // Estrae la chiave dinamica (es. "conto1")
                const value = item[key]; 
                if (item[key].graph){
                    datiGrafico.push({
                        key: value.label,
                        values: data.map(function (d) {
                            return {
                                'label': d.anno,
                                'value': d[key]
                            };
                        }),
                        color: value.hex_color             
                    });
                }                
            });

            return datiGrafico;                   
        }

        graficoService.dataGrafico = function dataGrafico(data) {
            const datiGrafico = [];
            dataService.data.conti.forEach(function (item) {
                const key = Object.keys(item)[0]; // Estrae la chiave dinamica (es. "conto1")
                const value = item[key]; 
                if (item[key].graph){
                    datiGrafico.push({
                        key: value.label,
                        values: data.map(function (d) {
                            return {
                                'x': new Date(d.data_val).setMinutes(new Date(d.data_val).getMinutes() - new Date(d.data_val).getTimezoneOffset()),
                                'y': new Number(d[key])
                            };
                        }),
                        color: value.hex_color,   
                        strokeWidth: 2                 
                    });
                }                
            });

            return datiGrafico;                           
        }

        graficoService.loadGrafico = function (year) {
            dataService.data.optionsGrafico = {
                chart: {
                    type: 'lineChart',  
                    height: 650,                        
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
                pivotData = parseResponse(resp.data);
                dataService.data.dataGrafico = graficoService.dataGrafico(pivotData);
            });                                    
        }

        graficoService.loadGraficoSpesoTotalePerAnno = function (year){
            dataService.data.optionsGraficoSpesoTotalePerAnno= {             
                chart: {
                    type: 'cumulativeLineChart',
                    height: 650,
                    showControls: false,
                    showValues: true,
                    duration: 500,                       
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    average: function(d) { return d.value; },
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
                pivotDataGraficoSpesoTotalePerAnno = parseResponseTotali(resp.data);
                dataService.data.dataGraficoSpesoTotalePerAnno = graficoService.dataGraficoSpesoTotalePerAnno(pivotDataGraficoSpesoTotalePerAnno);
            });
        }           
        
        return graficoService;
    }]);
})();