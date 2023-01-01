(function () {
    'use strict';
    angular.module('myApp', ['ngMaterial', 'ngMessages', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView', 'nvd3', 'ui.grid.pinning', 'ui.grid.autoResize', 'barcodeScanner']).config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    }]).controller('MainController', ['$scope', '$http', '$strings', 'commonService', 'spesaService', 'budgetService', 'reportMeseService', 'fantacalcioService', 'matchAnalysisService', 'amazonService', 'dataService', 'listaMovimentiService', 'andamentoAnnuoService', 'settingsService', 'salaryService', 'balanceService', 'pivotAnnoService', 'graficoService', 'andamentoMeseService', 'settingsSpesaService', 'pivotSpesaService', 'passwordService', 'predmatchService', 'speseAnnualiService', 'extraBudgetService', 'andamentoAnnuoPersonaleService', function ($scope, $http, $strings, commonService, spesaService, budgetService, reportMeseService, fantacalcioService, matchAnalysisService, amazonService, dataService, listaMovimentiService, andamentoAnnuoService, settingsService, salaryService, balanceService, pivotAnnoService, graficoService, andamentoMeseService, settingsSpesaService, pivotSpesaService, passwordService, predmatchService, speseAnnualiService, extraBudgetService, andamentoAnnuoPersonaleService) {

        $scope.triggerChar = 9;
        $scope.separatorChar = 13;
        $scope.triggerCallback = function () {
            $scope.$apply();
        };
        $scope.scanCallback = function (word) {
            $scope.$apply();
        };

        /* PARAMETRI */
        /* LOGIN */
        $scope.disabled = false;
        $scope.logged = function () {
            return dataService.data.logged;
        };
        $scope.admin = function () {
            return dataService.data.admin;
        };

        $scope.login = function () {
            var datiAccesso = {
                username: $scope.username,
                pwd: $scope.password
            };
            return commonService.login(datiAccesso).then(function (result) {
                $scope.alerts = dataService.data.alerts;
            });
        }

        /* BUTTON */
        $scope.actionButtons = [];
        // $scope.actionButtons.push(listaMovimentiService.exportBtn);
        $scope.actionButtons.push(listaMovimentiService.addBtn);
        $scope.actionButtons.push(listaMovimentiService.deleteBtn);
        $scope.actionButtons.push(listaMovimentiService.copyBtn);
        $scope.actionButtons.push(listaMovimentiService.refreshBtn);

        $scope.saveButtons = [];
        $scope.saveButtons.push(commonService.saveBtn);
        $scope.saveButtons.push(commonService.cancelBtn);
        $scope.saveButtons.push(commonService.exitBtn);

        /* API GRAFICI */
        $scope.callbackGrafico = function (scope, element) {
            dataService.data.apiGrafico = scope.api;
        };        
        
        $scope.division = {};
        $scope.division.value = {id:'ITA'};
        $scope.season = {};
        $scope.season.value = {id:1920};
        $scope.giornata = {};
        $scope.giornata.value = {};
        $scope.fanta = {};
        $scope.fanta.value = {};

        $scope.fantacalcio = [{
            id: 1,
            name: $strings.FANTACALCIO.FANTAFIGHETTINO
        }, {
            id: 2,
            name: $strings.FANTACALCIO.FANTAMARELLI
        }, {
            id: 3,
            name: $strings.FANTACALCIO.FANTABOMBOLACCI        
        }];
        $scope.divisions = [];
        $scope.seasons = [];
        $scope.seasonsPreMatch = [];
        $scope.giornate = [];
        $scope.scontriDiretti = {};
        $scope.years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
        $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.alerts = [];
        $scope.conti = [{
            "tipoConto": 1,
            "label": $strings.CONTO.CONTO_COMUNE
        }, {
            "tipoConto": 2,
            "label": $strings.CONTO.CONTO_PERSONALE
        }];
        $scope.pivot = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            tipoConto: 1
        };

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
           TAB PIVOT ANNO
         *********************/
        $scope.gridOptionPivotAnno = pivotAnnoService.gridOptionPivotAnno;
        $scope.loadPivotAnno = function () {
            return pivotAnnoService.loadPivotAnno($scope.pivot.year, $scope.pivot.tipoConto);
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

        /*********************
          TAB GRAFICO
         *********************/
        $scope.loadGrafico = function () {
            return graficoService.loadGrafico($scope.pivot.year).then(function (fn) {
                $scope.dataGrafico = dataService.data.dataGrafico;
                $scope.optionsGrafico = dataService.data.optionsGrafico;
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
                                return graficoService.loadGraficoSpesoTotalePerAnno().then(function(fn){
                                    $scope.dataGraficoSpesoTotalePerAnno = dataService.data.dataGraficoSpesoTotalePerAnno;
                                    $scope.optionsGraficoSpesoTotalePerAnno = dataService.data.optionsGraficoSpesoTotalePerAnno;
                                });
                            });
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
          TAB ANDAMENTO ANNUO PERSONALE
         *********************/
          $scope.gridOptionAndamentoAnnuoPersonale = andamentoAnnuoPersonaleService.gridOptionAndamentoAnnuoPersonale;
          $scope.loadAndamentoAnnuoPersonale = function () {
              return andamentoAnnuoPersonaleService.loadAndamentoAnnuoPersonale().then(function(resp){
                  $scope.dataGrafico = dataService.data.dataGrafico;
                  $scope.optionsGrafico = dataService.data.optionsGrafico;    
              });            
          };

        /*********************
            TAB AMAZON
        *********************/
        $scope.gridOptionsAmazon = amazonService.gridOptionsAmazon;
        $scope.loadAmazonData = function () {
            return amazonService.loadAmazonData();
        };
        $scope.amazon = amazonService.amazon;

        /*********************
          TAB MATCH ANALYSIS
         *********************/
        $scope.gridOptionsClassifica = matchAnalysisService.gridOptionsClassifica;
        $scope.gridOptionsScontriDiretti = matchAnalysisService.gridOptionsScontriDiretti;
        $scope.gridOptionsPartitePrecedenti = matchAnalysisService.gridOptionsPartitePrecedenti;
        $scope.gridOptionsNextGame = matchAnalysisService.gridOptionsNextGame;
        $scope.loadMatchAnalysis = function () {
            return matchAnalysisService.loadMatchAnalysis($scope.division, $scope.season, $scope.giornata);
        };        
        var dto = {};
        $scope.loadDivisions = function () {
            return $http.post($strings.REST.SERVER + '/divisions', dto).then(function (resp) {
                $scope.divisions = resp.data;
            });
        };                
        $scope.loadSeasons = function (division) {
            dto.division = division.value.id;
            return $http.post($strings.REST.SERVER + '/seasons', dto ).then(function (resp) {
                $scope.seasons = resp.data;
            });
        };   
        $scope.loadSeasonsPreMatch = function () {            
            return $http.post($strings.REST.SERVER + '/seasonspre', dto ).then(function (resp) {
                $scope.seasonsPreMatch = resp.data;
            });
        };  
        $scope.loadGiornate = function (division, season) {            
            dto.id = season.value.id;
            return $http.post($strings.REST.SERVER + '/giornate', dto ).then(function (resp) {
                $scope.giornate = resp.data;
            });
        };
        $scope.scontriDiretti = matchAnalysisService.scontriDiretti;
        
        /*********************
            TAB PREDMATCH
         *********************/
        $scope.gridOptionsPredMatch = predmatchService.gridOptionsPredMatch;
        $scope.gridOptionsBestBet = predmatchService.gridOptionsBestBet;
        $scope.gridOptionsBest10Bet = predmatchService.gridOptionsBest10Bet;       
        $scope.loadPredMatch = function () {            
            return predmatchService.loadPredMatch();
        };                 

        /*********************
            TAB FANTACALCIO
        *********************/
        $scope.gridOptionsPandathinaikos = fantacalcioService.gridOptionsPandathinaikos;
        $scope.loadFantaRosa = function () {
            return fantacalcioService.loadFantaRosa($scope.fanta.value.id);
        };

        /*********************
           TAB REPORT MESE
        *********************/
        $scope.gridReportMese = reportMeseService.gridReportMese;
        $scope.loadReportMese = function () {
            return reportMeseService.loadReportMese($scope.pivot);
        };

        /*********************
            TAB BUDGET
        *********************/
        $scope.gridBudget = budgetService.gridBudget;
        $scope.loadBudget = function () {
            return budgetService.loadBudget($scope.pivot);
        };

        /*********************
            TAB SPESE ANNUE
        *********************/
       $scope.gridSpeseAnnuali = speseAnnualiService.gridSpeseAnnuali;
       $scope.loadSpeseAnnue = function () {
           return speseAnnualiService.loadSpeseAnnue($scope.pivot);
       };

       /*********************
            TAB EXTRA BUDGET
        *********************/
       $scope.gridExtraBudget = extraBudgetService.gridExtraBudget;
       $scope.loadExtraBudget = function () {
           return extraBudgetService.loadExtraBudget($scope.pivot);
       };

        /*********************
            TAB SPESA
        *********************/
        $scope.gridOptionsSpesa = spesaService.gridOptionsSpesa;

        /*********************
            TAB SETTINGS SPESA
        *********************/
        $scope.gridOptionsReparto = settingsSpesaService.gridOptionsReparto;
        $scope.gridOptionsSottoreparto = settingsSpesaService.gridOptionsSottoreparto;
        $scope.gridOptionsFamiglia = settingsSpesaService.gridOptionsFamiglia;
        $scope.gridOptionsReprSott = settingsSpesaService.gridOptionsReprSott;
        $scope.gridOptionsSottFamg = settingsSpesaService.gridOptionsSottFamg;
        $scope.gridOptionsSupermercato = settingsSpesaService.gridOptionsSupermercato;

        /*********************
            TAB PIVOT SPESA
        *********************/
        $scope.gridOptionsPivotSpesa = pivotSpesaService.gridOptionsPivotSpesa;
        $scope.loadPivotSpesa = function () {
            return pivotSpesaService.loadPivotSpesa();
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
