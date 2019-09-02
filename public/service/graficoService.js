(function () {
    'use strict';
    angular.module('myApp').factory('graficoService', ['modalService', '$http', '$timeout', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $timeout, dataService, uiGridConstants, listaMovimentiService, $strings) {
        var srvc = {
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
                            axisLabel: 'Totale (€)'
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
                    var labels = [];
                    var dataGrafico = [{
                        key: $strings.CONTO.CONTO_COMUNE,
                        values: [],
                        color: $strings.RGB.CONTO_COMUNE
                }, {
                        key: $strings.CONTO.CONTO_PERSONALE,
                        values: [],
                        color: $strings.RGB.CONTO_PERSONALE
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
                    var oldImportoDaniela = 0;

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
                            dataGrafico[0].values.push(dataCC);
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
                            dataGrafico[1].values.push(dataCP);

                            var dataCD = [];
                            dataCD.push(l);
                            if (data.filter(function (d) {
                                    return d.tipoConto === 3 && d.data === l;
                                }).length > 0) {
                                dataCD.push(data.filter(function (d) {
                                    return d.tipoConto === 3 && d.data === l;
                                })[0].importo);
                                oldImportPersonale = data.filter(function (d) {
                                    return d.tipoConto === 3 && d.data === l;
                                })[0].importo;
                            } else {
                                dataCD.push(oldImportPersonale);
                            }
                            dataGrafico[2].values.push(dataCD);


                        });
                        dataService.data.dataGrafico = dataGrafico.map(function (series) {
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
