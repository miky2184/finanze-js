(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', '$rootScope', function (modalService, $http, $interval, $strings, uiGridConstants, dataService, $rootScope) {
        var scope = $rootScope.$new();

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
            getPerc: function(r, attr, rim){
                if (r[attr] !== null && r[attr] !== 0) {
                    if (r[rim] >= $strings.BUDGET.GREEN) {
                        return 'green';
                    } else if (r[rim] < $strings.BUDGET.GREEN && r[rim] >= $strings.BUDGET.LIGHT_GREEN) {
                        return 'yellow';
                    } else if (r[rim] < $strings.BUDGET.LIGHT_GREEN && r[rim] >= $strings.BUDGET.YELLOW) {
                        return 'orange';
                    } else if (r[rim] < $strings.BUDGET.YELLOW && r[rim] > $strings.BUDGET.ORANGE) {
                        return 'red';
                    } else {
                        return 'text-right';
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
                columnDefs: [{name: 'nome_mese',displayName: 'Mese', field: 'nome_mese',  width: '10%',filter: {
                    condition: function (searchTerm, cellValue, row, column) {                                                            
                        if (cellValue.match(searchTerm.replaceAll('\\','').toUpperCase()) != null){
                            return true;
                        } 
                        return false;
                    }
                }},{
                    name: 'ambito',
                    displayName: 'Ambito',
                    field: 'ambito',
                    width: '10%',
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
                    width: '10%',
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
                    width: '10%',
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
                },{name: 'budget',displayName: 'Budget', field: 'budget',  width: '*',type: 'number', cellClass: 'text-right', aggregationType: uiGridConstants.aggregationTypes.sum,
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
                  ]},{name: 'mese',displayName: 'Mese', field: 'mese',  width: '10%',type: 'number', cellClass: 'text-right',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                      placeholder: 'less than'
                    }
                  ]}],
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
                    name: 'idamb',
                    displayName: 'AMB',
                    field: 'idamb',
                    width: '2%',
                    pinnedLeft: true
                }, {
                    name: 'idcat',
                    displayName: 'CAT',
                    field: 'idcat',
                    width: '2%',
                    pinnedLeft: true
                }, {
                    name: 'idsot',
                    displayName: 'SOT',
                    field: 'idsot',
                    width: '2%',
                    pinnedLeft: true
                }, {
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
                    width: '6%',
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
                    width: '6%',
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
                    width: '6%',
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
                    width: '6%',
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            if (row.entity['perc_rim_mar'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mar'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mar'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mar'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mar'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            if (row.entity['perc_rim_mar'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mar'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mar'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mar'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mar'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            if (row.entity['perc_rim_apr'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.GREEN && row.entity['perc_rim_apr'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_apr'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_apr'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['apr'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            if (row.entity['perc_rim_apr'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.GREEN && row.entity['perc_rim_apr'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_apr'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_apr'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['apr'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['tot_anno'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            if (row.entity['perc_rim_mag'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mag'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mag'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mag'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mag'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mag'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            if (row.entity['perc_rim_mag'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mag'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mag'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mag'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mag'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            if (row.entity['perc_rim_giu'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.GREEN && row.entity['perc_rim_giu'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_giu'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_giu'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['giu'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            if (row.entity['perc_rim_giu'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.GREEN && row.entity['perc_rim_giu'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_giu'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_giu'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['giu'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            if (row.entity['perc_rim_lug'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.GREEN && row.entity['perc_rim_lug'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_lug'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_lug'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['lug'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            if (row.entity['perc_rim_lug'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.GREEN && row.entity['perc_rim_lug'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_lug'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_lug'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['lug'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            if (row.entity['perc_rim_ago'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ago'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ago'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ago'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ago'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            if (row.entity['perc_rim_ago'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ago'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ago'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ago'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ago'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            if (row.entity['perc_rim_sett'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.GREEN && row.entity['perc_rim_sett'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_sett'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_sett'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['sett'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            if (row.entity['perc_rim_sett'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.GREEN && row.entity['perc_rim_sett'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_sett'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_sett'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['sett'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            if (row.entity['perc_rim_ott'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ott'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ott'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ott'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ott'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            if (row.entity['perc_rim_ott'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ott'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ott'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ott'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ott'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            if (row.entity['perc_rim_nov'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.GREEN && row.entity['perc_rim_nov'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_nov'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_nov'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['nov'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            if (row.entity['perc_rim_nov'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.GREEN && row.entity['perc_rim_nov'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_nov'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_nov'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['nov'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            if (row.entity['perc_rim_dic'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.GREEN && row.entity['perc_rim_dic'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_dic'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_dic'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['dic'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                    width: '6%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            if (row.entity['perc_rim_dic'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.GREEN && row.entity['perc_rim_dic'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_dic'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_dic'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['dic'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
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
                dto.tipoconto = pivot.tipoconto;
                dto.anno = pivot.year;
                return $http.post($strings.REST.SERVER + '/budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridBudget.data = resp.data;
                    }
                });
            },
            loadDefBudget: function(pivot){
                var dto = {};
                dto.tipoconto = (pivot || $strings.PIVOT).tipoconto;
                dto.anno = (pivot || $strings.PIVOT).year;
                return $http.post($strings.REST.SERVER + '/defbudget', dto).then(function (resp) {
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
                    }
                });
            }
        };
        return srvc;
    }]);
})();
