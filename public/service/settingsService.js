(function () {
    'use strict';
    angular.module('myApp').factory('settingsService', ['dataService', '$rootScope', '$interval', 'uiGridConstants', function (dataService, $rootScope, $interval, uiGridConstants) {
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
                    if (settings) {
                        var newSetting = {};
                        newSetting.newRow = true;
                        newSetting[type] = Math.max(gridOptions.data.filter(function (j) {
                            return j[type] !== "null";
                        }).map(function (obj) {
                            return obj[type];
                        })) + 1;
                        newSetting.dirty = true;
                        dataService.data.dirty = true;
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
                        }
                    } else {
                        dataService.data.dirty = true;
                        var newLink = {
                            dirty: true,
                            newRow: true,
                            deleted: false
                        };
                        if (type === 'ambcat') {
                            srvc.gridOptionsAmbCat.data.unshift(newLink);
                        } else if (type === 'catsott') {
                            srvc.gridOptionsCatSott.data.unshift(newLink);
                        }
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
                columnDefs: [{
                    field: 'label'
                }, {
                    field: 'used',
                    displayName: 'In Uso'
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
                columnDefs: [{
                    field: 'label'
                }, {
                    field: 'used',
                    displayName: 'In Uso'
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
                columnDefs: [{
                    field: 'label'
                }, {
                    field: 'used',
                    displayName: 'In Uso'
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
                columnDefs: [{
                    field: 'label'
                }, {
                    field: 'used',
                    displayName: 'In Uso'
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
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'ambito',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return dataService.data.dropdownAmbito;
                    }
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return dataService.data.dropdownCategoria;
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
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'categoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return dataService.data.dropdownCategoria;
                    }
                }, {
                    name: 'sottocategoria',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'sottocategoria',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return dataService.data.dropdownSottocategoria;
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
                srvc.gridOptionsAmbCat.data = dataService.data.dropdownCategoria.filter(function (j) {
                    return j.categoria !== "null" && j.ambito !== null;
                });
                srvc.gridOptionsAmbCat.columnDefs[0].editDropdownOptionsArray = dataService.data.dropdownAmbito;
                srvc.gridOptionsAmbCat.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                srvc.gridOptionsCatSott.data = dataService.data.dropdownSottocategoria.filter(function (j) {
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
