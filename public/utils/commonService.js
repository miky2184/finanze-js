(function () {
    'use strict';
    angular.module('myApp').factory('commonService', ['modalService', '$http', 'dataService', 'listaMovimentiService', 'settingsService', 'salaryService', '$uibModal', '$q', '$strings', 'passwordService', 'budgetService', function (modalService, $http, dataService, listaMovimentiService, settingsService, salaryService, $uibModal, $q, $strings, passwordService, budgetService) {
        var srvc = {
            loadData: function () {
                return listaMovimentiService.loadListaMovimenti(dataService.data.idDb);
            },
            login: function (datiAccesso) {
                dataService.data.alerts = [];
                return $http.post($strings.REST.SERVER + '/login', datiAccesso).then(function (resp) {
                    modalService.showSearchingModal();
                    if (resp.data && resp.data.length === 1) {                        
                        dataService.data.admin = resp.data[0]['admin'];
                        dataService.data.idDb = resp.data[0]['id_db'];
                        dataService.data.disablePasswordPage = resp.data[0]['disable_password_page'];
                        dataService.data.disableSalaryPage = resp.data[0]['disable_salary_page'];
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
                });
            },
            salva: function salva() {
                var dto = {};
                dto.settings = {};
                dto.settingsSpesa = {};
                dto.links = {};
                dto.common = {};
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
                dto.budget = budgetService.gridDefBudget.data.filter(function(row){
                    return row.dirty && !(row.newRow && row.deleted);;
                });
                dto.passwords = passwordService.gridOptionsPassword.data.filter(function(pwd){
                    return pwd.dirty;
                });
                if (dataService.data.dirty) {
                    var modalSavingInstance = $uibModal.open({
                        size: 'lg',
                        templateUrl: 'templates/modal/savingModal.html',
                        backdrop: false,
                        keyboard: false
                    });
                    dto.common['id_db'] = dataService.data.idDb; 
                    return $http.post($strings.REST.SERVER + '/salva', dto).then(function (resp) {
                        return srvc.loadData().then(function(resp) {
                            settingsService.loadSettings();
                            passwordService.loadPassword();
                            budgetService.loadDefBudget();
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
                },
                icon: 'save' 
            },
            cancelBtn: {
                label: $strings.MODAL.ANNULLA,
                listener: function (gridOptions) {
                    var deferred = $q.defer();
                    if (dataService.data.dirty) {
                        var promise = modalService.showYesNoModal($strings.MODAL.WARNING, $strings.MODAL.ANNULLA_MSG, $strings.MODAL.OK, $strings.MODAL.ANNULLA);
                        promise.then(function () {
                            listaMovimentiService.gridOptions.data = angular.copy(dataService.data.backupData);                            
                            budgetService.gridDefBudget.data = angular.copy(dataService.data.backupDataDefBudget);
                            dataService.data.dirty = false;
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                    }
                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                icon: 'cancel'
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
                            dataService.data.idDb = null;
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                    } else {
                        dataService.data.logged = false;
                        dataService.data.admin = false;
                        dataService.data.idDb = null;
                    }


                },
                disabled: function () {
                    return !dataService.data.admin;
                },
                icon: 'exit_to_app'
            }
        };
        return srvc;
    }]);
})();
