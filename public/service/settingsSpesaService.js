(function () {
    'use strict';
    angular.module('myApp').factory('settingsSpesaService', ['dataService', '$rootScope', '$interval', 'uiGridConstants', function (dataService, $rootScope, $interval, uiGridConstants) {
        var scope = $rootScope.$new();
        var afterCellEditFunction = function afterCellEditFunction(rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            rowEntity.dirty = true;
            dataService.data.dirty = true;
        };
        var srvc = {            
            gridOptionsReparto: {
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
                    field: 'label',
                    displayName: 'Reparto'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsReparto.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsSottoreparto: {
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
                    field: 'label',
                    displayName: 'Sottoreparto'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsSottoreparto.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsFamiglia: {
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [{
                    field: 'label',
                    displayName: 'Famiglia'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsFamiglia.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsReprSott: {
                rowTemplate: 'templates/rows/deletableRow.html',
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                columnDefs: [{
                    name: 'reparto',
                    displayName: 'Reparto',
                    field: 'reparto',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'reparto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }, {
                    name: 'sottoreparto',
                    displayName: 'Sottoreparto',
                    field: 'sottoreparto',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottoreparto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }],
                data: [],
                isRowSelectable: function (row) {
                    return row.entity.used <= 0;
                },
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsReprSott.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            gridOptionsSottFamg: {
                rowTemplate: 'templates/rows/deletableRow.html',
                minRowsToShow: 10,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                columnDefs: [ {
                    name: 'sottoreparto',
                    displayName: 'Sottoreparto',
                    field: 'sottoreparto',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottoreparto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }, {
                    name: 'famiglia',
                    displayName: 'Famiglia',
                    field: 'famiglia',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'famiglia',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray;
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsSottFamg.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            loadSettingsSpesa: function () {
                srvc.gridOptionsReparto.data = dataService.data.dropdownReparto.filter(function (j) {
                    return j.reparto !== "";
                });
                srvc.gridOptionsSottoreparto.data = dataService.data.dropdownSottoreparto.filter(function (j) {
                    return j.sottoreparto !== "";
                });
                srvc.gridOptionsFamiglia.data = dataService.data.dropdownFamiglia.filter(function (j) {
                    return j.famiglia !== "";
                });            
                srvc.gridOptionsReprSott.data = dataService.data.dropdownSottoreparto.filter(function (j) {
                    return j.sottoreparto !== "" && j.reparto !== "";
                });
                srvc.gridOptionsReprSott.columnDefs[0].editDropdownOptionsArray = dataService.data.dropdownReparto;
                srvc.gridOptionsReprSott.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownSottoreparto;
                srvc.gridOptionsSottFamg.data = dataService.data.dropdownFamiglia.filter(function (j) {
                    return j.famiglia !== "" && j.sottoreparto !== "";
                });
                srvc.gridOptionsSottFamg.columnDefs[0].editDropdownOptionsArray = dataService.data.dropdownSottoreparto;
                srvc.gridOptionsSottFamg.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownFamiglia;
                srvc.refreshGridSettingsSpesa();
            },
            refreshGridSettingsSpesa: function () {
                $interval(srvc.gridOptionsReparto.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsSottoreparto.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsFamiglia.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsReprSott.gridApi.core.handleWindowResize, 100, 10);
                $interval(srvc.gridOptionsSottFamg.gridApi.core.handleWindowResize, 100, 10);
            }
        };
        return srvc;
    }]);
})();