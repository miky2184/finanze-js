(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', '$rootScope', '$timeout', function (modalService, $http, $interval, $strings, uiGridConstants, dataService, $rootScope, $timeout) {
        var scope = $rootScope.$new();
        var pivotDataPieBudget = [];
        var afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            dataService.data.dirty = true;
            rowEntity.dirty = true;
            var newSett = {};
            var oldSett = {};
            switch (colDef.name) {
                case 'ambito':
                    newSett = dataService.data.dropdownAmbito.filter(function (a) {
                        return a[colDef.name] === newValue;
                    })[0];
                    oldSett = dataService.data.dropdownAmbito.filter(function (a) {
                        return a[colDef.name] === oldValue;
                    })[0];
                    rowEntity.categoria = null;
                    rowEntity.sottocategoria = null;
                    break;
                case 'categoria':
                    newSett = dataService.data.dropdownCategoria.filter(function (a) {
                        return a[colDef.name] === newValue;
                    })[0];
                    oldSett = dataService.data.dropdownCategoria.filter(function (a) {
                        return a[colDef.name] === oldValue;
                    })[0];
                    rowEntity.sottocategoria = null;
                    break;
                case 'sottocategoria':
                    newSett = dataService.data.dropdownSottocategoria.filter(function (a) {
                        return a[colDef.name] === newValue;
                    })[0];
                    oldSett = dataService.data.dropdownSottocategoria.filter(function (a) {
                        return a[colDef.name] === oldValue;
                    })[0];
                    break;
                default:
                    break;
            }
            if (newSett) {
                newSett.used = newSett.used + 1;
            }
            if (oldSett) {
                oldSett.used += -1;
            }
        };

        var srvc = {
            dataGraficoPieBudget: function dataGraficoPieBudget() {
                return pivotDataPieBudget;
            },
            getClass: function (row_entity, attr, col) {
                if (row_entity[attr] > 100) {
                    return 'red';
                } else if (col.field.toLowerCase().startsWith('budg')){
                    return 'budget-col';
                } else {
                    return 'text-right';
                }
            },
            getMonthClass: function(row_entity, col, month_number) {
                var currentMonth = new Date().getMonth() + 1;

                if (currentMonth == month_number && row_entity[col.name] < 0 && Math.abs(row_entity[col.name]) > row_entity['budg_'+col.name]){
                    return 'red';
                }                
            },
            gridDefBudget: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableFiltering: true,
                enableRowSelection: true,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                        name: 'mese',
                        displayName: 'MESE',
                        field: 'mese',
                        width: '10%',
                        type: 'number',
                        cellClass: 'text-right',
                        filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                                placeholder: 'greater than'
                            },
                            {
                                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                                placeholder: 'less than'
                            }
                        ]
                    },
                    {
                        name: 'ambito',
                        displayName: 'AMBITO',
                        field: 'ambito',
                        width: '20%',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        editDropdownIdLabel: 'ambito',
                        editDropdownValueLabel: 'label',
                        cellFilter: 'griddropdown:this',
                        editDropdownOptionsFunction: function (rowEntity, colDef) {
                            return dataService.data.dropdownAmbito.filter(function (a) {
                                return !a.deleted;
                            });
                        },
                        filter: {
                            placeholder: 'like',
                            condition: function (searchTerm, cellValue, row, column) {
                                if (dataService.data.dropdownAmbito) {
                                    if (searchTerm != 'null') {
                                        var cell = dataService.data.dropdownAmbito.filter(function (ambito) {
                                            return ambito.ambito === cellValue;
                                        });
                                        if (cell && cell.length > 0) {
                                            return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return cellValue == null || cellValue == 0;
                                    }
                                }
                            }
                        }
                    }, {
                        name: 'categoria',
                        displayName: 'CATEGORIA',
                        field: 'categoria',
                        width: '20%',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        editDropdownIdLabel: 'categoria',
                        editDropdownValueLabel: 'label',
                        cellFilter: 'griddropdown:this',
                        editDropdownOptionsFunction: function (rowEntity, colDef) {
                            if (rowEntity.ambito) {
                                return dataService.data.dropdownCategoria.filter(function (obj) {
                                    return obj.ambito === rowEntity.ambito && !obj.deleted;
                                });
                            }
                            return [];
                        },
                        filter: {
                            placeholder: 'like',
                            condition: function (searchTerm, cellValue, row, column) {
                                if (dataService.data.dropdownCategoria) {
                                    if (searchTerm != 'null') {
                                        var cell = dataService.data.dropdownCategoria.filter(function (categoria) {
                                            return categoria.categoria === cellValue;
                                        });
                                        if (cell && cell.length > 0) {
                                            return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return cellValue == null || cellValue == 0;
                                    }
                                }
                            }
                        }
                    }, {
                        name: 'sottocategoria',
                        displayName: 'SOTTOCATEGORIA',
                        field: 'sottocategoria',
                        width: '20%',
                        editableCellTemplate: 'ui-grid/dropdownEditor',
                        editDropdownIdLabel: 'sottocategoria',
                        editDropdownValueLabel: 'label',
                        cellFilter: 'griddropdown:this',
                        editDropdownOptionsFunction: function (rowEntity, colDef) {
                            if (rowEntity.categoria) {
                                return dataService.data.dropdownSottocategoria.filter(function (obj) {
                                    return obj.categoria === rowEntity.categoria && !obj.deleted;
                                });
                            }
                            return [];
                        },
                        filter: {
                            placeholder: 'like',
                            condition: function (searchTerm, cellValue, row, column) {
                                if (dataService.data.dropdownSottocategoria) {
                                    if (searchTerm != 'null') {
                                        var cell = dataService.data.dropdownSottocategoria.filter(function (sottocategoria) {
                                            return sottocategoria.sottocategoria === cellValue;
                                        });
                                        if (cell && cell.length > 0) {
                                            return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return cellValue == null || cellValue == 0;
                                    }
                                }
                            }
                        }
                    }, {
                        name: 'budget',
                        displayName: 'BUDGET',
                        field: 'budget',
                        width: '*',
                        type: 'number',
                        cellClass: 'text-right',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        filters: [{
                                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                                placeholder: 'greater than'
                            },
                            {
                                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                                placeholder: 'less than'
                            }
                        ]
                    }
                ],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridDefBudget.gridApi = gridApi;
                    srvc.gridDefBudget.gridApi.core.handleWindowResize();
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridBudget: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                        name: 'ambito',
                        displayName: 'AMBITO',
                        field: 'ambito',
                        width: '4%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        }
                    }, {
                        name: 'categoria',
                        displayName: 'CATEGORIA',
                        field: 'categoria',
                        width: '8%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        }
                    }, {
                        name: 'sottocategoria',
                        displayName: 'SOTTOCATEGORIA',
                        field: 'sottocategoria',
                        width: '8%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        }
                    },
                    {
                        name: 'perc_budg',
                        displayName: '%',
                        field: 'perc_budg',
                        width: '3%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                             
                            if (row.entity['stato_spesa'] == 0) {
                                return 'green';
                            } else if (row.entity['stato_spesa'] == 1){
                                return 'text-right';
                            } else if (row.entity['stato_spesa'] == 2){
                                return 'yellow';
                            } else if (row.entity['stato_spesa'] == 3){
                                return 'orange';
                            } else if (row.entity['stato_spesa'] == 4){
                                return 'red';
                            }

                            //return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        type: 'number'
                    },
                    {
                        name: 'budg_tot_anno',
                        displayName: 'BUDGET ANNO',
                        field: 'budg_tot_anno',
                        width: '6%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number'
                    },
                    {
                        name: 'tot_anno',
                        displayName: 'SPESO ANNO',
                        field: 'tot_anno',
                        width: '6%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_gen',
                        displayName: 'BUDGET GEN',
                        field: 'budg_gen',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'gen',
                        displayName: 'GEN',
                        field: 'gen',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 1) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_feb',
                        displayName: 'BUDGET FEB',
                        field: 'budg_feb',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'feb',
                        displayName: 'FEB',
                        field: 'feb',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 2) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_mar',
                        displayName: 'BUDGET MAR',
                        field: 'budg_mar',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'mar',
                        displayName: 'MAR',
                        field: 'mar',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 3) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_apr',
                        displayName: 'BUDGET APR',
                        field: 'budg_apr',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'apr',
                        displayName: 'APR',
                        field: 'apr',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 4) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_mag',
                        displayName: 'BUDGET MAG',
                        field: 'budg_mag',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'mag',
                        displayName: 'MAG',
                        field: 'mag',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 5) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_giu',
                        displayName: 'BUDGET GIU',
                        field: 'budg_giu',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'giu',
                        displayName: 'GIU',
                        field: 'giu',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 6) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_lug',
                        displayName: 'BUDGET LUG',
                        field: 'budg_lug',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'lug',
                        displayName: 'LUG',
                        field: 'lug',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 7) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_ago',
                        displayName: 'BUDGET AGO',
                        field: 'budg_ago',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'ago',
                        displayName: 'AGO',
                        field: 'ago',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 8) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_sett',
                        displayName: 'BUDGET SETT',
                        field: 'budg_sett',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'sett',
                        displayName: 'SETT',
                        field: 'sett',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 9) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_ott',
                        displayName: 'BUDGET OTT',
                        field: 'budg_ott',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'ott',
                        displayName: 'OTT',
                        field: 'ott',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 10) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_nov',
                        displayName: 'BUDGET NOV',
                        field: 'budg_nov',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'nov',
                        displayName: 'NOV',
                        field: 'nov',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 11) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'budg_dic',
                        displayName: 'BUDGET DIC',
                        field: 'budg_dic',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }, {
                        name: 'dic',
                        displayName: 'DIC',
                        field: 'dic',
                        width: '5%',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return srvc.getMonthClass(row.entity, col, 12) || srvc.getClass(row.entity, 'perc_budg', col);
                        },
                        footerCellFilter: 'currency',
                        cellFilter: 'currency',
                        type: 'number',
                        aggregationType: uiGridConstants.aggregationTypes.sum
                    }
                ],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridBudget.gridApi = gridApi;
                    srvc.gridBudget.gridApi.core.handleWindowResize();
                }
            },
            loadBudget: function (pivot) {
                var dto = {};
                dto.conto = pivot.conto;
                dto.anno = pivot.year;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/budget', dto).then(function (resp) {                    
                    srvc.gridBudget.data = resp.data;
                                         
                    srvc.gridBudget.gridApi.grid.columns[6].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[8].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[10].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[12].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[14].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[16].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[18].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[20].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[22].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[24].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[26].hideColumn();
                    srvc.gridBudget.gridApi.grid.columns[28].hideColumn();

                    const monthIndexMap = {
                        0: 6,   // Gennaio
                        1: 8,   // Febbraio
                        2: 10,  // Marzo
                        3: 12,  // Aprile
                        4: 14,  // Maggio
                        5: 16,  // Giugno
                        6: 18,  // Luglio
                        7: 20,  // Agosto
                        8: 22,  // Settembre
                        9: 24,  // Ottobre
                        10: 26, // Novembre
                        11: 28  // Dicembre
                      };

                    var currentMonth = new Date().getMonth();

                    if (pivot.year > new Date().getFullYear()){
                        currentMonth = 0;
                    }

                    if (pivot.year < new Date().getFullYear()){
                        currentMonth = 11;
                    }

                    var desiredIndex = monthIndexMap[currentMonth];
                    
                    srvc.gridBudget.gridApi.grid.columns[desiredIndex].showColumn();

                    srvc.gridBudget.gridApi.grid.notifyDataChange(uiGridConstants.dataChange.COLUMN);


                });
            },
            loadDefBudget: function (pivot) {
                var dto = {};
                dto.conto = (pivot || $strings.PIVOT).conto;
                dto.anno = (pivot || $strings.PIVOT).year;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/definizione_budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        resp.data.forEach(function (row) {
                            row['budget'] = Number(row['budget']);
                            row['mese'] = Number(row['mese']);
                        });
                        srvc.gridDefBudget.data = resp.data;
                        dataService.data.backupDataDefBudget = angular.copy(resp.data);
                        srvc.gridDefBudget.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownAmbito;
                        srvc.gridDefBudget.columnDefs[2].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                        srvc.gridDefBudget.columnDefs[3].editDropdownOptionsArray = dataService.data.dropdownSottocategoria;
                    } else {
                        srvc.gridDefBudget.data = [];
                    }
                });
            },
            copyBudget: function(pivot){
                var dto = {};
                dto.conto = (pivot || $strings.PIVOT).conto;
                dto.anno = (pivot || $strings.PIVOT).year;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/copy_budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        return resp.data;
                    }
                });
            },
            loadGraficoBudget: function (pivot) {
                dataService.data.optionsGraficoPieBudget = {
                    chart: {
                        type: 'pieChart',
                        height: null,
                        showLabels: true,
                        showLegend: false,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function (d) {
                            return d.key;
                        },
                        y: function (d) {
                            return d.y;
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
                dto.conto = (pivot || $strings.PIVOT).conto;
                dto.anno = (pivot || $strings.PIVOT).year;
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/budget_annuo', dto).then(function (resp) {
                    pivotDataPieBudget = resp.data;
                    dataService.data.dataGraficoPieBudget = srvc.dataGraficoPieBudget();
                });
            }
        };
        return srvc;
    }]);
})();