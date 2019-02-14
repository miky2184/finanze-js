(function () {
    'use strict';
    angular.module('myApp', ['ngMaterial', 'ngMessages', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView', 'nvd3', 'ui.grid.pinning', 'ui.grid.autoResize']).config(['$mdThemingProvider', function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    }]).controller('MainController', ['$scope', '$http',   '$strings', 'commonService', 'spesaService', 'budgetService', 'reportMeseService', 'fantacalcioService', 'matchAnalysisService', 'amazonService', 'dataService', 'listaMovimentiService' , 'andamentoAnnuoService', 'settingsService', 'salaryService',  'balanceService', 'pivotAnnoService', 'graficoService', 'pivotMeseService', 'settingsSpesaService', function ($scope, $http,  $strings, commonService,  spesaService, budgetService, reportMeseService, fantacalcioService, matchAnalysisService, amazonService, dataService, listaMovimentiService, andamentoAnnuoService, settingsService, salaryService, balanceService, pivotAnnoService, graficoService, pivotMeseService, settingsSpesaService ) {    
        
        /* PARAMETRI */        
        /* LOGIN */
        $scope.disabled = false;
        $scope.logged = function(){
            return dataService.data.logged;
        };
        $scope.admin = function(){
            return dataService.data.admin;
        };       
        
        $scope.login = function(){
            var datiAccesso ={
                username: $scope.username,
                pwd: $scope.password
            };                        
            return commonService.login(datiAccesso).then(function(result){
                $scope.alerts = dataService.data.alerts;    
            });
        }        
        
        /* BUTTON */
        $scope.actionButtons = [];
        $scope.actionButtons.push(listaMovimentiService.exportBtn);
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
        
        $scope.season = {};       
        $scope.season.value = {};
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
        $scope.seasons = [];               
        $scope.giornate = [];
        $scope.scontriDiretti = {};                
        $scope.years = [2019, 2018, 2017, 2016, 2015, 2014, 2013];
        $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];        
        $scope.alerts = [];
        $scope.conti = [{"tipoConto": 1, "label": $strings.CONTO.CONTO_COMUNE},{"tipoConto":2, "label": $strings.CONTO.CONTO_PERSONALE}];        
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
        $scope.loadBalance = function(){
            return balanceService.loadBalance() ;
        };
        $scope.gridOptionsAvere = balanceService.gridOptionsAvere ;   
        
        /*********************
           TAB PIVOT ANNO
         *********************/
        $scope.gridOptionPivotAnno = pivotAnnoService.gridOptionPivotAnno;
        $scope.loadPivotAnno = function(){
            return pivotAnnoService.loadPivotAnno($scope.pivot.year, $scope.pivot.tipoConto);
        };
       
        /*********************
          TAB SETTINGS
         *********************/               
        $scope.settingButtons = [];
        $scope.settingButtons.push(settingsService.addSettingBtn);
        $scope.settingButtons.push(settingsService.deleteSettingBtn);      
        $scope.gridOptionsAmb = settingsService.gridOptionsAmb;
        $scope.gridOptionsCat =  settingsService.gridOptionsCat;
        $scope.gridOptionsSott =  settingsService.gridOptionsSott;
        $scope.gridOptionsBen =  settingsService.gridOptionsBen;
        $scope.gridOptionsAmbCat =  settingsService.gridOptionsAmbCat;
        $scope.gridOptionsCatSott =  settingsService.gridOptionsCatSott;
                
        /********************* 
          TAB GRAFICO
         *********************/
        $scope.loadGrafico = function(){
          return graficoService.loadGrafico($scope.pivot.year).then(function(fn){
              $scope.dataGrafico =  dataService.data.dataGrafico;
          $scope.optionsGrafico = dataService.data.optionsGrafico;                   
          });            
        };            
        
        /********************* 
          TAB PIVOT MESE
         *********************/
        $scope.gridOptionPivotMese = pivotMeseService.gridOptionPivotMese;        
        $scope.loadPivotMese =  function(){
        pivotMeseService.loadPivotMese($scope.pivot.year);
        $scope.dataGrafico = dataService.data.dataGrafico; 
        $scope.optionsGrafico = dataService.data.optionsGrafico;               
        };        
        
        /********************* 
          TAB WORK
         *********************/        
        $scope.gridOptionsSalary = salaryService.gridOptionsSalary;
        $scope.loadWork = function(){
         return salaryService.loadWork();   
        };
        
        /********************* 
          TAB ANDAMENTO ANNUO 
         *********************/
        $scope.gridOptionAndamentoAnnuo = andamentoAnnuoService.gridOptionAndamentoAnnuo;      
        $scope.loadAndamentoAnnuo = function(){
            andamentoAnnuoService.loadAndamentoAnnuo();
            $scope.dataGrafico = dataService.data.dataGrafico;
            $scope.optionsGrafico = dataService.data.optionsGrafico;                      
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
        $scope.gridOptionsNextGame = matchAnalysisService.gridOptionsNextGame;
        $scope.loadMatchAnalysis = function () {
            return matchAnalysisService.loadMatchAnalysis($scope.season, $scope.giornata);
        };
        $scope.loadSeasons = function () {
            return $http.get($strings.REST.SERVER+'/seasons').then(function (resp) {
                $scope.seasons = resp.data.map(function (tmp) {
                    var obj = {};
                    obj.id = tmp.id;
                    obj.name = tmp.name;
                    return obj;
                });
            });
        };
        $scope.loadGiornate = function () {
            return $http.post($strings.REST.SERVER+'/giornate', $scope.season.value).then(function (resp) {
                $scope.giornate = resp.data.map(function (tmp) {
                    var obj = {};
                    obj.id = tmp.id;
                    obj.name = tmp.name;
                    return obj;
                });
            });
        };
        $scope.scontriDiretti = matchAnalysisService.scontriDiretti; 
        
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
        
    }]).filter('griddropdown', function() {
      return function(input, context) {
        var fieldLevel = !context.editDropdownOptionsArray ? context.col.colDef : context;
        var map = fieldLevel.editDropdownOptionsArray;
        var idField = fieldLevel.editDropdownIdLabel;
        var valueField = fieldLevel.editDropdownValueLabel;
        var initial = context.row ? context.row.entity[context.col.field] : context.entity[context.col.field];
        if (map) {
          for (var i = 0; i < map.length; i++) {
            if (map[i][idField] === input) {
              return map[i][valueField];
            }
          }
        } else if (initial) {
          return initial;
        }
        return input;
      };
    }).filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
}());
