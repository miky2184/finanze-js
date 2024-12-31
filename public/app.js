(function () {
    'use strict';
    angular.module('myApp', ['ngMaterial', 'ngMessages', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView', 'nvd3', 'ui.grid.pinning', 'ui.grid.autoResize']).config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    }]).config(['$httpProvider', function ($httpProvider) {
        // Aggiunge l'interceptor alle richieste HTTP
        $httpProvider.interceptors.push('authInterceptor');
      }]).controller('MainController', ['$scope', '$strings', 'commonService', 'budgetService', 'dataService', 'listaMovimentiService', 'andamentoAnnuoService', 'settingsService', 'salaryService', 'balanceService', 'graficoService', 'andamentoMeseService', 'passwordService', 'speseAnnualiService', 'modalService', 'loggingService', function ($scope, $strings, commonService, budgetService, dataService, listaMovimentiService, andamentoAnnuoService, settingsService, salaryService, balanceService, graficoService, andamentoMeseService, passwordService, speseAnnualiService, modalService, loggingService) {
        

        // Inizializza il tab attivo
        $scope.activeTab = 0;

        // Cambia il tab attivo
        $scope.changeTab = function (index) {
            $scope.activeTab = index;
        };

        /* PARAMETRI */
        /* LOGIN */
        $scope.disabled = false;
        $scope.logged = function () {
            return dataService.data.logged;
        };
        $scope.admin = function () {
            return !dataService.data.admin;
        };
        $scope.idDb = function () {
            return dataService.data.idDb;
        };
        $scope.disablePasswordPage = function () {
            return !dataService.data.disablePasswordPage;
        };
        $scope.disableSalaryPage = function () {
            return !dataService.data.disableSalaryPage;
        };

        $scope.login = function () {
            //loggingService.logWithTimestamp("login - show modal");
            modalService.showModal('Login in corso...') // Mostra il popup
              .then(function () {
                //loggingService.logWithTimestamp("Modal fully rendered, starting login");
                var datiAccesso = {
                  username: $scope.username,
                  pwd: $scope.password
                };
                return commonService.login(datiAccesso).then(function (result) {
                    $scope.alerts = dataService.data.alerts;
                    $scope.conti = dataService.data.editDropDownContoArray;
                    $scope.years = dataService.data.years;
                  });
              }).finally(function () {
                //loggingService.logWithTimestamp("login - hide modal");
                modalService.hideModal();
              });
          };

        /* BUTTON */
        $scope.actionButtons = [];
        $scope.actionButtons.push(listaMovimentiService.addBtn);
        $scope.actionButtons.push(listaMovimentiService.deleteBtn);
        $scope.actionButtons.push(listaMovimentiService.copyBtn);
        $scope.actionButtons.push(listaMovimentiService.refreshBtn);
        $scope.actionButtons.push(listaMovimentiService.addOneYearBtn);

        $scope.saveButtons = [];
        $scope.saveButtons.push(commonService.printBtn);
        $scope.saveButtons.push(commonService.saveBtn);
        $scope.saveButtons.push(commonService.cancelBtn);
        $scope.saveButtons.push(commonService.exitBtn);        

        /* API GRAFICI */
        $scope.callbackGrafico = function (scope, element) {
            dataService.data.apiGrafico = scope.api;
        };

        //$scope.years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
        $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.alerts = [];
        $scope.pivot = $strings.PIVOT;

        /*********************************
            TAB LISTA MOVIMENTI
         *********************************/
        $scope.gridOptions = listaMovimentiService.gridOptions;

        /*********************
          TAB BILANCIO
         *********************/
        $scope.gridOptionsBalance = balanceService.gridOptionsBalance;
        $scope.gridOptionsAvere = balanceService.gridOptionsAvere;
        $scope.loadBalance = function () {
            return balanceService.loadBalance();
        };

        /*********************
          TAB SETTINGS
         *********************/
        $scope.settingButtons = [];
        $scope.settingButtons.push(settingsService.addSettingBtn);
        $scope.settingButtons.push(settingsService.deleteSettingBtn);
        $scope.gridOptionsAmb = settingsService.gridOptionsAmb;
        $scope.gridOptionsCat = settingsService.gridOptionsCat;
        $scope.gridOptionsSott = settingsService.gridOptionsSott;
        $scope.gridOptionsBen = settingsService.gridOptionsBen;
        $scope.gridOptionsAmbCat = settingsService.gridOptionsAmbCat;
        $scope.gridOptionsCatSott = settingsService.gridOptionsCatSott;
        $scope.gridOptionsConto = settingsService.gridOptionsConto;

        /*********************
          TAB GRAFICO
         *********************/
        $scope.loadGrafico = function () {
            return graficoService.loadGrafico($scope.pivot.year).then(function (fn) {
                $scope.dataGrafico = dataService.data.dataGrafico;
                $scope.optionsGrafico = dataService.data.optionsGrafico;                
                return graficoService.loadGraficoSpesoTotalePerAnno().then(function(fn){
                    $scope.dataGraficoSpesoTotalePerAnno = dataService.data.dataGraficoSpesoTotalePerAnno;
                    $scope.optionsGraficoSpesoTotalePerAnno = dataService.data.optionsGraficoSpesoTotalePerAnno;
                });                           
            });
        };

        $scope.loadGraficoCategorie = function () {
            return graficoService.loadGraficoPie($scope.pivot.year).then(function (fn) {
                $scope.dataGraficoPie = dataService.data.dataGraficoPie;
                $scope.optionsGraficoPie = dataService.data.optionsGraficoPie;
                return graficoService.loadGraficoPieCategoria($scope.pivot.year).then(function (fn) {
                    $scope.dataGraficoPieCategoria = dataService.data.dataGraficoPieCategoria;
                    $scope.optionsGraficoPieCategoria = dataService.data.optionsGraficoPieCategoria;
                    return graficoService.loadGraficoPiePersonale($scope.pivot.year).then(function (fn) {
                        $scope.dataGraficoPiePersonale = dataService.data.dataGraficoPiePersonale;
                        $scope.optionsGraficoPiePersonale = dataService.data.optionsGraficoPiePersonale;
                        return graficoService.loadGraficoPiePersonaleCategoria($scope.pivot.year).then(function (fn) {
                            $scope.dataGraficoPiePersonaleCategoria = dataService.data.dataGraficoPiePersonaleCategoria;
                            $scope.optionsGraficoPiePersonaleCategoria = dataService.data.optionsGraficoPiePersonaleCategoria;                                
                        });
                    });
                });
            });            
        };

        /*********************
          TAB PIVOT MESE
         *********************/
        $scope.gridOptionPivotMese = andamentoMeseService.gridOptionPivotMese;
        $scope.loadPivotMese = function () {
            return andamentoMeseService.loadPivotMese($scope.pivot.year).then(function(resp){
                $scope.dataGrafico = dataService.data.dataGrafico;
                $scope.optionsGrafico = dataService.data.optionsGrafico;
            });
        };

        /*********************
          TAB WORK
         *********************/
        $scope.gridOptionsSalary = salaryService.gridOptionsSalary;
        $scope.loadWork = function () {
            return salaryService.loadWork();
        };

        /*********************
          TAB ANDAMENTO ANNUO
         *********************/
        $scope.gridOptionAndamentoAnnuo = andamentoAnnuoService.gridOptionAndamentoAnnuo;
        $scope.loadAndamentoAnnuo = function () {
            return andamentoAnnuoService.loadAndamentoAnnuo().then(function(resp){
                $scope.dataGrafico = dataService.data.dataGrafico;
                $scope.optionsGrafico = dataService.data.optionsGrafico;
            });
        };

        /*********************
            TAB BUDGET
        *********************/
        $scope.gridBudget = budgetService.gridBudget;
        $scope.loadBudget = function () {
            return budgetService.loadBudget($scope.pivot);
        };

        /*********************
            TAB DEF BUDGET
        *********************/
        $scope.gridDefBudget = budgetService.gridDefBudget;
        $scope.loadDefBudget = function () {
            return budgetService.loadDefBudget($scope.pivot).then(function (fn) {
                return budgetService.loadGraficoBudget($scope.pivot).then(function (fn) {
                    $scope.dataGraficoPieBudget = dataService.data.dataGraficoPieBudget;
                    $scope.optionsGraficoPieBudget = dataService.data.optionsGraficoPieBudget;
                });
            });
        };

        $scope.copyBudgetFromPreviousYear = function () {            
            return budgetService.copyBudget($scope.pivot).then(function (response) {                
                $scope.loadDefBudget(); // Ricarica il budget per l'anno corrente.
            }).catch(function (error) {
                alert('Errore durante la copia del budget.');
            });            
        };

        /*********************
            TAB SPESE ANNUE
        *********************/
       $scope.gridSpeseAnnuali = speseAnnualiService.gridSpeseAnnuali;
       $scope.loadSpeseAnnue = function () {
           return speseAnnualiService.loadSpeseAnnue($scope.pivot);
       };

        /*********************
            TAB PASSWORD
        *********************/
        $scope.gridOptionsPassword = passwordService.gridOptionsPassword;
        $scope.loadPassword = function () {
            return passwordService.loadPassword();
        };

    }]).filter('griddropdown', function () {
        return function (input, context) {
            if (context != 'this'){
                var fieldLevel = !context.editDropdownOptionsArray ? context.col.colDef : context;
                var map = fieldLevel.editDropdownOptionsArray;
                var idField = fieldLevel.editDropdownIdLabel;
                var valueField = fieldLevel.editDropdownValueLabel;
                var initial = context.row ? context.row.entity[context.col.field] : context.entity[context.col.field];
                var retValue = initial || input
                if (map) {
                    for (var i = 0; i < map.length; i++) {
                        if (map[i][idField] === input) {
                            retValue = map[i][valueField];
                        }
                    }
                }
                return retValue;
            }
        };
    }).filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
}());
