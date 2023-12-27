(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', '$rootScope', function (modalService, $http, $interval, $strings, uiGridConstants, dataService, $rootScope) {
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
            dataGraficoPieBudget : function dataGraficoPieBudget(){
                return pivotDataPieBudget;
            },
            getPerc: function(r, attr, rim){
                if (r[attr] !== null && r[attr] !== 0) {
                    if (r[rim] >= $strings.BUDGET.GREEN) {
                        return 'green';
                    } else if (r[rim] < $strings.BUDGET.GREEN && r[rim] >= $strings.BUDGET.YELLOW) {
                        return 'yellow';
                    } else if (r[rim] < $strings.BUDGET.YELLOW && r[rim] > $strings.BUDGET.ORANGE) {
                        return 'orange';
                    } else {
                        return 'red';
                    }
                } else {
                    return 'text-right';
                }
            },
            gridDefBudget: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 23,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [
                    {
                        name: 'mese',
                        displayName: 'Mese', 
                        field: 'mese',  
                        width: '10%',
                        type: 'number', 
                        cellClass: 'text-right',
                        filters: [
                            {
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
                    displayName: 'Ambito',
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
                                if (searchTerm != 'null'){
                                var cell = dataService.data.dropdownAmbito.filter(function (ambito) {
                                    return ambito.ambito === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                } } else {
                                    return cellValue == null || cellValue == 0;             
                                }
                            }
                        }
                    }
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
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
                                if (searchTerm != 'null'){
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
                    displayName: 'Sottocategoria',
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
                                if (searchTerm != 'null'){
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
                },{
                    name: 'budget',
                    displayName: 'Budget', 
                    field: 'budget',  
                    width: '*',
                    type: 'number', 
                    cellClass: 'text-right', 
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    filters: [
                        {
                        condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                        placeholder: 'greater than'
                        },
                        {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'less than'
                        }
                    ]}                    
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
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                    name: 'ambito',
                    displayName: 'Ambito',
                    field: 'ambito',
                    width: '5%',
                    pinnedLeft: true
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    width: '8%',
                    pinnedLeft: true
                }, {
                    name: 'sottocategoria',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    width: '8%',
                    pinnedLeft: true
                },
                {
                    name: 'perc_budg',
                    displayName: '%',
                    field: 'perc_budg',
                    width: '2%',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    pinnedLeft: true
                },
                {
                    name: 'budg_tot_anno',
                    displayName: 'Budget Anno',
                    field: 'budg_tot_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity, 'tot_anno', 'perc_rim_anno');                        
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    pinnedLeft: true
                },
                {
                    name: 'tot_anno',
                    displayName: 'Spese Anno',
                    field: 'tot_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity, 'tot_anno', 'perc_rim_anno');
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    pinnedLeft: true
                }, {
                    name: 'prev_fino_anno',
                    displayName: 'Prev. Fine Anno',
                    field: 'prev_fino_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return srvc.getPerc(row.entity, 'tot_anno', 'perc_rim_anno');
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    pinnedLeft: true
                },{
                    name: 'budg_gen',
                    displayName: 'Budget GEN',
                    field: 'budg_gen',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['gen'] !== null && row.entity['gen'] !== 0 || 1 < n) {
                            return srvc.getPerc(row.entity, 'gen', 'perc_rim_gen');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'gen',
                    displayName: 'Spese GEN',
                    field: 'gen',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['gen'] !== null && row.entity['gen'] !== 0 || 1 < n) {
                            return srvc.getPerc(row.entity, 'gen', 'perc_rim_gen');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_feb',
                    displayName: 'Budget FEB',
                    field: 'budg_feb',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['feb'] !== null && row.entity['feb'] !== 0 || 2 < n) {
                            return srvc.getPerc(row.entity, 'feb', 'perc_rim_feb');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'feb',
                    displayName: 'Spese FEB',
                    field: 'feb',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['feb'] !== null && row.entity['feb'] !== 0 || 2 < n) {
                            return srvc.getPerc(row.entity, 'feb', 'perc_rim_feb');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_mar',
                    displayName: 'Budget MAR',
                    field: 'budg_mar',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            return srvc.getPerc(row.entity, 'mar', 'perc_rim_mar');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'mar',
                    displayName: 'Spese MAR',
                    field: 'mar',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            return srvc.getPerc(row.entity, 'mar', 'perc_rim_mar');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_apr',
                    displayName: 'Budget APR',
                    field: 'budg_apr',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            return srvc.getPerc(row.entity, 'apr', 'perc_rim_apr');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'apr',
                    displayName: 'Spese APR',
                    field: 'apr',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            return srvc.getPerc(row.entity, 'apr', 'perc_rim_apr');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_mag',
                    displayName: 'Budget MAG',
                    field: 'budg_mag',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['tot_anno'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            return srvc.getPerc(row.entity, 'mag', 'perc_rim_mag');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'mag',
                    displayName: 'Spese MAG',
                    field: 'mag',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mag'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            return srvc.getPerc(row.entity, 'mag', 'perc_rim_mag');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_giu',
                    displayName: 'Budget GIU',
                    field: 'budg_giu',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            return srvc.getPerc(row.entity, 'giu', 'perc_rim_giu');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'giu',
                    displayName: 'Spese GIU',
                    field: 'giu',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            return srvc.getPerc(row.entity, 'giu', 'perc_rim_giu');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_lug',
                    displayName: 'Budget LUG',
                    field: 'budg_lug',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            return srvc.getPerc(row.entity, 'lug', 'perc_rim_lug');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'lug',
                    displayName: 'Spese LUG',
                    field: 'lug',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            return srvc.getPerc(row.entity, 'lug', 'perc_rim_lug');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_ago',
                    displayName: 'Budget AGO',
                    field: 'budg_ago',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            return srvc.getPerc(row.entity, 'ago', 'perc_rim_ago');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'ago',
                    displayName: 'Spese AGO',
                    field: 'ago',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            return srvc.getPerc(row.entity, 'ago', 'perc_rim_ago');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_sett',
                    displayName: 'Budget SETT',
                    field: 'budg_sett',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            return srvc.getPerc(row.entity, 'sett', 'perc_rim_sett');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'sett',
                    displayName: 'Spese SETT',
                    field: 'sett',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            return srvc.getPerc(row.entity, 'sett', 'perc_rim_sett');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_ott',
                    displayName: 'Budget OTT',
                    field: 'budg_ott',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            return srvc.getPerc(row.entity, 'ott', 'perc_rim_ott');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'ott',
                    displayName: 'Spese OTT',
                    field: 'ott',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            return srvc.getPerc(row.entity, 'ott', 'perc_rim_ott');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_nov',
                    displayName: 'Budget NOV',
                    field: 'budg_nov',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            return srvc.getPerc(row.entity, 'nov', 'perc_rim_nov');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'nov',
                    displayName: 'Spese NOV',
                    field: 'nov',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            return srvc.getPerc(row.entity, 'nov', 'perc_rim_nov');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_dic',
                    displayName: 'Budget DIC',
                    field: 'budg_dic',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            return srvc.getPerc(row.entity, 'dic', 'perc_rim_dic');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'dic',
                    displayName: 'Spese DIC',
                    field: 'dic',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            return srvc.getPerc(row.entity, 'dic', 'perc_rim_dic');
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridBudget.gridApi = gridApi;
                    srvc.gridBudget.gridApi.core.handleWindowResize();
                }
            },
            loadBudget: function (pivot) {
                var dto = {};
                dto.tipo_conto = pivot.tipo_conto;
                dto.anno = pivot.year;
                return $http.post($strings.REST.SERVER + '/budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridBudget.data = resp.data;
                    }
                });
            },
            loadDefBudget: function(pivot){
                var dto = {};
                dto.tipo_conto = (pivot || $strings.PIVOT).tipo_conto;
                dto.anno = (pivot || $strings.PIVOT).year;
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
            loadGraficoBudget: function(pivot){
                dataService.data.optionsGraficoPieBudget = {                    
                    chart: {
                        type: 'pieChart',                        
                        showLabels: true,
                        duration: 5,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
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
                dto.tipo_conto = (pivot || $strings.PIVOT).tipo_conto;
                dto.anno = (pivot || $strings.PIVOT).year;
                return $http.post($strings.REST.SERVER + '/budget_annuo', dto).then(function (resp) {
                    pivotDataPieBudget = resp.data;
                    dataService.data.dataGraficoPieBudget = srvc.dataGraficoPieBudget();
                });
            }
        };
        return srvc;
    }]);
})();
