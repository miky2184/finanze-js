(function () {
    'use strict';
    angular.module('myApp').factory('settingsService', ['dataService', '$rootScope', '$interval', 'uiGridConstants', '$timeout', function (dataService, $rootScope, $interval, uiGridConstants, $timeout) {
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
                src: 'images/add.svg',
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
                            dataService.data.dropdownSottocategoria.unshift(newSetting);
                            srvc.gridOptionsSott.data = dataService.data.dropdownSottocategoria.filter(function (x) {
                                return x[type] != "null";
                            });
                        } else if (type === 'beneficiario') {
                            dataService.data.dropdownBeneficiario.unshift(newSetting);
                            srvc.gridOptionsBen.data = dataService.data.dropdownBeneficiario.filter(function (x) {
                                return x[type] != "null";
                            });
                        } else if (type === 'reparto') {
                            dataService.data.dropdownReparto.unshift(newSetting);
                            gridOptions.data = dataService.data.dropdownReparto.filter(function (j) {
                                return j.reparto !== "";
                            });
                        } else if (type === 'sottoreparto') {
                            dataService.data.dropdownSottoreparto.unshift(newSetting);
                            gridOptions.data = dataService.data.dropdownSottoreparto.filter(function (j) {
                                return j.sottoreparto !== "";
                            });
                        } else if (type === 'famiglia') {
                            dataService.data.dropdownFamiglia.unshift(newSetting);
                            gridOptions.data = dataService.data.dropdownFamiglia.filter(function (j) {
                                return j.famiglia !== "";
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
                src: 'images/cancel.svg',
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
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
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
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
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
                    }
                }, {
                    name: 'sottocategoria',
                    displayName: 'SOTTOCATEGORIA',
                    field: 'sottocategoria',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottocategoria',
                    editDropdownValueLabel: 'label',
                    cellEditableCondition: function(scope){
                        return scope.row.entity.newRow || false;
                      },
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
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
            loadSettings: function () {
                srvc.gridOptionsAmb.data = dataService.data.dropdownAmbito.filter(function (j) {
                    return j.ambito !== "null";
                });
                srvc.gridOptionsCat.data = dataService.data.dropdownCategoria.filter(function (j) {
                    return j.categoria !== "null";
                });
                srvc.gridOptionsSott.data = dataService.data.dropdownSottocategoria.filter(function (j) {
                    return j.sottocategoria !== "null";
                });
                srvc.gridOptionsBen.data = dataService.data.dropdownBeneficiario.filter(function (j) {
                    return j.beneficiario !== "null";
                });
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
                // Ritarda il refresh per garantire che i gridApi siano pronti
                /*$timeout(() => {
                    srvc.refreshGridSettings();
                }, 1000);*/
            },
            refreshGridSettings: function () {
                const gridApis = [
                    srvc.gridOptionsAmb.gridApi,
                    srvc.gridOptionsCat.gridApi,
                    srvc.gridOptionsSott.gridApi,
                    srvc.gridOptionsBen.gridApi,
                    srvc.gridOptionsAmbCat.gridApi,
                    srvc.gridOptionsCatSott.gridApi
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