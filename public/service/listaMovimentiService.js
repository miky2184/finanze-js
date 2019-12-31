(function () {
    'use strict';
    angular.module('myApp').factory('listaMovimentiService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', '$rootScope', 'spesaService', 'utilService', 'salaryService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService, $rootScope, spesaService, utilService, salaryService) {
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
                    width: 220,
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
                    width: 240,
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
                    name: 'tipoConto',
                    displayName: 'Tipo Conto',
                    field: 'tipoConto',
                    width: 160,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
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
                    editableCellTemplate: 'ui-grid/dropdownEditor',
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
                    width: 52,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-balance-scale',
                    headerCellClass: 'icon contabilizzata'
                }, {
                    field: 'visualizzare',
                    displayName: ' ',
                    width: 52,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-eye',
                    headerCellClass: 'icon visualizzare'
                }, {
                    field: 'budget',
                    displayName: ' ',
                    width: 52,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-bold',
                    headerCellClass: 'icon flagbudget'
                }, {
                    field: 'cartaCredito',
                    displayName: ' ',
                    width: 52,
                    cellTooltip: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'far fa-credit-card',
                    headerCellClass: 'icon cartacredito'
                }, {
                    field: 'webapp',
                    displayName: ' ',
                    width: 52,
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
                    width: 60
                }, {
                    field: 'mese',
                    diplayName: 'Mese',
                    width: 60
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptions.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            exportBtn: {
                src: 'images/baseline-get_app-24px.svg',
                listener: function (gridOptions, maschera) {
                    if (maschera === "LM") {
                        return $http.get($strings.REST.SERVER + '/export', {
                            responseType: 'arraybuffer'
                        }).then(function (result) {
                            var blob = new Blob([result.data], {
                                type: result.headers()['content-type']
                            });
                            var alink = angular.element('<a/>');
                            var link = alink[0];
                            link.href = window.URL.createObjectURL(blob);
                            link.download = 'ListaMovimenti_' + utilService.dateToString(new Date()) + '.xlsx';
                            link.target = '_blank';

                            var evt = document.createEvent('MouseEvents');
                            evt.initMouseEvent('click', true, true, window,
                                0, 0, 0, 0, 0, false, false, false, false, 0, null);

                            link.dispatchEvent(evt);

                            return result;
                        });
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                label: 'Export'
            },
            addBtn: {
                src: 'images/baseline-add_circle_outline-24px.svg',
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
                    } else if (maschera === "SP") {
                        gridOptions.data.unshift({
                            newRow: true,
                            dataSpesa: new Date(),
                            dirty: true,
                            reparto: 'XXX',
                            sottoreparto: 'XXX',
                            famiglia: 'XXX',
                            peso: false,
                            pesoGrammi: 0,
                            prezzo: 0,
                            prezzoAlKilo: 0
                        });
                    }
                },
                disabled: function (maschera) {
                    return !dataService.data.admin || maschera === "SA";
                },
                label: 'Add'
            },
            deleteBtn: {
                src: 'images/baseline-remove_circle_outline-24px.svg',
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
                    return !dataService.data.admin || maschera === "SA";
                },
                label: 'Delete'
            },
            copyBtn: {
                src: 'images/baseline-file_copy-24px.svg',
                listener: function (gridOptions, maschera) {
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
                disabled: function (maschera) {
                    return !dataService.data.admin || maschera === "SA";
                },
                label: 'Copy'
            },
            refreshBtn: {
                src: 'images/baseline-refresh-24px.svg',
                listener: function (gridOptions, maschera) {
                    modalService.showSearchingModal();
                    if (maschera === "LM") {
                        return srvc.loadListaMovimenti().finally(function (f) {
                            modalService.hideWaitingModal();
                        });
                    } else if (maschera === "SP") {
                        return spesaService.loadSpesa().finally(function (f) {
                            modalService.hideWaitingModal();
                        });
                    } else if (maschera === "SA"){
                        return salaryService.loadWork().finally(function (f) {
                            modalService.hideWaitingModal();
                        });
                    }
                },
                disabled: function (maschera) {
                    return !dataService.data.admin;
                },
                label: 'Refreshs'
            },
            loadListaMovimenti: function () {

                return $http.get($strings.REST.SERVER + '/ambito').then(function (response) {
                    if (response.data) {
                        response.data.unshift({
                            "ambito": "null",
                            "label": " "
                        });
                    }
                    dataService.data.dropdownAmbito = response.data;
                    return $http.get($strings.REST.SERVER + '/categoria').then(function (response) {
                        if (response.data) {
                            response.data.unshift({
                                "categoria": "null",
                                "label": " "
                            });
                        }
                        dataService.data.dropdownCategoria = response.data;
                        return $http.get($strings.REST.SERVER + '/sottocategoria').then(function (response) {
                            if (response.data) {
                                response.data.unshift({
                                    "sottocategoria": "null",
                                    "label": " "
                                });
                            }
                            dataService.data.dropdownSottocategoria = response.data;
                            return $http.get($strings.REST.SERVER + '/beneficiario').then(function (response) {
                                if (response.data) {
                                    response.data.unshift({
                                        "beneficiario": "null",
                                        "label": " "
                                    });
                                }
                                dataService.data.dropdownBeneficiario = response.data;
                                return $http.get($strings.REST.SERVER + '/tipoConto').then(function (response) {
                                    dataService.data.editDropDownTipoContoArray = response.data;
                                    return $http.get($strings.REST.SERVER + '/conto').then(function (response) {
                                        dataService.data.editDropDownContoArray = response.data;
                                        return $http.get($strings.REST.SERVER + '/all').then(function (response) {
                                            var resultsData = [];
                                            response.data.forEach(function (row) {
                                                var newRow = {};
                                                newRow.id = row['ID'];
                                                newRow.data = new Date(row['DATA_VAL']);
                                                newRow.ambito = row['AMBITO'];
                                                newRow.categoria = row['CATEGORIA'];
                                                newRow.sottocategoria = row['SOTTOCATEGORIA'];
                                                newRow.beneficiario = row['BENEFICIARIO'];
                                                newRow.tipoConto = row['TP_CONTO'];
                                                newRow.conto = row['CONTO'];
                                                newRow.contabilizzata = row['FL_CONT'] === 'SI' ? true : false;
                                                newRow.budget = row['BUDGET'] === 'SI' ? true : false;
                                                newRow.visualizzare = row['FL_VISL'] === 'SI' ? true : false;
                                                newRow.cartaCredito = row['FL_CC'] === 'SI' ? true : false;
                                                newRow.webapp = row['WEBAPP'] === 'SI' ? true : false;
                                                newRow.fissa = row['FISSA'] === 'SI' ? true : false;
                                                newRow.importo = row['VALUE'];
                                                newRow.info = row['INFO'];
                                                newRow.anno = new Date(row['DATA_VAL']).getFullYear();
                                                newRow.mese = new Date(row['DATA_VAL']).getMonth() + 1;
                                                return resultsData.push(newRow);
                                            });
                                            dataService.data.backupData = angular.copy(resultsData);
                                            srvc.gridOptions.data = resultsData;
                                            srvc.gridOptions.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownAmbito;
                                            srvc.gridOptions.columnDefs[2].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                                            srvc.gridOptions.columnDefs[3].editDropdownOptionsArray = dataService.data.dropdownSottocategoria;
                                            srvc.gridOptions.columnDefs[4].editDropdownOptionsArray = dataService.data.dropdownBeneficiario;
                                            srvc.gridOptions.columnDefs[5].editDropdownOptionsArray = dataService.data.editDropDownTipoContoArray;
                                            srvc.gridOptions.columnDefs[6].editDropdownOptionsArray = dataService.data.editDropDownContoArray;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        };
        return srvc;
    }]);
})();
