(function () {
    'use strict';
    angular.module('myApp').factory('spesaService', ['modalService', '$http', '$interval', 'dataService', '$rootScope', 'settingsSpesaService', '$strings', function (modalService, $http, $interval, dataService, $rootScope, settingsSpesaService, $strings) {
        var scope = $rootScope.$new();
        var afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            dataService.data.dirty = true;
            rowEntity.dirty = true;
            var dto = {}; 
            switch (colDef.name) {
                case 'reparto':
                    rowEntity.sottoreparto = "";
                    rowEntity.famiglia = "";                    
                    break;
                case 'sottoreparto':
                    rowEntity.famiglia = "";             
                    break;                
                case 'EAN':                        
                        rowEntity.descrizione = "";                    
                    if (rowEntity.EAN && rowEntity.EAN.length > 3){
                        dto.reparto = rowEntity.reparto;
                        dto.sottoreparto = rowEntity.sottoreparto;
                        dto.famiglia = rowEntity.famiglia;
                        dto.ean = rowEntity.EAN;                        
                        return $http.post($strings.REST.SERVER+'/validaEan', dto).then(function (resp) {                            
                            if (resp.data && resp.data.length === 1) {
                                rowEntity.reparto = resp.data[0].reparto;
                                rowEntity.sottoreparto = resp.data[0].sottoreparto;
                                rowEntity.famiglia = resp.data[0].famiglia;
                                rowEntity.EAN = resp.data[0].ean;
                                rowEntity.descrizione = resp.data[0].descrizione;    
                                rowEntity.pesoGrammi = resp.data[0].pesoGrammi;
                            } else if (resp.data && resp.data.length > 1) {
                                var text = "";
                                resp.data.forEach(function(fn){ text = text + fn.ean + ' - ' + fn.descrizione + '<br/>';});
                                modalService.showErrorModal("VALIDAZIONE EAN", "SONO PRESENTI DIVERSI EAN, A QUALE TI REFERISCI?: <br/> " + text,"OK");
                            } else {
                                modalService.showErrorModal("VALIDAZIONE EAN", "NESSUN EAN TROVATO" ,"OK" );
                            }                      
                        });
                        }
                    break;
               /* case 'descrizione':                                
                        dto.reparto = rowEntity.reparto;
                        dto.sottoreparto = rowEntity.sottoreparto;
                        dto.famiglia = rowEntity.famiglia;
                        dto.referenza = newValue;
                        return $http.post($strings.REST.SERVER+'/validaReferenza', dto).then(function (resp) {                            
                            if (resp.data && resp.data.length === 1) {
                                rowEntity.reparto = resp.data[0].reparto;
                                rowEntity.sottoreparto = resp.data[0].sottoreparto;
                                rowEntity.famiglia = resp.data[0].famiglia;
                                rowEntity.EAN = resp.data[0].ean;
                                rowEntity.descrizione = resp.data[0].descrizione;                                
                            } else if (resp.data && resp.data.length > 1) {
                                var text = "";
                                resp.data.forEach(function(fn){ text = text + fn.ean + ' - ' + fn.descrizione + '<br/>';});
                                modalService.showErrorModal("VALIDAZIONE REFERENZA", "SONO PRESENTI DIVERSI REFERENZE, A QUALE TI REFERISCI?: <br/> " + text, "OK");
                            } else {
                                modalService.showErrorModal("VALIDAZIONE REFERENZA", "NESSUNA REFERENZA TROVATA" ,"OK" );
                            }                      
                        });
                    break; */
                case 'prezzo':
                    rowEntity.prezzoAlKilo = Math.round(((1000 / rowEntity.pesoGrammi) * newValue) * 100) / 100;
                    break;
                case 'pesoGrammi':
                    rowEntity.prezzoAlKilo = Math.round(((1000 / newValue) * rowEntity.prezzo) * 100) / 100;
                    break;
                default:
                    break;
            }
        };
        var srvc = {
            gridOptionsSpesa: {
                minRowsToShow: 21,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                rowTemplate: 'templates/rows/deletableRow.html',
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'dataSpesa',
                    field: 'dataSpesa',
                    displayName: 'Data',
                    width: 90,
                    type: 'date',
                    cellFilter: 'date:\'yyyy-MM-dd\''
                }, {
                    name: 'reparto',
                    displayName: 'Reparto',
                    field: 'reparto',
                    width: 200,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'reparto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray.filter(function (a) {
                            return !a.deleted;
                        });
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownReparto) {
                                var cell = dataService.data.dropdownReparto.filter(function (reparto) {
                                    return reparto.reparto === cellValue;
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
                    name: 'sottoreparto',
                    displayName: 'Sottoreparto',
                    field: 'sottoreparto',
                    width: 300,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'sottoreparto',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray.filter(function (a) {
                            return a.reparto === rowEntity.reparto && !a.deleted;
                        });
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownSottoreparto) {
                                var cell = dataService.data.dropdownSottoreparto.filter(function (sottoreparto) {
                                    return sottoreparto.sottoreparto === cellValue;
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
                    name: 'famiglia',
                    displayName: 'Famiglia',
                    field: 'famiglia',
                    width: 300,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'famiglia',
                    editDropdownValueLabel: 'label',
                    cellFilter: 'griddropdown:this',
                    editDropdownOptionsFunction: function (rowEntity, colDef) {
                        return colDef.editDropdownOptionsArray.filter(function (a) {
                            return a.sottoreparto === rowEntity.sottoreparto && !a.deleted;
                        });
                    },
                    filter: {
                        condition: function (searchTerm, cellValue, row, column) {
                            if (dataService.data.dropdownFamiglia) {
                                var cell = dataService.data.dropdownFamiglia.filter(function (famiglia) {
                                    return famiglia.famiglia === cellValue;
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
                    name: 'EAN',
                    displayName: 'EAN',
                    field: 'EAN',
                    type: 'text',
                    width: 120 
                }, {
                    name: 'descrizione',
                    displayName: 'Descrizione Referenza',
                    field: 'descrizione',
                    type: 'text',
                    width: 300                    
                }, {
                    name: 'prezzo',
                    displayName: 'Prezzo Acqs.',
                    field: 'prezzo',
                    type: 'number',
                    width: 50
                }, {
                    name: 'peso',
                    displayName: 'Peso/Pezzi',
                    field: 'peso',                    
                    width: 80,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-balance-scale'
                }, {
                    name: 'pesoGrammi',
                    displayName: 'gr.',
                    field: 'pesoGrammi',
                    type: 'number',
                    width: 80
                }, {
                    name: 'prezzoAlKilo',
                    displayName: 'Prezzo al Kg',
                    field: 'prezzoAlKilo',
                    type: 'number',
                    width: 50
                }, {
                    name: 'negozio',
                    displayName: 'Negozio',
                    field: 'negozio',
                    type: 'text',
                    width: '*'
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsSpesa.gridApi = gridApi;
                    gridApi.edit.on.afterCellEdit(scope, afterCellEditFunction);
                }
            },
            loadSpesa: function () {
                return $http.get($strings.REST.SERVER+'/reparto').then(function (resp) {
                    if (resp.data) {
                        resp.data.unshift({
                            "reparto": "",
                            "label": " "
                        });
                    }
                    dataService.data.dropdownReparto = resp.data;
                    return $http.get($strings.REST.SERVER+'/sottoreparto').then(function (resp) {
                        if (resp.data) {
                            resp.data.unshift({
                                "sottoreparto": "",
                                "label": " "
                            });
                        }
                        dataService.data.dropdownSottoreparto = resp.data;
                        return $http.get($strings.REST.SERVER+'/famiglia').then(function (resp) {
                            if (resp.data) {
                                resp.data.unshift({
                                    "famiglia": "",
                                    "label": " "
                                });
                            }
                            dataService.data.dropdownFamiglia = resp.data;
                            return $http.get($strings.REST.SERVER+'/spesa').then(function (resp) {
                                resp.data.map(function(r){
                                   r.peso = r.peso === 'T' ? true : false;
                                   return r;
                                });
                                dataService.data.backupDataSpesa = angular.copy(resp.data);
                                srvc.gridOptionsSpesa.data = resp.data;
                                srvc.gridOptionsSpesa.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownReparto;
                                srvc.gridOptionsSpesa.columnDefs[2].editDropdownOptionsArray = dataService.data.dropdownSottoreparto;
                                srvc.gridOptionsSpesa.columnDefs[3].editDropdownOptionsArray = dataService.data.dropdownFamiglia;
                                $interval(srvc.gridOptionsSpesa.gridApi.core.handleWindowResize, 100, 10);
                                settingsSpesaService.loadSettingsSpesa();
                            });
                        });
                    });
                });
            }
        };
        return srvc;
    }]);
})();
