(function () {
    'use strict';
    angular.module('myApp').factory('listaMovimentiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', '$rootScope', function (modalService, $http, $interval, $strings, uiGridConstants, dataService, $rootScope) {
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
                case 'data':
                    rowEntity.anno = new Date(newValue).getFullYear();
                    rowEntity.mese = new Date(newValue).getMonth() + 1;
                    break;
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
                case 'beneficiario':
                    newSett = dataService.data.dropdownBeneficiario.filter(function (a) {
                        return a[colDef.name] === newValue;
                    })[0];
                    oldSett = dataService.data.dropdownBeneficiario.filter(function (a) {
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
            gridOptions: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: 21,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    field: 'data',
                    width: 90,
                    type: 'date',
                    cellFilter: 'date:\'yyyy-MM-dd\''
                }, {
                    name: 'ambito',
                    displayName: 'Ambito',
                    field: 'ambito',
                    width: 100,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'ambito',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',                    
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return dataService.data.dropdownAmbito.filter(function (a) {
                            return !a.deleted;
                        });
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownAmbito) {
                                var cell = dataService.data.dropdownAmbito.filter(function (ambito) {
                                    return ambito.ambito === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    width: 150,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
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
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownCategoria) {
                                var cell = dataService.data.dropdownCategoria.filter(function (categoria) {
                                    return categoria.categoria === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    name: 'sottocategoria',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    width: 200,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
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
                        condition: function (searchTerm, cellValue, row, column) {                            
                            if (dataService.data.dropdownSottocategoria) {
                                var cell = dataService.data.dropdownSottocategoria.filter(function (sottocategoria) {                                   
                                    return sottocategoria.sottocategoria === cellValue;
                                });                                
                                if (cell && cell.length > 0) {                                      
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    name: 'beneficiario',
                    displayName: 'Beneficiario',
                    field: 'beneficiario',
                    width: 200,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'beneficiario',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function () {
                        return dataService.data.dropdownBeneficiario;
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownBeneficiario) {
                                var cell = dataService.data.dropdownBeneficiario.filter(function (beneficiario) {
                                    return beneficiario.beneficiario === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    name: 'tipoConto',
                    displayName: 'Tipo Conto',
                    field: 'tipoConto',
                    width: 160,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'tipoConto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function () {
                        return dataService.data.editDropDownTipoContoArray;
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.editDropDownTipoContoArray) {
                                var cell = dataService.data.editDropDownTipoContoArray.filter(function (tipoConto) {
                                    return tipoConto.tipoConto === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    field: 'conto',
                    name: 'conto',
                    displayName: 'Conto',
                    width: 160,
                    editableCellTemplate: 'templates/rows/dropdownEditor.html',
                    editDropdownIdLabel: 'conto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function () {
                        return dataService.data.editDropDownContoArray;
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.editDropDownContoArray) {
                                var cell = dataService.data.editDropDownContoArray.filter(function (conto) {
                                    return conto.conto === cellValue;
                                });
                                if (cell && cell.length > 0) {
                                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }, {
                    field: 'contabilizzata',
                    displayName: ' ',
                    width: 35,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-balance-scale',
                    headerCellClass: 'icon contabilizzata'
                }, {
                    field: 'visualizzare',
                    displayName: ' ',
                    width: 35,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-eye',
                    headerCellClass: 'icon visualizzare'
                }, {
                    field: 'cartaCredito',
                    displayName: ' ',
                    width: 35,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'far fa-credit-card',
                    headerCellClass: 'icon cartacredito'
                }, {
                    field: 'webapp',
                    displayName: ' ',
                    width: 35,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fab fa-telegram-plane',
                    headerCellClass: 'icon webapp'
                }, {
                    field: 'importo',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    width: 120,
                    cellTooltip: true,
                    cellClass: 'text-right',
                    type: 'number'
                }, {
                    field: 'info',
                    cellTooltip: true,
                    width: '*'
                }, {
                    field: 'anno',
                    diplayName: 'Anno',
                    width: 45
                }, {
                    field: 'mese',
                    diplayName: 'Mese',
                    width: 40
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptions.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            addBtn: {
                src: 'images/baseline-add_circle_outline-24px.svg',
                listener: function (gridOptions) {
                    gridOptions.data.unshift({
                        newRow: true,
                        data: new Date(),
                        anno: new Date().getFullYear(),
                        mese: new Date().getMonth() + 1,
                        contabilizzata: true,
                        visualizzare: true,
                        cartaCredito: false,
                        webapp: false,
                        fissa: false
                    });
                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                label: 'Add'
            },
            deleteBtn: {
                src: 'images/baseline-remove_circle_outline-24px.svg',
                listener: function (gridOptions) {
                    if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                        gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                            row.deleted = !row.deleted;
                            row.dirty = true;
                            dataService.data.dirty = true;
                        });
                    }
                    gridOptions.gridApi.selection.clearSelectedRows();
                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                label: 'Delete'
            },
            copyBtn: {
                src: 'images/baseline-file_copy-24px.svg',
                listener: function (gridOptions) {
                    if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                        gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                            var copyRow = angular.copy(row);
                            copyRow.data = new Date();
                            copyRow.newRow = true;
                            copyRow.deleted = false;
                            copyRow.dirty = true;
                            dataService.data.dirty = true;
                            gridOptions.data.unshift(copyRow);
                        });
                        gridOptions.gridApi.selection.clearSelectedRows();
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                label: 'Copy'
            }
        };
        return srvc;
    }]);
})();
