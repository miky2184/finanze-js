(function () {
    'use strict';
    angular.module('myApp').factory('commonService', ['modalService', '$http', '$interval', 'dataService', 'listaMovimentiService', 'settingsService', 'matchAnalysisService', 'salaryService', '$uibModal', '$q', function (modalService, $http, $interval, dataService, listaMovimentiService, settingsService, matchAnalysisService, salaryService, $uibModal, $q) {
        var srvc = {
            loadData: function () {
                return $http.get('http://93.55.248.37:3001/ambito').then(function (response) {
                    if (response.data) {
                        response.data.unshift({
                            "ambito": "null",
                            "label": " "
                        });
                    }
                    dataService.data.dropdownAmbito = response.data;
                    return $http.get('http://93.55.248.37:3001/categoria').then(function (response) {
                        if (response.data) {
                            response.data.unshift({
                                "categoria": "null",
                                "label": " "
                            });
                        }
                        dataService.data.dropdownCategoria = response.data;
                        return $http.get('http://93.55.248.37:3001/sottocategoria').then(function (response) {
                            if (response.data) {
                                response.data.unshift({
                                    "sottocategoria": "null",
                                    "label": " "
                                });
                            }
                            dataService.data.dropdownSottocategoria = response.data;
                            return $http.get('http://93.55.248.37:3001/beneficiario').then(function (response) {
                                if (response.data) {
                                    response.data.unshift({
                                        "beneficiario": "null",
                                        "label": " "
                                    });
                                }
                                dataService.data.dropdownBeneficiario = response.data;
                                return $http.get('http://93.55.248.37:3001/tipoConto').then(function (response) {
                                    dataService.data.editDropDownTipoContoArray = response.data;
                                    return $http.get('http://93.55.248.37:3001/conto').then(function (response) {
                                        dataService.data.editDropDownContoArray = response.data;
                                        return $http.get('http://93.55.248.37:3001/all').then(function (response) {
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
                                            listaMovimentiService.gridOptions.data = resultsData;
                                            listaMovimentiService.gridOptions.columnDefs[1].editDropdownOptionsArray = dataService.data.dropdownAmbito; 
                                            listaMovimentiService.gridOptions.columnDefs[2].editDropdownOptionsArray = dataService.data.dropdownCategoria;
                                            listaMovimentiService.gridOptions.columnDefs[3].editDropdownOptionsArray = dataService.data.dropdownSottocategoria;
                                            listaMovimentiService.gridOptions.columnDefs[4].editDropdownOptionsArray = dataService.data.dropdownBeneficiario;
                                            listaMovimentiService.gridOptions.columnDefs[5].editDropdownOptionsArray = dataService.data.editDropDownTipoContoArray;
                                            listaMovimentiService.gridOptions.columnDefs[6].editDropdownOptionsArray = dataService.data.editDropDownContoArray;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            },
            logout: function () {
                dataService.data.logged = false;
                dataService.data.admin = false;
            },
            login: function (datiAccesso) {
                return $http.post('http://93.55.248.37:3001/login', datiAccesso).then(function (resp) {
                    modalService.showSearchingModal();
                    if (resp.data && resp.data.length === 1) {
                        dataService.data.descName = resp.data[0]['NAME'];
                        dataService.data.admin = resp.data[0]['PROFILE'] === 'admn' ? true : false;
                        dataService.data.logged = true;
                        return srvc.loadData().then(function (resp) {
                            if (dataService.data.admin) {
                                settingsService.loadSettings();
                            }
                        });
                    } else {
                        dataService.data.alerts = [];
                        dataService.data.alerts.push({
                            msg: 'Username e/o Password errate!!!',
                            type: 'danger'
                        });
                        modalService.hideWaitingModal();
                    }
                }).finally(function (fn) {
                    modalService.hideWaitingModal();
                    $interval(listaMovimentiService.gridOptions.gridApi.core.handleWindowResize, 100, 10);
                });
            },
            salva: function salva() {
                var dto = {};
                dto.settings = {};
                dto.links = {};
                dto.settings.ambiti = dataService.data.dropdownAmbito.filter(function (ambito) {
                    return ambito.dirty;
                });
                dto.settings.categorie = dataService.data.dropdownCategoria.filter(function (categoria) {
                    return categoria.dirty;
                });
                dto.settings.sottocategorie = dataService.data.dropdownSottocategoria.filter(function (sottocategoria) {
                    return sottocategoria.dirty;
                });
                dto.settings.beneficiari = dataService.data.dropdownBeneficiario.filter(function (beneficiario) {
                    return beneficiario.dirty;
                });
                dto.links.ambitocategoria = settingsService.gridOptionsAmbCat.data.filter(function (ambcat) {
                    return ambcat.dirty;
                });
                dto.links.categoriasottocategoria = settingsService.gridOptionsCatSott.data.filter(function (catsott) {
                    return catsott.dirty;
                });
                dto.finanze = listaMovimentiService.gridOptions.data.filter(function (row) {
                    return row.dirty && !(row.newRow && row.deleted);
                });
                dto.salary = salaryService.gridOptionsSalary.data.filter(function (row) {
                    return row.dirty;
                });
                dto.risultati = matchAnalysisService.gridOptionsNextGame.data.filter(function (row) {
                    return row.dirty;
                });
                if (dataService.data.dirty) {
                    var modalSavingInstance = $uibModal.open({
                        size: 'sm',
                        templateUrl: 'templates/modal/savingModal.html',
                        backdrop: false,
                        keyboard: false
                    });
                    return $http.post('http://93.55.248.37:3001/save', dto).then(function (resp) {
                        return srvc.loadData().then(function (resp) {
                            settingsService.loadSettings()
                        });
                    }).finally(function (fn) {
                        dataService.data.dirty = false;
                        modalSavingInstance.close();
                    });
                }
            },
            saveBtn: {
                label: 'Salva',
                listener: function () {
                    return srvc.salva();
                },
                disabled: function () {
                    return !dataService.data.admin;
                }
            },
            cancelBtn: {
                label: 'Annulla',
                listener: function (gridOptions) {
                    var deferred = $q.defer();
                    if (dataService.data.dirty) {
                        var promise = modalService.showYesNoModal('Attenzione', "Ci sono delle modifiche pending non salvate, sei sicuro di voler annullare??", 'OK', 'Annulla');
                        promise.then(function () {
                            gridOptions.data = angular.copy(dataService.data.backupData);
                            dataService.data.dirty = false;
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                }
            }
        };
        return srvc;
    }]);
})();
