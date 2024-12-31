(function () {
    'use strict';
    angular.module('myApp').factory('balanceService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$strings', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService, $strings) {
        
        const balanceService = {};

        function parseResponse(data) {
            const parsedData = [];
            data.forEach(item => {
                const row = { conto: item.conto, totale: item.totale };
                item.conti.forEach(conto => {
                    const [key, value] = Object.entries(conto)[0];
                    row[key] = value;
                });
                parsedData.push(row);
            });
            return parsedData;
        }

        function parseResponseDareAvere(data) {
            const parsedData = [];
            data.forEach(item => {
                const row = { info: item.info, beneficiario: item.beneficiario, anno: item.anno, mese: item.mese };
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
            var dimCols = 85 / (1 + dataService.data.conti.length); // Calcola la dimensione delle colonne in percentuale

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

        function generateColumnsDareAvere() {
            var columns = [];
            var dimCols = 72 / (1 + dataService.data.conti.length); // Calcola la dimensione delle colonne in percentuale

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
        
        
        balanceService.gridOptionsBalance = {
            columnVirtualizationThreshold: 100,
            showGridFooter: false,
            showColumnFooter: true,
            minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
            enableFiltering: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [],
            data: [],
            onRegisterApi: function (gridApi) {
                balanceService.gridOptionsBalance.gridApi = gridApi;
                balanceService.gridOptionsBalance.gridApi.core.handleWindowResize();
            }
        }

        balanceService.gridOptionsAvere = {
            columnVirtualizationThreshold: 100,
            showGridFooter: false,
            showColumnFooter: true,
            minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
            enableFiltering: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [],
            data: [],
            onRegisterApi: function (gridApi) {
                balanceService.gridOptionsAvere.gridApi = gridApi;
                balanceService.gridOptionsAvere.gridApi.core.handleWindowResize();
            }
        }

        balanceService.loadBalance = function () {
            var dto = {};
            dto.id_db = dataService.data.idDb;
            return $http.post($strings.REST.SERVER + '/saldo', dto).then(function (resp) {                    
                const pivotData = parseResponse(resp.data);

                // Reinizializza la griglia con i nuovi dati e colonne
                balanceService.initializeGrid(pivotData);

                // Forza il ridimensionamento della griglia
                if (balanceService.gridOptionsBalance.gridApi) {
                    balanceService.gridOptionsBalance.gridApi.core.handleWindowResize();
                }
                return $http.post($strings.REST.SERVER + '/dare_avere', dto).then(function (resp) {
                    const pivotData = parseResponseDareAvere(resp.data);

                    // Reinizializza la griglia con i nuovi dati e colonne
                    balanceService.initializeGridDareAvere(pivotData);

                    // Forza il ridimensionamento della griglia
                    if (balanceService.gridOptionsAvere.gridApi) {
                        balanceService.gridOptionsAvere.gridApi.core.handleWindowResize();
                    }
                });
            });
        }

        balanceService.initializeGrid = function (pivotData) {
            // Genera nuove colonne dinamiche
            const dynamicColumns = generateContoColumns();
            
            // Aggiungi le colonne dinamiche alle colonne esistenti
            balanceService.gridOptionsBalance.columnDefs = [{
                name: 'conto',
                displayName: 'CONTO',
                field: 'conto',
                width: '*'
            }].concat(dynamicColumns).concat({
                name: 'totale',
                displayName: 'TOTALE',
                field: 'totale',
                width: '15%',
                cellClass: 'text-right',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents text-right" >{{col.getAggregationValue() | number:2 }} €</div>',
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            });
        
            // Forza l'aggiornamento della griglia
            if (balanceService.gridOptionsBalance.gridApi) {
                balanceService.gridOptionsBalance.gridApi.core.notifyDataChange('column');
            }
        
            // Imposta i dati aggiornati
            balanceService.gridOptionsBalance.data = pivotData || balanceService.gridOptionsBalance.data;
        }
        balanceService.initializeGridDareAvere = function (pivotData) {
            // Genera nuove colonne dinamiche
            const dynamicColumns = generateColumnsDareAvere();
            
            // Aggiungi le colonne dinamiche alle colonne esistenti
            balanceService.gridOptionsAvere.columnDefs = [{
                field: 'beneficiario',
                displayName: 'DA/A',
                width: '14%'
            }, {
                field: 'info',
                displayName: 'INFO',
                width: '*'
            }, {
                field: 'anno',
                displayName: 'ANNO',
                cellClass: 'text-center',
                width: '7%'
            }, {
                field: 'mese',
                displayName: 'MESE',
                cellClass: 'text-center',
                width: '7%',
            }].concat(dynamicColumns);
        
            // Forza l'aggiornamento della griglia
            if (balanceService.gridOptionsAvere.gridApi) {
                balanceService.gridOptionsAvere.gridApi.core.notifyDataChange('column');
            }
        
            // Imposta i dati aggiornati
            balanceService.gridOptionsAvere.data = pivotData || balanceService.gridOptionsAvere.data;
        }
        
        return balanceService;
    }]);
})();