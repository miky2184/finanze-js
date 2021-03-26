(function () {
    'use strict';
    angular.module('myApp')

        .factory('salaryService', ['dataService', 'uiGridConstants', 'utilService', '$rootScope', '$http', '$interval', '$strings', function (dataService, uiGridConstants, utilService, $rootScope, $http, $interval, $strings) {
            var scope = $rootScope.$new();
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
                        width: 70,
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
                        displayName: 'Retribuzione',
                        field: 'retribuzioneOrdinaria',
                        width: 120,
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false,
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.avg
},  {
                        name: 'totaleRitenute',
                        displayName: 'Totale Trattenute',
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
                        displayName: 'NETTO',
                        field: 'stipendioNetto',
                        width: 120,
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable-green',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
    name: 'partecipazioneAzioni',
    displayName: 'PARTEC. AZIONI',
    field: 'partecipazioneAzioni',
    width: 120,
    cellFilter: 'currency',
    pinnedLeft: true,
    cellClass: 'disable',
    enableCellEdit: false,
        footerCellFilter: 'number:2',
    aggregationType: uiGridConstants.aggregationTypes.sum
},{
                        name: 'ggLavorativi',
                        displayName: 'Giorni INPS',
                        field: 'ggLavorativi',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'ggDetrazioni',
                        displayName: 'Giorni Detr.',
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
                        displayName: 'Retribuzione',
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
                        cellClass: 'disable',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
}, {
                        name: 'detrazioneFigli',
                        displayName: 'Detrazione Figli',
                        field: 'detrazioneFigli',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        cellClass: 'disable',
                        width: 120,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum
        },{
            name: 'anf',
            displayName: 'ANF',
            field: 'anf',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 120,
            cellClass: 'disable',
                footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum
}, {
            name: 'detrazioneCuneo',
            displayName: 'Detrazione Cuneo Fiscale',
            field: 'detrazioneCuneo',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 120,
            cellClass: 'disable',
                footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum
        },{
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
                    return $http.get($strings.REST.SERVER+'/salary').then(function (response) {
                        srvc.gridOptionsSalary.data = response.data;
                            });                                            
                }                
            };
            return srvc;
}]);
})();
