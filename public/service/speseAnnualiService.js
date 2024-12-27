(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {

        var srvc = {
            getClass: function (perc) {
                if (perc > 5) {
                    return 'red';
                }
                return 'text-right';
            },
            generateYearColumns: function () {
                var columns = [];
                var currentYear = new Date().getFullYear();
                var startYear = currentYear - 8; // 10 anni fa
                var endYear = currentYear + 1; // Anno successivo

                for (var year = startYear; year <= endYear; year++) {
                    columns.push({
                        name: year.toString(),
                        displayName: year.toString(),
                        field: year.toString(),
                        width: '7%',
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            var diffField = `${year - 1}-${year}`;
                            return srvc.getClass(row.entity[diffField]);
                        },
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        footerCellTemplate: '<div class="ui-grid-cell-contents text-right" >Total: {{col.getAggregationValue() | number:2 }} €</div>'
                    });
                }

                return columns;
            },
            gridSpeseAnnuali: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [
                    {
                        name: 'AMBITO',
                        displayName: 'AMBITO',
                        field: 'ambito',
                        width: '10%',
                        pinnedLeft: true
                    },
                    {
                        name: 'CATEGORIA',
                        displayName: 'CATEGORIA',
                        field: 'categoria',
                        width: '10%',
                        pinnedLeft: true
                    },
                    {
                        name: 'SOTTOCATEGORIA',
                        displayName: 'SOTTOCATEGORIA',
                        field: 'sottocategoria',
                        width: '10%',
                        pinnedLeft: true
                    }
                ].concat([]), // Placeholder per le colonne dinamiche
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridSpeseAnnuali.gridApi = gridApi;
                    srvc.gridSpeseAnnuali.gridApi.core.handleWindowResize();
                }
            },
            loadSpeseAnnue: function (pivot) {
                var dto = {};
                dto.conto = pivot.conto;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/spese_annue', dto).then(function (resp) {
                    srvc.gridSpeseAnnuali.data = resp.data;
                });
            },
            initializeGrid: function () {
                // Aggiorna le colonne dinamicamente
                srvc.gridSpeseAnnuali.columnDefs = srvc.gridSpeseAnnuali.columnDefs.concat(srvc.generateYearColumns());
            }
        };

        // Inizializza la griglia al caricamento del servizio
        srvc.initializeGrid();

        return srvc;
    }]);
})();