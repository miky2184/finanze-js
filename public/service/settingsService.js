(function () {
    'use strict';
    angular.module('myApp').factory('settingsService', ['dataService', '$rootScope', '$interval', 'uiGridConstants', 'utilService', function (dataService, $rootScope, $interval, uiGridConstants, utilService) {
        var scope = $rootScope.$new();
        var afterCellEditFunction = function afterCellEditFunction(rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            rowEntity.dirty = true;
            dataService.data.dirty = true;
        };
        var srvc = {
            addSettingBtn: {
                label: '+',
                listener: function (gridOptions, type, settings) {
                    dataService.data.dirty = true;
                    var newSetting = {};
                    newSetting.newRow = true;
                    newSetting.dirty = true;
                    newSetting.deleted = false;
                    if (settings) {
                        newSetting['label'] = '';
                        newSetting[type] = utilService.max(gridOptions.data.filter(function (j) {
                            return j[type] !== "null" && !isNaN(j[type]);
                        }).map(function (obj) {
                            return obj[type];
                        })) + 1;
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
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    field: 'ambito',
                    width: '10%'
                },{
                    field: 'label',
                    width: '60%'
                }, {
                    field: 'used',
                    displayName: 'In Uso',
                    type: 'number',
                    width: '30%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAmb.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsCat: {
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    field: 'categoria',
                    width: '10%'
                },{
                    field: 'label',
                    width: '60%'
                }, {
                    field: 'used',
                    displayName: 'In Uso',
                    type: 'number',
                    width: '30%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsCat.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsSott: {
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableFiltering: true,
                columnDefs: [{
                    field: 'sottocategoria',
                    width: '10%'
                },{
                    field: 'label',
                    width: '60%'
                }, {
                    field: 'used',
                    displayName: 'In Uso',
                    type: 'number',
                    width: '30%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsSott.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsBen: {
                rowTemplate: 'templates/rows/deletableRow.html',
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: true,
                columnDefs: [{
                    field: 'beneficiario',
                    width: '10%'
                },{
                    field: 'label',
                    width: '60%'
                }, {
                    field: 'used',
                    displayName: 'In Uso',
                    type: 'number',
                    width: '30%'
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsBen.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsAmbCat: {
                minRowsToShow: 9,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
                    name: 'ambito',
                    displayName: 'Ambito',
                    field: 'ambito',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'ambito',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAmbCat.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsCatSott: {
                minRowsToShow: 9,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }, {
                    name: 'sottocategoria',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottocategoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsCatSott.gridApi = gridApi;
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
                srvc.refreshGridSettings();
            },
            refreshGridSettings: function () {
                $interval(srvc.gridOptionsAmb.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsCat.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsSott.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsBen.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsAmbCat.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsCatSott.gridApi.core.handleWindowResize, 100, 10);
            }
        };
        return srvc;
    }]);
})();
