(function () {
    'use strict';
    angular.module('myApp')

        .factory('salaryService', ['dataService', 'uiGridConstants', 'utilService', '$rootScope', '$http', '$interval', '$strings', function (dataService, uiGridConstants, utilService, $rootScope, $http, $interval, $strings) {
            // var scope = $rootScope.$new();
            var aliquote = [];
            var aliquoteMese = [];
            var srvc = {
                afterCellEditSalaryFunction: function (obj, colDef, newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    if (isNaN(Number(newValue))) {
                        return;
                    }
                    obj.dirty = true;
                    dataService.data.dirty = true;
                    /* var numberValue = Number(newValue);
                    switch (colDef.name) {
                        case 'ggLavorativi':
                            obj.retribuzioneOrdinaria = numberValue * obj.competenzaBase;
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'ggLavorativi', numberValue);
                            break;
                        case 'ggDetrazioni':
                            obj.ggDetrazioni = numberValue;
                            break;
                        case 'festivitaNonGoduta':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'festivitaNonGoduta', numberValue);
                            break;
                        case 'competenzaBase':
                            // obj.stipendioLordo = obj.ggLavorativi * numberValue;
                            obj.retribuzioneOrdinaria = obj.ggLavorativi * numberValue;
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'competenzaBase', numberValue);
                            break;
                        case 'liqRol':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'liqRol', numberValue);
                            break;
                        case 'compRol':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compRol', numberValue);
                            break;
                        case 'straordinario25':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'straordinario25', numberValue);
                            break;
                        case 'compStraordinario25':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compStraordinario25', numberValue);
                            break;
                        case 'maggiorazione25':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'maggiorazione25', numberValue);
                            break;
                        case 'compMaggiorazione25':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compMaggiorazione25', numberValue);
                            break;
                        case 'straordinario30':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'straordinario30', numberValue);
                            break;
                        case 'compStraordinario30':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compStraordinario30', numberValue);
                            break;
                        case 'maggiorazione30':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'maggiorazione30', numberValue);
                            break;
                        case 'compMaggiorazione30':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compMaggiorazione30', numberValue);
                            break;
                        case 'straordinario50':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'straordinario50', numberValue);
                            break;
                        case 'compStraordinario50':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compStraordinario50', numberValue);
                            break;
                        case 'maggiorazione50':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'maggiorazione50', numberValue);
                            break;
                        case 'compMaggiorazione50':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compMaggiorazione50', numberValue);
                            break;
                        case 'maggiorazione55':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'maggiorazione55', numberValue);
                            break;
                        case 'compMaggiorazione55':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compMaggiorazione55', numberValue);
                            break;
                        case 'maggiorazione60':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'maggiorazione60', numberValue);
                            break;
                        case 'compMaggiorazione60':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'compMaggiorazione60', numberValue);
                            break;
                        case 'periquativo':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'periquativo', numberValue);
                            break;
                        case 'erogazioneSpeciale':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'erogazioneSpeciale', numberValue);
                            break;
                        case 'premiInNatura':
                            obj.impPrevNonArr = srvc.getImpPrevNonArr(obj, 'premiInNatura', numberValue);
                            break;
                        case 'addizionaleComunaleVariabile':
                            obj.addizionaleComunaleVariabile = Math.round(numberValue * 100) / 100;
                            break;
                        case 'addizionaleComunaleVariabileAcconto':
                            obj.addizionaleComunaleVariabileAcconto = Math.round(numberValue * 100) / 100;
                            break;
                        case 'addizionaleRegionaleFissa':
                            obj.addizionaleRegionaleFissa = Math.round(numberValue * 100) / 100;
                            break;
                        case 'addizionaleRegionaleVariabile':
                            obj.addizionaleRegionaleVariabile = Math.round(numberValue * 100) / 100;
                            break;
                        case 'abbonamentoAnnualeAtm':
                            obj.abbonamentoAnnualeAtm = Math.round(numberValue * 100) / 100;
                            break;
                        default:
                            break;
                    }
                    srvc.ricalcola(obj, angular.copy(srvc.gridOptionsSalary.data)); */
                },
                gridOptionsSalary: {
                    columnVirtualizationThreshold: 100,
                    minRowsToShow: 23,
                    showColumnFooter: true,
                    enableFiltering: true,
                    enableSorting: false,
                    columnDefs: [{
                        name: 'anno',
                        displayName: 'Anno',
                        field: 'anno',
                        width: 50,
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false
}, {
                        name: 'mese',
                        displayName: 'Mese',
                        field: 'mese',
                        width: 50,
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false
}, {
                        name: 'data',
                        displayName: 'Data',
                        field: 'data',
                        width: 120,
                        cellFilter: 'date:\'yyyy-MM-dd\'',
                        cellClass: 'disable',
                        pinnedLeft: true
}, {
                        name: 'retribuzioneOrdinaria',
                        displayName: 'Stipendio Lordo',
                        field: 'retribuzioneOrdinaria',
                        width: 120,
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false,
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.avg
}, {
                        name: 'retribuzioneOrdinaria',
                        displayName: 'Retribuzione Ordinaria',
                        field: 'retribuzioneOrdinaria',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        width: 120
}, {
                        name: 'totaleRitenute',
                        displayName: 'Totale Ritenute',
                        field: 'totaleRitenute',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        width: 120,
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'totaleCompetenze',
                        displayName: 'Totale Competenze',
                        field: 'totaleCompetenze',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        width: 120,
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'stipendioNetto',
                        displayName: 'Stipendio Netto',
                        field: 'stipendioNetto',
                        width: 120,
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable-green',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'ggLavorativi',
                        displayName: 'Giorni INPS',
                        field: 'ggLavorativi',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'ggDetrazioni',
                        displayName: 'Giorni Detrazioni',
                        field: 'ggDetrazioni',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'festivitaNonGoduta',
                        displayName: 'Festività Non Goduta',
                        field: 'festivitaNonGoduta',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'competenzaBase',
                        displayName: 'Competenza Base',
                        field: 'competenzaBase',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'liqRol',
                        displayName: 'Ore ROL Liquidate',
                        field: 'liqRol',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compRol',
                        displayName: 'Compenso ROL',
                        field: 'compRol',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'straordinario25',
                        displayName: 'Str. 25%',
                        field: 'straordinario25',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compStraordinario25',
                        displayName: 'Comp. Str. 25%',
                        field: 'compStraordinario25',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'maggiorazione25',
                        displayName: 'Magg. Str. 25%',
                        field: 'maggiorazione25',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compMaggiorazione25',
                        displayName: 'Comp. Magg. Str. 25%',
                        field: 'compMaggiorazione25',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'straordinario30',
                        displayName: 'Str. 30%',
                        field: 'straordinario30',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compStraordinario30',
                        displayName: 'Comp. Str. 30%',
                        field: 'compStraordinario30',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'maggiorazione30',
                        displayName: 'Magg. Str. 30%',
                        field: 'maggiorazione30',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compMaggiorazione30',
                        displayName: 'Comp. Magg. Str. 30%',
                        field: 'compMaggiorazione30',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'straordinario50',
                        displayName: 'Str. 50%',
                        field: 'straordinario50',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compStraordinario50',
                        displayName: 'Comp. Str. 50%',
                        field: 'compStraordinario50',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'maggiorazione50',
                        displayName: 'Magg. Str. 50%',
                        field: 'maggiorazione50',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compMaggiorazione50',
                        displayName: 'Comp. Magg. Str. 50%',
                        field: 'compMaggiorazione50',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'maggiorazione55',
                        displayName: 'Magg. Str. 55%',
                        field: 'maggiorazione55',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compMaggiorazione55',
                        displayName: 'Comp. Magg. Str. 55%',
                        field: 'compMaggiorazione55',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'maggiorazione60',
                        displayName: 'Magg. Str. 60%',
                        field: 'maggiorazione60',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'compMaggiorazione60',
                        displayName: 'Comp. Magg. Str. 60%',
                        field: 'compMaggiorazione60',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'erogazioneSpeciale',
                        displayName: 'Erogazione Speciale',
                        field: 'erogazioneSpeciale',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'contributoSindacale',
                        displayName: 'Contributo Sindacale',
                        field: 'contributoSindacale',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'periquativo',
                        displayName: 'Periquativo',
                        field: 'periquativo',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'settetrenta',
                        displayName: '730',
                        field: 'settetrenta',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'premiInNatura',
                        displayName: 'Premi In Natura',
                        field: 'premiInNatura',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'impPrevNonArr',
                        displayName: 'Imponibile Previdenziale NON Arrotondato',
                        field: 'impPrevNonArr',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'impPrevArr',
                        displayName: 'Imponibile Previdenziale Arrotondato',
                        field: 'impPrevArr',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'imponibilePrevistoAnnuo',
                        displayName: 'Imponibile Previsto Annuo',
                        field: 'imponibilePrevistoAnnuo',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'ritenuteMeseInps',
                        displayName: 'Ritenute Mese INPS',
                        field: 'ritenuteMeseInps',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'imponibileFiscaleMese',
                        displayName: 'Imponibile Fiscale Mese',
                        field: 'imponibileFiscaleMese',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'ritenutaFiscaleMeseLorda',
                        displayName: 'Ritenuta Fiscale Mese lorda',
                        field: 'ritenutaFiscaleMeseLorda',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'detrazioniImposta',
                        displayName: 'Detrazioni Imposta',
                        field: 'detrazioniImposta',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'detrazioneConiuge',
                        displayName: 'Detrazione Coniuge',
                        field: 'detrazioneConiuge',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'detrazioneFigli',
                        displayName: 'Detrazione Figli',
                        field: 'detrazioneFigli',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'ritenutaFiscaleMeseNetta',
                        displayName: 'Ritenuta Fiscale Mese Netta',
                        field: 'ritenutaFiscaleMeseNetta',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'bonusRenzi',
                        displayName: 'Bonus DL 66 del 24/04/2014',
                        field: 'bonusRenzi',
                        cellFilter: 'currency',
                        width: 120,
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'conguaglio',
                        displayName: 'Conguaglio a Credito',
                        field: 'conguaglio',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'conguaglioRenzi',
                        displayName: 'Conguaglio a Credito DL 66 del 24/04/2014',
                        field: 'conguaglioRenzi',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'conguaglioDebito',
                        displayName: 'Conguaglio a Debito',
                        field: 'conguaglioDebito',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'conguaglioDebitoRenzi',
                        displayName: 'Conguaglio a Debili DL 66 del 24/04/2014',
                        field: 'conguaglioDebitoRenzi',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'addizionaleComunaleVariabile',
                        displayName: 'Addizionale Comunale Variabile',
                        field: 'addizionaleComunaleVariabile',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'addizionaleComunaleVariabileAcconto',
                        displayName: 'Addizionale Comunale Variabile Acconto',
                        field: 'addizionaleComunaleVariabileAcconto',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'addizionaleRegionaleFissa',
                        displayName: 'Addizionale Regionale Fissa',
                        field: 'addizionaleRegionaleFissa',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'addizionaleRegionaleVariabile',
                        displayName: 'Addizionale Regionale Variabile',
                        field: 'addizionaleRegionaleVariabile',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'abbonamentoAnnualeAtm',
                        displayName: 'Abbonamento Annuale ATM',
                        field: 'abbonamentoAnnualeAtm',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}],
                    data: [],
                    onRegisterApi: function (gridApi) {
                        srvc.gridOptionsSalary.gridApi = gridApi;
                        gridApi.edit.on.afterCellEdit(scope, srvc.afterCellEditSalaryFunction);
                        srvc.gridOptionsSalary.gridApi.core.handleWindowResize();
                    }
                },
                loadWork: function () {
                    return $http.get($strings.REST.SERVER+'/salarynew').then(function (response) {
                        srvc.gridOptionsSalary.data = response.data;
                            });                        
                    /* return $http.get($strings.REST.SERVER+'/aliquote').then(function (response) {
                        aliquote = response.data;
                        return $http.get($strings.REST.SERVER+'/aliquoteMese').then(function (response) {
                            aliquoteMese = response.data;
                            return $http.get($strings.REST.SERVER+'/salary').then(function (resp) {
                                var salaryData = [];
                                resp.data.forEach(function (obj) {
                                    var x = {};
                                    x.id = obj['ID'];
                                    x.data = obj['DATA'];
                                    x.anno = new Date(x.data).getFullYear();
                                    x.mese = new Date(x.data).getMonth() + 1;
                                    x.ggLavorativi = obj['GG_LAVORATIVI'];
                                    x.ggDetrazioni = obj['GG_DETRAZIONI'] > 0 ? obj['GG_DETRAZIONI'] : utilService.ultimo(x.mese, x.anno);
                                    x.liqRol = obj['LIQ_ROL'];
                                    x.compRol = obj['COMP_ROL'];
                                    x.straordinario25 = obj['STRAORDINARIO_25'];
                                    x.compStraordinario25 = obj['COMP_STRAORDINARIO_25'];
                                    x.maggiorazione25 = obj['MAGGIORAZIONE_25'];
                                    x.compMaggiorazione25 = obj['COMP_MAGGIORAZIONE_25'];
                                    x.straordinario30 = obj['STRAORDINARIO_30'];
                                    x.compStraordinario30 = obj['COMP_STRAORDINARIO_30'];
                                    x.maggiorazione30 = obj['MAGGIORAZIONE_30'];
                                    x.compMaggiorazione30 = obj['COMP_MAGGIORAZIONE_30'];
                                    x.straordinario50 = obj['STRAORDINARIO_50'];
                                    x.compStraordinario50 = obj['COMP_STRAORDINARIO_50'];
                                    x.maggiorazione50 = obj['MAGGIORAZIONE_50'];
                                    x.compMaggiorazione50 = obj['COMP_MAGGIORAZIONE_50'];
                                    x.maggiorazione55 = obj['MAGGIORAZIONE_55'];
                                    x.compMaggiorazione55 = obj['COMP_MAGGIORAZIONE_55'];
                                    x.maggiorazione60 = obj['MAGGIORAZIONE_60'];
                                    x.compMaggiorazione60 = obj['COMP_MAGGIORAZIONE_60'];
                                    x.festivitaNonGoduta = obj['FESTIVITA_NON_GODUTA'];
                                    x.periquativo = obj['PERIQUATIVO'];
                                    x.settetrenta = obj['SETTETRENTA'];
                                    x.premiInNatura = obj['PREMI_IN_NATURA'];
                                    x.contributoSindacale = obj['CONTR_SIND'];
                                    x.detrazioneConiuge = obj['DETRAZIONE_CONIUGE'];
                                    x.detrazioneFigli = obj['DETRAZIONE_FIGLI'];
                                    x.conguaglio = obj['CONGUAGLIO'];
                                    x.conguaglioRenzi = obj['CONGUAGLIO_RENZI'];
                                    x.conguaglioDebito = obj['CONGUAGLIO_DEBITO'];
                                    x.conguaglioDebitoRenzi = obj['CONGUAGLIO_DEBITO_RENZI'];
                                    x.erogazioneSpeciale = obj['EROGAZIONE_SPECIALE'];
                                    x.addizionaleComunaleVariabile = obj['ADD_COMUNALE_VARIABILE'];
                                    x.addizionaleComunaleVariabileAcconto = obj['ADD_COMUNALE_VARIABILE_ACC'];
                                    x.addizionaleRegionaleFissa = obj['ADD_REGIONALE_FISSA'];
                                    x.addizionaleRegionaleVariabile = obj['ADD_REGIONALE_VARIABILE'];
                                    x.abbonamentoAnnualeAtm = obj['ABBONAMENTO_ATM'];
                                    x.competenzaBase = obj['COMPETENZA_BASE'];
                                    salaryData.push(x);
                                });
                                salaryData.forEach(function (obj) {
                                    srvc.ricalcola(obj, salaryData);
                                });
                                srvc.gridOptionsSalary.data = salaryData;
                            });
                        });
                    }); */
                },
                ricalcola: function (obj, salaryData) {
                    obj.ggMese = utilService.ultimo(obj.mese, obj.anno);
                    // obj.stipendioLordo = obj.ggLavorativi * obj.competenzaBase;
                    obj.retribuzioneOrdinaria = srvc.getRetribuzioneOrdinaria(obj);
                    obj.impPrevNonArr = srvc.getImpPrevNonArr(obj);
                    if (obj.mese === 12) {
                        obj.impPrevArr = Math.floor(obj.impPrevNonArr);
                    } else {
                        obj.impPrevArr = Math.round(obj.impPrevNonArr);
                    }
                    obj.ritenuteMeseInps = Math.round(srvc.getRitenuteMeseInps(obj) * 100) / 100;
                    obj.imponibileFiscaleMese = obj.impPrevNonArr - obj.ritenuteMeseInps;
                    obj.imponibileTotAnnuo = utilService.sumArray(salaryData.filter(function (tmp) {
                        return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                    }), 'imponibileFiscaleMese');
                    obj.ggLavorati = utilService.sumArray(salaryData.filter(function (tmp) {
                        return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                    }), 'ggDetrazioni');
                    obj.ggTrascorsi = utilService.sumArray(salaryData.filter(function (tmp) {
                        return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                    }), 'ggMese');
                    var nom = salaryData.filter(function (tmp) {
                        return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                    }).length;
                    if (obj.anno === 2012 && obj.mese === 2) {
                        obj.imponibileMedio = ((obj.imponibileTotAnnuo / obj.ggMese) * obj.ggLavorati) / nom;
                    } else {
                        obj.imponibileMedio = ((obj.imponibileTotAnnuo / obj.ggLavorati) * obj.ggTrascorsi) / nom;
                    }
                    obj.imponibilePrevistoAnnuo = obj.imponibileTotAnnuo + (obj.imponibileMedio * (13 - obj.mese));
                    obj.ritenutaFiscaleMeseLorda = srvc.getRitenutaFiscaleMeseLorda(obj);
                    obj.detrazioniImposta = srvc.getDetrazioniImposta(obj);
                    obj.ritenutaFiscaleMeseNetta = srvc.getRitenutaFiscaleMeseNetta(obj);
                    obj.bonusRenzi = srvc.getBonusRenzi(obj);
                    obj.totaleRitenute = srvc.getTotaleRitenute(obj);
                    obj.totaleCompetenze = srvc.getTotaleCompetenze(obj);
                    obj.stipendioNetto = obj.totaleCompetenze - obj.totaleRitenute;
                },
                getBonusRenzi: function (obj) {
                    var dayOfMonth = new Date(obj.data).getDate();
                    if (dayOfMonth === 27) {
                        if (obj.anno >= 2014 && obj.anno < 2018) {
                            return (obj.imponibilePrevistoAnnuo > 8000 && obj.imponibilePrevistoAnnuo <= 24000 ? 960 : (obj.imponibilePrevistoAnnuo > 24000 && obj.imponibilePrevistoAnnuo < 26000 ? 960 * ((26000 - obj.imponibilePrevistoAnnuo) / 2000) : 0)) / 365 * obj.ggDetrazioni;
                        } else if (obj.anno >= 2018) {
                            return (obj.imponibilePrevistoAnnuo > 8174 && obj.imponibilePrevistoAnnuo <= 24600 ? 960 : (obj.imponibilePrevistoAnnuo > 24600 && obj.imponibilePrevistoAnnuo < 26600 ? 960 * ((26600 - obj.imponibilePrevistoAnnuo) / 2000) : 0)) / 365 * obj.ggDetrazioni;
                        } else {
                            return 0.0;
                        }
                    } else {
                        return 0.0;
                    }
                },
                getDetrazioniImposta: function (obj) {
                    var alq = aliquote.filter(function (a) {
                        return a['ANNO'] === obj.anno;
                    })[0];
                    var dayOfMonth = new Date(obj.data).getDate();
                    if (dayOfMonth === 27) {
                        return (obj.imponibilePrevistoAnnuo <= alq['SOGLIA0'] ? alq['QUOTA0'] : (obj.imponibilePrevistoAnnuo <= alq['SOGLIA1'] ? (alq['QUOTA1'] + alq['QUOTA2'] * ((alq['SOGLIA1'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE1'])) : (alq['QUOTA1'] * ((alq['SOGLIA2'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE2'])))) / 365 * obj.ggDetrazioni;
                    } else {
                        return 0.0;
                    }
                },
                getRitenutaFiscaleMeseLorda: function (obj) {
                    var alqMese = aliquoteMese.filter(function (a) {
                        return a['ANNO'] === obj.anno;
                    })[0];
                    return (obj.imponibileFiscaleMese <= alqMese['FASCIA1'] ? obj.imponibileFiscaleMese * alqMese['PERC1'] / 100 : (obj.imponibileFiscaleMese <= alqMese['FASCIA2'] ? alqMese['ALIQUOTA2'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA1']) * alqMese['PERC2'] / 100) : (obj.imponibileFiscaleMese <= alqMese['FASCIA3'] ? alqMese['ALIQUOTA3'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA2']) * alqMese['PERC3'] / 100) : (obj.imponibileFiscaleMese <= alqMese['FASCIA4'] ? alqMese['ALIQUOTA4'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA3']) * alqMese['PERC4'] / 100) : alqMese['ALIQUOTA5'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA4']) * alqMese['PERC5'] / 100)))));
                },
                getRetribuzioneOrdinaria: function (obj) {
                    return obj.ggLavorativi * obj.competenzaBase;
                },
                getRitenuteMeseInps: function (obj) {
                    var alq = aliquote.filter(function (a) {
                        return a['ANNO'] === obj.anno;
                    })[0];
                    return (obj.impPrevArr > alq['SOGLIA_FAP'] ? (obj.impPrevArr * alq['INPS'] / 100) + ((obj.impPrevArr - alq['SOGLIA_FAP']) * alq['ECCESSO_FAP'] / 100) : (obj.impPrevArr * alq['INPS'] / 100));
                },
                getImpPrevNonArr: function (obj, field, value) {
                    if (field) {
                        obj[field] = value;
                    }
                    return (Math.round(obj.retribuzioneOrdinaria * 100) / 100) + (Math.round((obj.festivitaNonGoduta * obj.competenzaBase) * 100) / 100) + (Math.round((obj.liqRol * obj.compRol) * 100) / 100) + (Math.round((obj.straordinario25 * obj.compStraordinario25) * 100) / 100) + (Math.round((obj.maggiorazione25 * obj.compMaggiorazione25) * 100) / 100) + (Math.round((obj.straordinario30 * obj.compStraordinario30) * 100) / 100) + (Math.round((obj.maggiorazione30 * obj.compMaggiorazione30) * 100) / 100) + (Math.round((obj.straordinario50 * obj.compStraordinario50) * 100) / 100) + (Math.round((obj.maggiorazione50 * obj.compMaggiorazione50) * 100) / 100) + (Math.round((obj.maggiorazione55 * obj.compMaggiorazione55) * 100) / 100) + (Math.round((obj.maggiorazione60 * obj.compMaggiorazione60) * 100) / 100) + (Math.round(obj.periquativo * 100) / 100) + (Math.round(obj.premiInNatura * 100) / 100) + (Math.round(obj.erogazioneSpeciale * 100) / 100);
                },
                getRitenutaFiscaleMeseNetta: function (obj) {
                    return (Math.round(obj.ritenutaFiscaleMeseLorda * 100) / 100) - (Math.round(obj.detrazioniImposta * 100) / 100) - obj.detrazioneConiuge - obj.detrazioneFigli;
                },
                getTotaleRitenute: function (obj) {
                    return (Math.round(obj.ritenuteMeseInps * 100) / 100) + (Math.round(obj.ritenutaFiscaleMeseNetta * 100) / 100) + (Math.round(obj.addizionaleComunaleVariabile * 100) / 100) + (Math.round(obj.addizionaleComunaleVariabileAcconto * 100) / 100) + (Math.round(obj.addizionaleRegionaleFissa * 100) / 100) + (Math.round(obj.addizionaleRegionaleVariabile * 100) / 100) + (Math.round(obj.abbonamentoAnnualeAtm * 100) / 100) + (Math.round(obj.conguaglioDebito * 100) / 100) + (Math.round(obj.conguaglioDebitoRenzi * 100) / 100) + (Math.round(obj.contributoSindacale * 100) / 100);
                },
                getTotaleCompetenze: function (obj) {
                    return (Math.round(obj.retribuzioneOrdinaria * 100) / 100) + (Math.round((obj.festivitaNonGoduta * obj.competenzaBase) * 100) / 100) + (Math.round((obj.straordinario25 * obj.compStraordinario25) * 100) / 100) + (Math.round((obj.maggiorazione25 * obj.compMaggiorazione25) * 100) / 100) + (Math.round((obj.straordinario30 * obj.compStraordinario30) * 100) / 100) + (Math.round((obj.maggiorazione30 * obj.compMaggiorazione30) * 100) / 100) + (Math.round((obj.straordinario50 * obj.compStraordinario50) * 100) / 100) + (Math.round((obj.maggiorazione50 * obj.compMaggiorazione50) * 100) / 100) + (Math.round((obj.maggiorazione55 * obj.compMaggiorazione55) * 100) / 100) + (Math.round((obj.maggiorazione60 * obj.compMaggiorazione60) * 100) / 100) + (Math.round(obj.erogazioneSpeciale * 100) / 100) + (Math.round(obj.periquativo * 100) / 100) + (Math.round(obj.settetrenta * 100) / 100) + (Math.round(obj.premiInNatura * 100) / 100) + (Math.round(obj.bonusRenzi * 100) / 100) + (Math.round((obj.liqRol * obj.compRol) * 100) / 100) + (Math.round((obj.conguaglio) * 100) / 100) + (Math.round((obj.conguaglioRenzi) * 100) / 100);
                }
            };
            return srvc;
}]);
})();
