(function () {
    'use strict';
    angular.module('myApp').factory('andamentoMeseService', ['$http', '$timeout', '$strings', 'uiGridConstants', 'dataService', function ($http, $timeout, $strings, uiGridConstants, dataService) {        

        function parseResponse(data) {
            const parsedData = [];
            data.forEach(item => {
                const row = { mese: item.mese, id: item.id };
                item.conti.forEach(conto => {
                    const [key, value] = Object.entries(conto)[0];
                    row[key] = value;
                });
                parsedData.push(row);
            });
            return parsedData;
        }
        
        function generateContoColumns() {
            var columns = [];
            var dimCols = 100 / (1 + dataService.data.conti.length); // Calcola la dimensione delle colonne in percentuale

            dataService.data.conti.forEach(function (item) {
                const key = Object.keys(item)[0]; // Estrae la chiave dinamica (es. "conto1")
                const value = item[key]; // Ottiene il valore associato (es. { id: 1, label: ..., hex_color: ... })            

                columns.push({
                    name: key,
                    displayName: value.label, // Usa "label" come displayName
                    field: key,
                    width: dimCols.toString() + '%',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div class="ui-grid-cell-contents text-right" >{{col.getAggregationValue() | number:2 }} €</div>',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getClass(row.entity, col.field);
                    }
                });
            });
            
            return columns;
        }

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
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'mese',
                    displayName: 'MESE',
                    field: 'mese',
                    width: '*'
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
                        height: null,
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
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/andamento_mensile', dto).then(function (resp) {                    
                    const pivotData = parseResponse(resp.data);

                    // Reinizializza la griglia con i nuovi dati e colonne
                    srvc.initializeGrid(pivotData);

                    // Aggiorna il grafico con i nuovi dati
                    dataService.data.dataGrafico = srvc.dataGrafico(pivotData);

                    // Forza il ridimensionamento della griglia
                    if (srvc.gridOptionPivotMese.gridApi) {
                        srvc.gridOptionPivotMese.gridApi.core.handleWindowResize();
                    }
                });
            },
            dataGrafico: function (data) {
                const datiGrafico = [];
                dataService.data.conti.forEach(function (item) {
                const key = Object.keys(item)[0]; // Estrae la chiave dinamica (es. "conto1")
                const value = item[key]; 

                datiGrafico.push({
                    key: value.label,
                    values: data.map(function (d) {
                        return {
                            'x': d.id,
                            'y': d[key]
                        };
                    }),
                    color: value.hex_color,   
                    strokeWidth: 2
                }
                )});

                return datiGrafico;                
            },
            initializeGrid: function (pivotData) {
                // Genera nuove colonne dinamiche
                const dynamicColumns = generateContoColumns();
                
                // Aggiungi le colonne dinamiche alle colonne esistenti
                srvc.gridOptionPivotMese.columnDefs = [{
                    name: 'mese',
                    displayName: 'MESE',
                    field: 'mese',
                    width: '*',
                    cellClass: 'text-center'
                }].concat(dynamicColumns);
            
                // Forza l'aggiornamento della griglia
                if (srvc.gridOptionPivotMese.gridApi) {
                    srvc.gridOptionPivotMese.gridApi.core.notifyDataChange('column');
            }
            
                // Imposta i dati aggiornati
                srvc.gridOptionPivotMese.data = pivotData || srvc.gridOptionPivotMese.data;
        }
        };
        
        return srvc;
    }]);
})();