(function () {
    'use strict';
    angular.module('myApp').factory('reportMeseService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', function (modalService, $http, $interval, $strings, uiGridConstants) {
        var srvc = {
            gridReportMese: {
                columnVirtualizationThreshold: 100,
                minRowsToShow: 23,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                showColumnFooter: true,
                columnDefs: [{
                    name: 'DESC_AMB',
                    displayName: 'Ambito',
                    field: 'DESC_AMB',
                    width: '10%',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity.padre) {
                            return 'padre';
                        }
                    }
                }, {
                    name: 'DESC_CAT',
                    displayName: 'Categoria',
                    field: 'DESC_CAT',
                    width: '10%',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity.padre) {
                            return 'padre';
                        }
                    }
                }, {
                    name: 'DESC_SOT',
                    displayName: 'Sottocategoria',
                    field: 'DESC_SOT',
                    width: '*',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity.padre) {
                            return 'padre';
                        }
                    }
                }, {
                    name: 'TOTALE',
                    displayName: 'TOT. MESE',
                    field: 'TOTALE',
                    width: '10%',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity.padre) {
                            return 'padre-importo';
                        }
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridReportMese.gridApi = gridApi;
                }
            },
            loadReportMese: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoConto;
                dto.mese = pivot.month;
                dto.anno = pivot.year;
                return $http.post('http://93.55.248.37:3001/reportmese', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridReportMese.data = resp.data.map(function (d) {
                            if (d['LIVELLO'] > 0) {
                                d.padre = true;
                            }
                            return d;
                        });
                        if (srvc.gridReportMese && srvc.gridReportMese.gridApi) {
                            $interval(srvc.gridReportMese.gridApi.core.handleWindowResize, 100, 10);
                        }
                    }
                });
            }
        };
        return srvc;
    }]);
})();
