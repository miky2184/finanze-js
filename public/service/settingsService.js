(function () {
    'use strict';
    angular.module('myApp').factory('settingsService', ['dataService', '$strings', '$rootScope', '$interval', 'uiGridConstants', '$timeout', function (dataService, $strings, $rootScope, $interval, uiGridConstants, $timeout) {
        var scope = $rootScope.$new();
        var afterCellEditFunction = function afterCellEditFunction(rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            rowEntity.dirty = true;
            dataService.data.dirty = true;
        };
        var srvc = {
            canEdit: function () {
                return false
            },
            addSettingBtn: {
                label: '+',
                src: 'fa-solid fa-plus fa-xl',
                listener: function (gridOptions, type, settings) {
                    dataService.data.dirty = true;
                    var newSetting = {};                    
                    newSetting.newRow = true;
                    newSetting.dirty = true;
                    newSetting.deleted = false;                    
                    if (settings) {
                        newSetting['label'] = '';
                        newSetting.used = 0;
                        if (type === 'ambito') {
                            dataService.data.dropdownAmbito.unshift(newSetting);
                            srvc.gridOptionsAmb.data = dataService.data.dropdownAmbito.filter(function (x) {
                                return x[type] != "null";
                            });
                        } else if (type === 'categoria') {
                            dataService.data.dropdownCategoria.unshift(newSetting);
                            srvc.gridOptionsCat.data = dataService.data.dropdownCategoria.filter(function (x) {
                                return x[type] != "null";
                            });
                        } else if (type === 'sottocategoria') {
                            newSetting.budget = true;
                            dataService.data.dropdownSottocategoria.unshift(newSetting);
                            srvc.gridOptionsSott.data = dataService.data.dropdownSottocategoria.filter(function (x) {
                                return x[type] != "null";
                            });
                        } else if (type === 'beneficiario') {
                            dataService.data.dropdownBeneficiario.unshift(newSetting);
                            srvc.gridOptionsBen.data = dataService.data.dropdownBeneficiario.filter(function (x) {
                                return x[type] != "null";
                            });
                        }  else if (type === 'conto') {
                            dataService.data.settingsConto.unshift(newSetting);
                            srvc.gridOptionsConto.data = dataService.data.settingsConto.filter(function (x) {
                                return x[type] != "null";
                            });
                        }
                    } else {
                        gridOptions.data.unshift(newSetting);
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                }
            },
            deleteSettingBtn: {
                label: '-',
                src: 'fa-solid fa-minus fa-xl',
                listener: function (gridOptions, type) {
                    if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                        gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                            row.deleted = !row.deleted;
                            row.dirty = true;
                            dataService.data.dirty = true;
                        });
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                }
            },
            gridOptionsAmb: {              
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'ID',
                    displayName: 'ID',
                    field: 'ambito',
                    width: '10%'
                }, {
                    field: 'label',
                    displayName: 'AMBITO',
                    width: '*'
                }, {
                    field: 'used',
                    displayName: '#FREQ',
                    type: 'number',
                    cellClass: 'text-right',
                    width: '35%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },                
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAmb.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }
            },
            gridOptionsCat: {                
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'ID',
                    displayName: 'ID',
                    field: 'categoria',
                    width: '10%'
                }, {
                    field: 'label',
                    displayName: 'CATEGORIA',
                    width: '*'
                }, {
                    field: 'used',
                    displayName: '#FREQ',
                    type: 'number',
                    cellClass: 'text-right',
                    width: '35%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsCat.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }               
            },
            gridOptionsSott: {                
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'ID',
                    displayName: 'ID',
                    field: 'sottocategoria',
                    width: '10%'
                }, {
                    field: 'label',
                    displayName: 'SOTTOCATEGORIA',
                    width: '*'
                }, {
                    field: 'used',
                    displayName: '#FREQ',
                    type: 'number',
                    cellClass: 'text-right',
                    width: '35%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsSott.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }
            },
            gridOptionsBen: {
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,
                rowTemplate: 'templates/rows/deletableRow.html',                
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: true,
                columnDefs: [{
                    name: 'ID',
                    displayName: 'ID',
                    field: 'beneficiario',
                    width: '10%'
                }, {
                    field: 'label',
                    displayName: 'BENEFICIARIO',
                    width: '*'
                }, {
                    field: 'used',
                    displayName: '#FREQ',
                    type: 'number',
                    cellClass: 'text-right',
                    width: '35%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsBen.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }
            },
            gridOptionsAmbCat: {               
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS, 
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'ambito',
                    displayName: 'AMBITO',
                    field: 'ambito',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'ambito',
                    editDropdownValueLabel: 'label',                    
                    cellEditableCondition: function(scope){
                        return scope.row.entity.newRow || false;
                      },
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    },
                    filter: {
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
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',                    
                    cellEditableCondition: function(scope){
                        return scope.row.entity.newRow || false;
                      },
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    },
                    filter: {
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
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAmbCat.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }                
            },
            gridOptionsCatSott: {    
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,            
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'categoria',
                    displayName: 'CATEGORIA',
                    field: 'categoria',
                    width: '40%',                    
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',
                    cellEditableCondition: function(scope){
                        return scope.row.entity.newRow || false;
                      },
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    },
                    filter: {
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
                    width: '40%',                    
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottocategoria',
                    editDropdownValueLabel: 'label',                    
                    cellEditableCondition: function(scope){
                        return scope.row.entity.newRow || false;
                      },
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    },
                    filter: {
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
                    field: 'budget',
                    displayName: '💰',
                    width: '10%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-bold',                                        
                    cellClass: 'text-center'
                }, {
                    field: 'fissa',
                    displayName: '🔒',
                    width: '*',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-lock',                                        
                    cellClass: 'text-center'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsCatSott.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                
                    // Chiamata al refresh quando il gridApi è disponibile
                    $interval(() => {
                        if (srvc.gridOptionsAmb.gridApi && srvc.gridOptionsAmb.gridApi.core) {
                            srvc.gridOptionsAmb.gridApi.core.handleWindowResize();
                        }
                    }, 100, 1);
                }                
            },
            gridOptionsConto: {    
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW_SETTINGS,            
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    name: 'label',
                    displayName: 'CONTO',
                    field: 'label'                
                }, {
                    name: 'hex_color',
                    displayName: '🎨',
                    field: 'hex_color',
                    enableCellEdit: true, // Abilita l'editing
                    cellTemplate: `
        <div class="ui-grid-cell-contents" style="text-align:center;">
            <div style="width: 100%; height: 30px; background-color: {{COL_FIELD}}; border: 1px solid #ddd; cursor: pointer;"></div>
        </div>
    `,
    editableCellTemplate: `
        <div class="ui-grid-cell-contents">
            <input type="color" 
                ng-model="MODEL_COL_FIELD" 
                ng-change="$emit('uiGridEventEndCellEdit')"
                style="width:100%; height:30px; border:none; cursor:pointer;">
        </div>
    `
                  },{
                    field: 'graph',
                    displayName: '📊',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-chart-area',
                    cellClass: 'text-center'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsConto.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }                
            },
            loadSettings: function () {
                srvc.gridOptionsAmb.data = dataService.data.dropdownAmbito.filter(function (j) {
                    return j.ambito !== "null";
                });
                srvc.gridOptionsCat.data = dataService.data.dropdownCategoria.filter(function (j) {
                    return j.categoria !== "null";
                });
                srvc.gridOptionsSott.data = dataService.data.dropdownSottocategoria
                .filter(j => j.sottocategoria !== "null") // Rimuovi i valori null
                .reduce((acc, current) => {
                    if (!acc.some(item => item.sottocategoria === current.sottocategoria)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                srvc.gridOptionsBen.data = dataService.data.dropdownBeneficiario.filter(function (j) {
                    return j.beneficiario !== "null";
                });
                srvc.gridOptionsConto.data = dataService.data.settingsConto;
                srvc.gridOptionsAmbCat.data = angular.copy(dataService.data.dropdownCategoria).filter(function (j) {
                    return j.categoria !== "null" && j.ambito !== null;
                });
                srvc.gridOptionsAmbCat.columnDefs[0].editDropdownOptionsArray = dataService.data.dropdownAmbito;
                srvc.gridOptionsAmbCat.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                srvc.gridOptionsCatSott.data = angular.copy(dataService.data.dropdownSottocategoria).filter(function (j) {
                    return j.sottocategoria !== "null" && j.categoria !== null;
                });
                srvc.gridOptionsCatSott.columnDefs[0].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                srvc.gridOptionsCatSott.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownSottocategoria;
                return true;
            },
            refreshGridSettings: function () {
                const gridApis = [
                    srvc.gridOptionsAmb.gridApi,
                    srvc.gridOptionsCat.gridApi,
                    srvc.gridOptionsSott.gridApi,
                    srvc.gridOptionsBen.gridApi,
                    srvc.gridOptionsAmbCat.gridApi,
                    srvc.gridOptionsCatSott.gridApi,
                    srvc.gridOptionsConto.gridApi
                ];
            
                gridApis.forEach((gridApi, index) => {
                    if (gridApi && gridApi.core) {
                        $interval(gridApi.core.handleWindowResize, 100, 10);
                    } else {
                        console.warn(`gridApi non inizializzato per griglia ${index}`);
                    }
                });
            }
        };
        return srvc;
    }]);
})();