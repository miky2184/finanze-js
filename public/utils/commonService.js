(function () {
    'use strict';
    angular.module('myApp').factory('commonService', ['modalService', '$http', '$interval', 'dataService', 'listaMovimentiService', 'settingsService', 'matchAnalysisService', 'salaryService', '$uibModal', '$q', 'spesaService', 'settingsSpesaService', function (modalService, $http, $interval, dataService, listaMovimentiService, settingsService, matchAnalysisService, salaryService, $uibModal, $q, spesaService, settingsSpesaService) {
        var srvc = {
            loadData: function () {
                return listaMovimentiService.loadListaMovimenti().then(function(f){
                    return spesaService.loadSpesa();
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
                });
                dto.spesa = spesaService.gridOptionsSpesa.data.filter(function (row) {
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
            }
        };
        return srvc;
    }]);
})();
