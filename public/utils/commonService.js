(function () {
    'use strict';
    angular.module('myApp').factory('commonService', ['modalService', '$http', '$interval', 'dataService', 'listaMovimentiService', 'settingsService', 'matchAnalysisService', 'salaryService', '$uibModal', '$q', 'spesaService', 'settingsSpesaService', '$strings', 'predmatchService', function (modalService, $http, $interval, dataService, listaMovimentiService, settingsService, matchAnalysisService, salaryService, $uibModal, $q, spesaService, settingsSpesaService, $strings, predmatchService) {
        var srvc = {
            loadData: function () {
                return listaMovimentiService.loadListaMovimenti();/*.then(function (f) {
                    return spesaService.loadSpesa();
                });*/
            },
            login: function (datiAccesso) {
                dataService.data.alerts = [];
                return $http.post($strings.REST.SERVER + '/login', datiAccesso).then(function (resp) {
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
                        dataService.data.alerts.push({
                            msg: 'Username e/o Password errate!!!',
                            type: 'danger'
                        });
                    }
                }).finally(function (fn) {
                    modalService.hideWaitingModal();
                    /* if (dataService.data.alerts.length == 0) {
                        $interval(listaMovimentiService.gridOptions.gridApi.core.handleWindowResize, 100, 10);
                    } */
                });
            },
            salva: function salva() {
                var dto = {};
                dto.settings = {};
                dto.settingsSpesa = {};
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
                }) ;
                dto.risultatipred = predmatchService.gridOptionsPredMatch.data.filter(function (row) {
                    return row.dirty;
                });                
                /* dto.spesa = spesaService.gridOptionsSpesa.data.filter(function (row) {
                    return row.dirty && !(row.newRow && row.deleted);
                });
                dto.settingsSpesa.reparti = dataService.data.dropdownReparto.filter(function (r) {
                    return r.dirty;
                });
                dto.settingsSpesa.sottoreparti = dataService.data.dropdownSottoreparto.filter(function (s) {
                    return s.dirty;
                });
                dto.settingsSpesa.famiglie = dataService.data.dropdownFamiglia.filter(function (f) {
                    return f.dirty;
                });
                dto.settingsSpesa.reprsott = settingsSpesaService.gridOptionsReprSott.data.filter(function (rs) {
                    return rs.dirty;
                });
                dto.settingsSpesa.sottfamg = settingsSpesaService.gridOptionsSottFamg.data.filter(function (sf) {
                    return sf.dirty;
                }); */
                if (dataService.data.dirty) {
                    var modalSavingInstance = $uibModal.open({
                        size: 'sm',
                        templateUrl: 'templates/modal/savingModal.html',
                        backdrop: false,
                        keyboard: false
                    });
                    return $http.post($strings.REST.SERVER + '/save', dto).then(function (resp) {
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
                label: $strings.MODAL.ANNULLA,
                listener: function (gridOptions) {
                    var deferred = $q.defer();
                    if (dataService.data.dirty) {
                        var promise = modalService.showYesNoModal($strings.MODAL.WARNING, $strings.MODAL.ANNULLA_MSG, $strings.MODAL.OK, $strings.MODAL.ANNULLA);
                        promise.then(function () {
                            listaMovimentiService.gridOptions.data = angular.copy(dataService.data.backupData);
                            spesaService.gridOptionsSpesa.data = angular.copy(dataService.data.backupDataSpesa);
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
            },
            exitBtn: {
                label: 'Esci',
                listener: function () {

                    var deferred = $q.defer();
                    if (dataService.data.dirty) {
                        var promise = modalService.showYesNoModal($strings.MODAL.WARNING, $strings.MODAL.EXIT_MSG, $strings.MODAL.OK, $strings.MODAL.ANNULLA);
                        promise.then(function () {
                            dataService.data.logged = false;
                            dataService.data.admin = false;
                            dataService.data.dirty = false;
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                    } else {
                        dataService.data.logged = false;
                        dataService.data.admin = false;
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
