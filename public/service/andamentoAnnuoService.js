(function () {
    'use strict';
    angular.module('myApp').factory('andamentoAnnuoService', ['$http', '$timeout', '$strings', 'uiGridConstants', 'dataService', function ($http, $timeout, $strings, uiGridConstants, dataService) {        

        function parseResponse(data) {
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
                    footerCellTemplate: '<div class="ui-grid-cell-contents text-right" >{{col.getAggregationValue() | number:2 }} €</div>'
                });
            });
            
            return columns;
        }

        var srvc = {
            gridOptionAndamentoAnnuo: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                columnDefs: [],
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
                    const pivotData = parseResponse(resp.data);

                    // Reinizializza la griglia con i nuovi dati e colonne
                    srvc.initializeGrid(pivotData);

                    // Aggiorna il grafico con i nuovi dati
                    dataService.data.dataGrafico = srvc.dataGrafico(pivotData);

                    // Forza il ridimensionamento della griglia
                    if (srvc.gridOptionAndamentoAnnuo.gridApi) {
                        srvc.gridOptionAndamentoAnnuo.gridApi.core.handleWindowResize();
                    }
                });
            },
            dataGrafico: function (data) {
                const datiGrafico = [];
                dataService.data.conti.forEach(function (item) {
                    const key = Object.keys(item)[0]; // Estrae la chiave dinamica (es. "conto1")
                    const value = item[key]; 
                    
                    if (item[key].graph){
                        datiGrafico.push({
                            key: value.label,
                            values: data.map(function (d) {
                                return {
                                    'x': d.anno,
                                    'y': d[key]
                                };
                            }),
                            color: value.hex_color,   
                            strokeWidth: 2                 
                        });
                    }
                });

                return datiGrafico;                
            },
            initializeGrid: function (pivotData) {
                // Genera nuove colonne dinamiche
                const dynamicColumns = generateContoColumns();
                
                // Aggiungi le colonne dinamiche alle colonne esistenti
                srvc.gridOptionAndamentoAnnuo.columnDefs = [{
                    name: 'anno',
                    displayName: 'ANNO',
                    field: 'anno',
                    width: '*',
                    cellClass: 'text-center'
                }].concat(dynamicColumns);
            
                // Forza l'aggiornamento della griglia
                if (srvc.gridOptionAndamentoAnnuo.gridApi) {
                    srvc.gridOptionAndamentoAnnuo.gridApi.core.notifyDataChange('column');
                }
            
                // Imposta i dati aggiornati
                srvc.gridOptionAndamentoAnnuo.data = pivotData || srvc.gridOptionAndamentoAnnuo.data;
            }
        };
        
        return srvc;
    }]);
})();