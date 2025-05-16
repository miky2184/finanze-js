(function () {
    'use strict';
    angular.module('myApp').factory('listaMovimentiService', ['modalService', '$http', '$strings', 'uiGridConstants', 'dataService', '$rootScope', 'salaryService', 'passwordService', 'budgetService', function (modalService, $http, $strings, uiGridConstants, dataService, $rootScope, salaryService, passwordService, budgetService) {
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
            updateFilterPriority: function () {
                srvc.gridOptions.data.forEach(function (row) {
                    var checkActive = srvc.gridOptions.showOnlyCheck;
                    var dirtyActive = srvc.gridOptions.showOnlyDirty;
                    if (checkActive && dirtyActive) {
                        if (row.check && row.dirty) row.filterPriority = 0;
                        else if (row.check || row.dirty) row.filterPriority = 1;
                        else row.filterPriority = 2;
                    } else if (checkActive) {
                        row.filterPriority = row.check ? 0 : 1;
                    } else if (dirtyActive) {
                        row.filterPriority = row.dirty ? 0 : 1;
                    } else {
                        row.filterPriority = 0;
                    }
                });
                srvc.gridOptions.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            },
            gridOptions: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                showColumnFooter: true,
                minRowsToShow: $strings.MIN_ROWS_TO_SHOW,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    field: 'data',
                    displayName: 'DATA',
                    width: '4%',
                    type: 'date',
                    cellFilter: 'date:\'yyyy-MM-dd\'',
                    cellClass: 'text-center',
                    filters: [{
                        placeholder: 'less than',
                        condition: function (searchTerm, cellValue, row, column) {                            
                            searchTerm = searchTerm.replace(/\\/g, '');
                            var searchDate = new Date(searchTerm);
                            return cellValue < searchDate;
                        }
                    }, {
                        placeholder: 'greather than',
                        condition: function (searchTerm, cellValue, row, column) {                            
                            searchTerm = searchTerm.replace(/\\/g, '');
                            var searchDate = new Date(searchTerm);
                            return cellValue >= searchDate;
                        }
                    }]
                }, {
                    name: 'ambito',
                    displayName: 'AMBITO',
                    field: 'ambito',
                    width: '4%',
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
                    width: '9%',
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
                    width: '9%',
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
                    name: 'beneficiario',
                    displayName: 'BENEFICIARIO',
                    field: 'beneficiario',
                    width: '10%',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
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
                    name: 'conto',
                    displayName: 'CONTO',
                    field: 'conto',
                    width: '7%',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'conto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    cellClass: 'text-center',
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
                    field: 'tipo_conto',
                    name: 'tipo_conto',
                    displayName: 'TIPO CONTO',
                    width: '7%',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'tipo_conto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    cellClass: 'text-center',
                    editDropdownOptionsFunction: function () {
                        return dataService.data.editDropDownTipoContoArray;
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.editDropDownTipoContoArray) {
                                var cell = dataService.data.editDropDownTipoContoArray.filter(function (tipo_conto) {
                                    return tipo_conto.tipo_conto === cellValue;
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
                    displayName: '⚖️',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-balance-scale',
                    cellClass: 'text-center'
                }, {
                    field: 'visualizzare',
                    displayName: '👁️',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-eye',                                        
                    cellClass: 'text-center'
                }, {
                    field: 'budget',
                    displayName: '💰',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-bold',                                        
                    cellClass: 'text-center'
                }, {
                    field: 'cartaCredito',
                    displayName: '💳',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'far fa-credit-card',                                        
                    cellClass: 'text-center'
                }, {
                    field: 'webapp',
                    displayName: '🚀',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fab fa-telegram-plane',                                        
                    cellClass: 'text-center'
                },{
                    field: 'fissa',
                    displayName: '🔒',
                    width: '3%',
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-lock',                                        
                    cellClass: 'text-center'
                }, {
                    field: 'importo',
                    displayName: 'IMPORTO',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div class="ui-grid-cell-contents text-right" >{{col.getAggregationValue() | number:2 }} €</div>',
                    cellFilter: 'currency',
                    width: '7%',
                    cellTooltip: true,
                    cellClass: 'text-right',
                    type: 'number',
                    filters: [{
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                            placeholder: 'less than'
                        }
                    ]
                }, {
                    field: 'info',
                    displayName: 'INFO',
                    cellTooltip: true,
                    width: '*',
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (cellValue != undefined && cellValue.match(new RegExp(searchTerm.replaceAll('\\', ''), 'i')) != null) {
                                return true;
                            }
                            return false;
                        }
                    }
                }, {
                    field: 'anno',
                    displayName: 'ANNO',
                    width: '4%',
                    type: 'number',
                    cellClass: 'text-center',
                    filters: [{
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                            placeholder: 'less than'
                        }
                    ]
                }, {
                    field: 'mese',
                    displayName: 'MESE',
                    width: '4%',
                    type: 'number',
                    cellClass: 'text-center',
                    filters: [{
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                            placeholder: 'less than'
                        }
                    ]
                },{
                    field: 'filterPriority',
                    displayName: '',
                    visible: false,
                    enableSorting: true,
                    sort: {
                        direction: uiGridConstants.ASC
                    }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptions.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            addOneYearBtn: {
                src: 'images/oneyear.svg',
                tooltip: "Duplica Riga (+1 anno)",
                listener: function (gridOptions, maschera) {
                    if (maschera === "LM") {
                        if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                                var copyRow = angular.copy(row);
                                copyRow.data = copyRow.data.setFullYear(copyRow.data.getFullYear() + 1);
                                copyRow.data = new Date(copyRow.data);
                                copyRow.newRow = true;
                                copyRow.deleted = false;
                                copyRow.dirty = true;
                                dataService.data.dirty = true;
                                gridOptions.data.unshift(copyRow);
                            });
                            gridOptions.gridApi.selection.clearSelectedRows();
                        }
                    }
                },
                disabled: function (maschera) {
                    return !dataService.data.admin || maschera == "PW" || maschera == "DB";
                },
                label: 'Add 1 Year'
            },
            addBtn: {
                src: 'fa-solid fa-plus fa-xl',
                tooltip: "Aggiungi Riga",
                listener: function (gridOptions, maschera) {
                    if (maschera === "LM") {
                        gridOptions.data.unshift({
                            newRow: true,
                            data: new Date(),
                            anno: new Date().getFullYear(),
                            mese: new Date().getMonth() + 1,
                            contabilizzata: true,
                            budget: true,
                            visualizzare: true,
                            cartaCredito: false,
                            webapp: false,
                            fissa: false,
                            dirty: true
                        });
                    } else if (maschera === "PW") {
                        gridOptions.data.unshift({
                            newRow: true,
                            dirty: true,
                            site: '',
                            user: '',
                            pwd: '',
                            url: '',
                            note: ''
                        });
                    } else if (maschera === "DB") {
                        gridOptions.data.unshift({
                            newRow: true,
                            dirty: true,
                            budget: undefined,
                            ambito: undefined,
                            categoria: undefined,
                            sottocategoria: undefined,
                            conto: undefined,
                            mese: undefined
                        });
                    }
                },
                disabled: function (maschera) {
                    return !dataService.data.admin;
                },
                label: 'Add'
            },
            deleteBtn: {
                src: 'images/cancel.svg',
                tooltip: "Cancella Riga",
                listener: function (gridOptions, maschera) {
                    if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                        gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                            row.deleted = !row.deleted;
                            row.dirty = true;
                            dataService.data.dirty = true;
                        });
                    }
                    gridOptions.gridApi.selection.clearSelectedRows();
                },
                disabled: function (maschera) {
                    return !dataService.data.admin;
                },
                label: 'Delete'
            },
            copyBtn: {
                src: 'images/copy.svg',
                tooltip: "Duplica Riga",
                listener: function (gridOptions, maschera) {
                    if (maschera === "LM"){
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
                    } else if (maschera == "DB"){                        
                        if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
                            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
                                var copyRow = angular.copy(row);   
                                copyRow.id = -1;                             
                                copyRow.newRow = true;
                                copyRow.deleted = false;
                                copyRow.dirty = true;
                                dataService.data.dirty = true;
                                gridOptions.data.unshift(copyRow);
                            });
                            gridOptions.gridApi.selection.clearSelectedRows();
                        }                        
                    }                   
                },
                disabled: function (maschera) {
                    return !dataService.data.admin || maschera == "PW";
                },
                label: 'Copy'
            },
            refreshBtn: {
                src: 'images/sync.svg',
                tooltip: "Refresh Dati",
                listener: function (gridOptions, maschera) {
                    modalService.showModal('Ricerca in corso...');
                    if (maschera === "LM") {                        
                        return srvc.loadListaMovimenti(dataService.data.idDb).finally(function (f) {
                            modalService.hideModal();
                        });
                    } else if (maschera === "SA") {
                        return salaryService.loadWork().finally(function (f) {
                            modalService.hideModal();
                        });
                    } else if (maschera === "PW") {
                        return passwordService.loadPassword().finally(function (f) {
                            modalService.hideModal();
                        });
                    } else if (maschera === "DB") {
                        return budgetService.loadDefBudget().finally(function (f) {
                            modalService.hideModal();
                        });
                    }
                },
                disabled: function (maschera) {
                    return !dataService.data.admin;
                },
                label: 'Refresh'
            },
            checkBtn: {
                src: 'images/filter-check.svg',
                tooltip: "Mostra solo Check",
                label: 'Check',
                listener: function (gridOptions, maschera) {
                    gridOptions.showOnlyCheck = !gridOptions.showOnlyCheck;
                    srvc.updateFilterPriority();
                },
                disabled: function (maschera) {
                    return false;
                }
            },
            dirtyBtn: {
                src: 'images/filter-check.svg',
                tooltip: "Mostra solo Dirty",
                label: 'Dirty',
                listener: function (gridOptions, maschera) {
                    gridOptions.showOnlyDirty = !gridOptions.showOnlyDirty;
                    srvc.updateFilterPriority();
                },
                disabled: function (maschera) {
                    return false;
                }
            },
            resetFilterBtn: {
                 src: 'images/reset-filter.svg',
                tooltip: "Rimuovi tutti i filtri Check e Dirty",
                label: 'Reset Filtri',
                listener: function (gridOptions, maschera) {
                    gridOptions.showOnlyCheck = false;
                    gridOptions.showOnlyDirty = false;
                    srvc.updateFilterPriority();
                },
                disabled: function (maschera) {
                    return false;
                }
            },
            loadListaMovimenti: function (idDb) {
                var dto = {};                                
                dto.id_db = dataService.data.idDb;
                return $http.post($strings.REST.SERVER + '/ambito', dto).then(function (response) {
                    if (response.data) {
                        response.data.unshift({
                            "ambito": "null",
                            "label": " "
                        });
                    }
                    dataService.data.dropdownAmbito = response.data;
                    return $http.post($strings.REST.SERVER + '/categoria', dto).then(function (response) {
                        if (response.data) {
                            response.data.unshift({
                                "categoria": "null",
                                "label": " "
                            });
                        }
                        dataService.data.dropdownCategoria = response.data;
                        return $http.post($strings.REST.SERVER + '/sottocategoria', dto).then(function (response) {
                            if (response.data) {
                                response.data.unshift({
                                    "sottocategoria": "null",
                                    "label": " "
                                });
                            }
                            dataService.data.dropdownSottocategoria = response.data;
                            return $http.post($strings.REST.SERVER + '/beneficiario', dto).then(function (response) {
                                if (response.data) {
                                    response.data.unshift({
                                        "beneficiario": "null",
                                        "label": " "
                                    });
                                }
                                dataService.data.dropdownBeneficiario = response.data;
                                /*return $http.post($strings.REST.SERVER + '/conto', dto).then(function (response) {
                                    dataService.data.editDropDownContoArray = response.data;*/
                                    return $http.post($strings.REST.SERVER + '/conto', dto).then(function (response) {
                                        dataService.data.settingsConto = response.data;
                                        const transformedData = [];                                        
                                        response.data.forEach(function (conto) {
                                            var row = { [conto.conto]: {
                                                id: conto.id,
                                                label: conto.label,
                                                hex_color: conto.hex_color,
                                                graph: conto.graph
                                                }
                                            };
                                            transformedData.push(row);
                                        });
                                        dataService.data.conti = transformedData;
                                        dataService.data.editDropDownContoArray = response.data.map(conto => ({
                                            conto: conto.id,
                                            label: conto.label
                                        }));
                                         return $http.post($strings.REST.SERVER + '/years', dto).then(function (response) {
                                            dataService.data.years = response.data.map(item => item.anno); 
                                            return $http.post($strings.REST.SERVER + '/tipo_conto', dto).then(function (response) {
                                                dataService.data.editDropDownTipoContoArray = response.data;
                                                var dto = {};
                                                dto.id_db = dataService.data.idDb;
                                                return $http.post($strings.REST.SERVER + '/lista_movimenti', dto).then(function (response) {
                                                    var resultsData = [];
                                                    response.data.forEach(function (row) {
                                                        var newRow = {};
                                                        newRow.id = row['id'];
                                                        newRow.data = new Date(row['data_val']);
                                                        newRow.ambito = row['ambito'];
                                                        newRow.categoria = row['categoria'];
                                                        newRow.sottocategoria = row['sottocategoria'];
                                                        newRow.beneficiario = row['beneficiario'];
                                                        newRow.conto = row['conto'];
                                                        newRow.tipo_conto = row['tipo_conto'];
                                                        newRow.contabilizzata = row['fl_cont'];
                                                        newRow.budget = row['budget'];
                                                        newRow.visualizzare = row['fl_visl'];
                                                        newRow.cartaCredito = row['fl_cc'];
                                                        newRow.webapp = row['webapp'];
                                                        newRow.importo = Number(row['value']);
                                                        newRow.info = row['info'];
                                                        newRow.check = row['check_spesa'];
                                                        newRow.fissa = row['fissa'];
                                                        newRow.anno = new Date(row['data_val']).getFullYear();
                                                        newRow.mese = new Date(row['data_val']).getMonth() + 1;
                                                        return resultsData.push(newRow);
                                                    });
                                                    dataService.data.backupData = angular.copy(resultsData);
                                                    srvc.gridOptions.data = resultsData;
                                                    srvc.gridOptions.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownAmbito;
                                                    srvc.gridOptions.columnDefs[2].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                                                    srvc.gridOptions.columnDefs[3].editDropdownOptionsArray = dataService.data.dropdownSottocategoria;
                                                    srvc.gridOptions.columnDefs[4].editDropdownOptionsArray = dataService.data.dropdownBeneficiario;
                                                    srvc.gridOptions.columnDefs[5].editDropdownOptionsArray = dataService.data.editDropDownContoArray;
                                                    srvc.gridOptions.columnDefs[6].editDropdownOptionsArray = dataService.data.editDropDownTipoContoArray;
                                                });
                                            });
                                         });
                                    });
                                //});
                            });
                        });
                    });
                });
            }
        };
        return srvc;
    }]);
})();