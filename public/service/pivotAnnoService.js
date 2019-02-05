(function () {
    'use strict';
    angular.module('myApp').factory('pivotAnnoService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', '$timeout', 'utilService', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService, $timeout, utilService) {        
        var srvc = {
            gridOptionPivotAnno: {
            columnVirtualizationThreshold: 100,
            showColumnFooter: true,
            minRowsToShow: 23,
            enableFiltering: false,
            selectionRowHeaderWidth: 35,
            enableSorting: false,
            enableColumnMenus: false,
            columnDefs: [{
                name: 'ambito',
                displayName: 'Ambito',
                field: 'ambito',
                width: '10%'
            }, {
                name: 'categoria',
                displayName: 'Categoria',
                field: 'categoria',
                width: '10%'
            }, {
                name: 'sottocategoria',
                displayName: 'Sottocategoria',
                field: 'sottocategoria',
                width: '10%'
            }, {
                name: '1',
                displayName: 'GENNAIO',
                field: '1',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '2',
                displayName: 'FEBBRAIO',
                field: '2',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '3',
                displayName: 'MARZO',
                field: '3',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '4',
                displayName: 'APRILE',
                field: '4',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '5',
                displayName: 'MAGGIO',
                field: '5',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '6',
                displayName: 'GIUGNO',
                field: '6',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '7',
                displayName: 'LUGLIO',
                field: '7',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '8',
                displayName: 'AGOSTO',
                field: '8',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '9',
                displayName: 'SETTEMBRE',
                field: '9',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '10',
                displayName: 'OTTOBRE',
                field: '10',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '11',
                displayName: 'NOVEMBRE',
                field: '11',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: '12',
                displayName: 'DICEMBRE',
                field: '12',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }],
            data: [],
            onRegisterApi: function (gridApi) {
                srvc.gridOptionPivotAnno.gridApi = gridApi;
                $timeout(function () {
                    srvc.gridOptionPivotAnno.gridApi.treeBase.expandAllRows();
                }, 250);
            }
        },
        loadPivotAnno : function (year, tipoConto) {
            var balanceData = angular.copy(listaMovimentiService.gridOptions.data).filter(function (obj) {
                return obj.anno === year && obj.tipoConto === tipoConto && obj.contabilizzata;
            });
            var pivotData = [];
            balanceData = utilService.sortByKey(balanceData, 'sottocategoria');
            balanceData = utilService.sortByKey(balanceData, 'categoria');
            balanceData = utilService.sortByKey(balanceData, 'ambito');
            var ambitoData = [];
            dataService.data.dropdownAmbito.forEach(function (ambito) {
                var obj = {
                    'idAmb': ambito.ambito,
                    'ambito': ambito.label,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0,
                    '10': 0,
                    '11': 0,
                    '12': 0,
                    '$$treeLevel': 0
                };
                for (var x = 0; x < balanceData.length; x++) {
                    if (balanceData[x].ambito === ambito.ambito) {
                        switch (balanceData[x].mese) {
                            case 1:
                                obj['1'] = obj['1'] + balanceData[x].importo;
                                break;
                            case 2:
                                obj['2'] = obj['2'] + balanceData[x].importo;
                                break;
                            case 3:
                                obj['3'] = obj['3'] + balanceData[x].importo;
                                break;
                            case 4:
                                obj['4'] = obj['4'] + balanceData[x].importo;
                                break;
                            case 5:
                                obj['5'] = obj['5'] + balanceData[x].importo;
                                break;
                            case 6:
                                obj['6'] = obj['6'] + balanceData[x].importo;
                                break;
                            case 7:
                                obj['7'] = obj['7'] + balanceData[x].importo;
                                break;
                            case 8:
                                obj['8'] = obj['8'] + balanceData[x].importo;
                                break;
                            case 9:
                                obj['9'] = obj['9'] + balanceData[x].importo;
                                break;
                            case 10:
                                obj['10'] = obj['10'] + balanceData[x].importo;
                                break;
                            case 11:
                                obj['11'] = obj['11'] + balanceData[x].importo;
                                break;
                            case 12:
                                obj['12'] = obj['12'] + balanceData[x].importo;
                                break;
                            default:
                        }
                    }
                }
                ambitoData.push(obj);
            });
            balanceData = utilService.sortByKey(balanceData, 'sottocategoria');
            balanceData = utilService.sortByKey(balanceData, 'categoria');
            var categoryData = [];
            angular.copy(dataService.data.dropdownCategoria).forEach(function (categoria) {
                var obj = {
                    'idCat': categoria.categoria,
                    'categoria': categoria.label,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0,
                    '10': 0,
                    '11': 0,
                    '12': 0,
                    '$$treeLevel': 1
                };
                for (var x = 0; x < balanceData.length; x++) {
                    if (balanceData[x].ambito === categoria.ambito && balanceData[x].categoria === categoria.categoria) {
                        obj.idAmb = balanceData[x].ambito;
                        switch (balanceData[x].mese) {
                            case 1:
                                obj['1'] = obj['1'] + balanceData[x].importo;
                                break;
                            case 2:
                                obj['2'] = obj['2'] + balanceData[x].importo;
                                break;
                            case 3:
                                obj['3'] = obj['3'] + balanceData[x].importo;
                                break;
                            case 4:
                                obj['4'] = obj['4'] + balanceData[x].importo;
                                break;
                            case 5:
                                obj['5'] = obj['5'] + balanceData[x].importo;
                                break;
                            case 6:
                                obj['6'] = obj['6'] + balanceData[x].importo;
                                break;
                            case 7:
                                obj['7'] = obj['7'] + balanceData[x].importo;
                                break;
                            case 8:
                                obj['8'] = obj['8'] + balanceData[x].importo;
                                break;
                            case 9:
                                obj['9'] = obj['9'] + balanceData[x].importo;
                                break;
                            case 10:
                                obj['10'] = obj['10'] + balanceData[x].importo;
                                break;
                            case 11:
                                obj['11'] = obj['11'] + balanceData[x].importo;
                                break;
                            case 12:
                                obj['12'] = obj['12'] + balanceData[x].importo;
                                break;
                            default:
                        }
                    }
                }
                categoryData.push(obj);
            });
            categoryData = categoryData.filter(function (cat) {
                return cat.idAmb;
            });
            categoryData = utilService.sortByKey(categoryData, 'idAmb');
            balanceData = utilService.sortByKey(balanceData, 'sottocategoria');
            var sottocategoryData = [];
            dataService.data.dropdownSottocategoria.forEach(function (sottocategoria) {
                var obj = {
                    'idSott': sottocategoria.sottocategoria,
                    'sottocategoria': sottocategoria.label,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0,
                    '10': 0,
                    '11': 0,
                    '12': 0
                };
                for (var x = 0; x < balanceData.length; x++) {
                    if (balanceData[x].categoria === sottocategoria.categoria && balanceData[x].sottocategoria === sottocategoria.sottocategoria) {
                        obj.idAmb = balanceData[x].ambito;
                        obj.idCat = balanceData[x].categoria;
                        switch (balanceData[x].mese) {
                            case 1:
                                obj['1'] = obj['1'] + balanceData[x].importo;
                                break;
                            case 2:
                                obj['2'] = obj['2'] + balanceData[x].importo;
                                break;
                            case 3:
                                obj['3'] = obj['3'] + balanceData[x].importo;
                                break;
                            case 4:
                                obj['4'] = obj['4'] + balanceData[x].importo;
                                break;
                            case 5:
                                obj['5'] = obj['5'] + balanceData[x].importo;
                                break;
                            case 6:
                                obj['6'] = obj['6'] + balanceData[x].importo;
                                break;
                            case 7:
                                obj['7'] = obj['7'] + balanceData[x].importo;
                                break;
                            case 8:
                                obj['8'] = obj['8'] + balanceData[x].importo;
                                break;
                            case 9:
                                obj['9'] = obj['9'] + balanceData[x].importo;
                                break;
                            case 10:
                                obj['10'] = obj['10'] + balanceData[x].importo;
                                break;
                            case 11:
                                obj['11'] = obj['11'] + balanceData[x].importo;
                                break;
                            case 12:
                                obj['12'] = obj['12'] + balanceData[x].importo;
                                break;
                            default:
                        }
                    }
                }
                sottocategoryData.push(obj);
            });
            sottocategoryData = sottocategoryData.filter(function (sott) {
                return sott.idCat;
            });
            sottocategoryData = utilService.sortByKey(sottocategoryData, 'idCat');
            var tmpAmbId;
            var tmpCatId;
            var removeDuplicates = function removeDuplicates(arr, key) {
                if (!(arr instanceof Array) || key && typeof key !== 'string') {
                    return false;
                }
                if (key && typeof key === 'string') {
                    return arr.filter((obj, index, arr) => {
                        return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
                    });
                } else {
                    return arr.filter(function (item, index, arr) {
                        return arr.indexOf(item) == index;
                    });
                }
            };
            var tmpData = [];
            for (var x = 0; x < ambitoData.length; x++) {
                tmpAmbId = ambitoData[x].idAmb;
                pivotData.push(ambitoData[x]);
                for (var y = 0; y < categoryData.length; y++) {
                    tmpCatId = categoryData[y].idCat;
                    if (tmpAmbId === categoryData[y].idAmb) {
                        pivotData.push(categoryData[y]);
                        for (var z = 0; z < sottocategoryData.length; z++) {
                            if (tmpCatId === sottocategoryData[z].idCat) {
                                pivotData.push(sottocategoryData[z]);
                            }
                        }
                    }
                }
            }
            pivotData.shift();
            srvc.gridOptionPivotAnno.data = pivotData;
            $interval(srvc.gridOptionPivotAnno.gridApi.core.handleWindowResize, 100, 10);
            $timeout(function () {
                srvc.gridOptionPivotAnno.gridApi.treeBase.expandAllRows();
            }, 250);
        }
        };
        return srvc;
    }]);
})();
