(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService) {        
        var srvc = {            
           loadGrafico: function (year) {
               dataService.data.optionsGraph = {
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
                            axisLabel: 'Totale (€)'
                        }
                    }
                };
            var dto = {};
            dto.anno = year;
            return $http.post('http://93.55.248.37:3001/graph', dto).then(function (resp) {                
                var labels = [];
                var dataGraph = [{
                    key: 'Conto Comune',
                    values: [],
                    color: '#ff7f0e'
                }, {
                    key: 'Conto Personale',
                    values: [],
                    color: '#7777ff'
                }];
                var data = resp.data;
                data = resp.data.map(function (d) {
                    var tmp = {};
                    var dateVal = d['DATA_VAL'];
                    var dateLong = new Date(dateVal).setMinutes(new Date(dateVal).getMinutes() - new Date(dateVal).getTimezoneOffset());
                    if (labels.indexOf(dateLong) < 0) {
                        labels.push(dateLong);
                    }
                    tmp.data = dateLong;
                    tmp.tipoConto = d['TP_CONTO'];
                    tmp.importo = d['TOTALE'];
                    return tmp;
                });
                var data = getDataGrafico(labels);
                var oldImportPersonale = 0;
                var oldImportoComune = 0;

                function getDataGrafico(labels) {
                    labels.forEach(function (l) {
                        var dataCC = [];
                        dataCC.push(l);
                        if (data.filter(function (d) {
                                return d.tipoConto === 1 && d.data === l;
                            }).length > 0) {
                            dataCC.push(data.filter(function (d) {
                                return d.tipoConto === 1 && d.data === l;
                            })[0].importo);
                            oldImportoComune = data.filter(function (d) {
                                return d.tipoConto === 1 && d.data === l;
                            })[0].importo;
                        } else {
                            dataCC.push(oldImportoComune);
                        }
                        dataGraph[0].values.push(dataCC);
                        var dataCP = [];
                        dataCP.push(l);
                        if (data.filter(function (d) {
                                return d.tipoConto === 2 && d.data === l;
                            }).length > 0) {
                            dataCP.push(data.filter(function (d) {
                                return d.tipoConto === 2 && d.data === l;
                            })[0].importo);
                            oldImportPersonale = data.filter(function (d) {
                                return d.tipoConto === 2 && d.data === l;
                            })[0].importo;
                        } else {
                            dataCP.push(oldImportPersonale);
                        }
                        dataGraph[1].values.push(dataCP);
                    });
                    dataService.data.dataGraph = dataGraph.map(function (series) {
                        series.values = series.values.map(function (d) {
                            return {
                                x: d[0],
                                y: d[1]
                            };
                        });
                        return series;
                    });
                };
            });
        }
        };
        return srvc;
    }]);
})();
