(function () {
    'use strict';
    angular.module('myApp').factory('speseAnnualiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {
        
        var srvc = {
            gridSpeseAnnuali: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                    name: 'IDAMB',
                    displayName: 'ID AMB',
                    field: 'IDAMB',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'IDCAT',
                    displayName: 'ID CAT',
                    field: 'IDCAT',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'IDSOT',
                    displayName: 'ID SOT',
                    field: 'IDSOT',
                    width: 80,
                    pinnedLeft: true
                }, {
                    name: 'AMBITO',
                    displayName: 'Ambito',
                    field: 'AMBITO',
                    width: 120,
                    pinnedLeft: true
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'CATEGORIA',
                    width: 165,
                    pinnedLeft: true
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'SOTTOCATEGORIA',
                    width: '*',
                    pinnedLeft: true
                }, {
                    name: 'TOTALE_2015',
                    displayName: '2015',
                    field: 'TOTALE_2015',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'TOTALE_2016',
                    displayName: '2016',
                    field: 'TOTALE_2016',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2017',
                    displayName: '2017',
                    field: 'TOTALE_2017',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2018',
                    displayName: '2018',
                    field: 'TOTALE_2018',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2019',
                    displayName: '2019',
                    field: 'TOTALE_2019',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },{
                    name: 'TOTALE_2020',
                    displayName: '2020',
                    field: 'TOTALE_2020',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: 'text-right',
                    aggregationType: uiGridConstants.aggregationTypes.sum
                },],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridSpeseAnnuali.gridApi = gridApi;
                    srvc.gridSpeseAnnuali.gridApi.core.handleWindowResize(); 
                }
            },
            loadSpeseAnnue: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoConto;
                return $http.post($strings.REST.SERVER + '/speseAnnue', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridSpeseAnnuali.data = resp.data;
                    }
                });
            }
        };
        return srvc;
    }]);
})();
