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
                        displayName: 'YYYY',
                        field: 'anno',
                        width: '3%',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'mese',
                        displayName: 'MM',
                        field: 'mese',
                        width: '3%',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
},/* {
                        name: 'data',
                        displayName: 'DATA',
                        field: 'data',
                        width: '5%',
                        cellFilter: 'date:\'yyyy-MM-dd\'',
                        cellClass: 'disable',
                        pinnedLeft: true
}, */{
                        name: 'retribuzioneOrdinaria',
                        displayName: 'RETRIBUZIONE',
                        field: 'retribuzioneordinaria',
                        width: '7%',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        enableCellEdit: false,
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.avg,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
},  {
                        name: 'totaleRitenute',
                        displayName: 'TRATTENUTE',
                        field: 'totaleritenute',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        width: '7%',
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'totaleCompetenze',
                        displayName: 'COMPETENZE',
                        field: 'totalecompetenze',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable',
                        width: '7%',
                        footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'stipendioNetto',
                        displayName: 'NETTO',
                        field: 'stipendionetto',
                        width: '7%',
                        cellFilter: 'currency',
                        pinnedLeft: true,
                        cellClass: 'disable-green',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
    name: 'partecipazioneAzioni',
    displayName: 'PARTEC. AZIONI',
    field: 'partecipazioneazioni',
    width: '7%',
    cellFilter: 'currency',
    pinnedLeft: true,
    cellClass: 'disable',
    enableCellEdit: false,
        footerCellFilter: 'number:2',
    aggregationType: uiGridConstants.aggregationTypes.sum,
    type: 'number',
filters: [
    {
      condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
      placeholder: 'greater than'
    },
    {
      condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
      placeholder: 'less than'
    }
  ]
},/*{
                        name: 'ggLavorativi',
                        displayName: 'Giorni INPS',
                        field: 'gglavorativi',
                        cellClass: 'text-right',
                        width: 120
}, {
                        name: 'ggDetrazioni',
                        displayName: 'Giorni Detr.',
                        field: 'ggdetrazioni',
                        cellClass: 'text-right',
                        width: 120
},*/ {
                        name: 'festivitaNonGoduta',
                        displayName: 'FEST NON GODUTA',
                        field: 'festivitanongoduta',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'competenzaBase',
                        displayName: 'RETR. GG',
                        field: 'competenzabase',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
},{
  name: 'espp',
  displayName: 'ESPP',
  field: 'espp',
  cellClass: 'text-right',
  width: '7%',
  type: 'number',
filters: [
  {
    condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
    placeholder: 'greater than'
  },
  {
    condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
    placeholder: 'less than'
  }
]
}, {
                        name: 'liqrol',
                        displayName: 'ORE ROL LIQ',
                        field: 'liqrol',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'comprol',
                        displayName: 'COMP ROL',
                        field: 'comprol',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'straordinario25',
                        displayName: 'STR.25%',
                        field: 'straordinario25',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compstraordinario25',
                        displayName: 'COMP.STR.25%',
                        field: 'compstraordinario25',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'maggiorazione25',
                        displayName: 'MAGG.STR.25%',
                        field: 'maggiorazione25',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compmaggiorazione25',
                        displayName: 'COMP.MAGG.STR.25%',
                        field: 'compmaggiorazione25',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'straordinario30',
                        displayName: 'STR.30%',
                        field: 'straordinario30',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compstraordinario30',
                        displayName: 'COMP.STR.30%',
                        field: 'compstraordinario30',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'maggiorazione30',
                        displayName: 'MAGG.STR.30%',
                        field: 'maggiorazione30',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compmaggiorazione30',
                        displayName: 'COMP.MAGG.STR.30%',
                        field: 'compmaggiorazione30',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'straordinario50',
                        displayName: 'STR.50%',
                        field: 'straordinario50',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compstraordinario50',
                        displayName: 'COMP.STR.50%',
                        field: 'compstraordinario50',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'maggiorazione50',
                        displayName: 'MAGG.STR.50%',
                        field: 'maggiorazione50',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compmaggiorazione50',
                        displayName: 'COMP.MAGG.STR.50%',
                        field: 'compmaggiorazione50',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'maggiorazione55',
                        displayName: 'MAGG.STR.55%',
                        field: 'maggiorazione55',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compmaggiorazione55',
                        displayName: 'COMP.MAGG.STR.55%',
                        field: 'compmaggiorazione55',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'maggiorazione60',
                        displayName: 'MAGG.STR.60%',
                        field: 'maggiorazione60',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'compmaggiorazione60',
                        displayName: 'COMP.MAGG.STR.60%',
                        field: 'compmaggiorazione60',
                        cellClass: 'text-right',
                        width: '7%',
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'erogazioneSpeciale',
                        displayName: 'Erogazione Speciale',
                        field: 'erogazionespeciale',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'contributoSindacale',
                        displayName: 'Contributo Sindacale',
                        field: 'contributosindacale',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'periquativo',
                        displayName: 'Periquativo',
                        field: 'periquativo',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'settetrenta',
                        displayName: '730',
                        field: 'settetrenta',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'premiinnatura',
                        displayName: 'Premi In Natura',
                        field: 'premiinnatura',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'impprevnonarr',
                        displayName: 'IMP PREV NON ARR',
                        field: 'impprevnonarr',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'impprevarr',
                        displayName: 'IMP PREV ARR',
                        field: 'impprevarr',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'imponibileprevistoannuo',
                        displayName: 'IMP PREVISTO ANNUO',
                        field: 'imponibileprevistoannuo',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'ritenutemeseinps',
                        displayName: 'TRATT PREV INPS',
                        field: 'ritenutemeseinps',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'imponibilefiscalemese',
                        displayName: 'Imponibile Fiscale Mese',
                        field: 'imponibilefiscalemese',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'ritenutaFiscaleMeseLorda',
                        displayName: 'RIT FISC MESE LORDA',
                        field: 'ritenutafiscalemeselorda',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'detrazioniImposta',
                        displayName: 'DETR LAV DIP',
                        field: 'detrazioniimposta',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'detrazioneConiuge',
                        displayName: 'Detrazione Coniuge',
                        field: 'detrazioneconiuge',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                        cellClass: 'disable',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'detrazioneFigli',
                        displayName: 'Detrazione Figli',
                        field: 'detrazionefigli',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        cellClass: 'disable',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
        },{
            name: 'anf',
            displayName: 'ANF',
            field: 'anf',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            cellClass: 'disable',
                footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
        filters: [
            {
              condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
              placeholder: 'greater than'
            },
            {
              condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
              placeholder: 'less than'
            }
          ]
}, {
            name: 'detrazioneCuneo',
            displayName: 'Detrazione Cuneo Fiscale',
            field: 'detrazionecuneo',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            cellClass: 'disable',
                footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
        filters: [
            {
              condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
              placeholder: 'greater than'
            },
            {
              condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
              placeholder: 'less than'
            }
          ]
        },{
                        name: 'ritenutaFiscaleMeseNetta',
                        displayName: 'RIT FISC MESE NETTA',
                        field: 'ritenutafiscalemesenetta',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'bonusRenzi',
                        displayName: 'BONUS RENZI',
                        field: 'bonusrenzi',
                        cellFilter: 'currency',
                        width: '7%',
                        cellClass: 'disable',
                        enableCellEdit: false,
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'conguaglio',
                        displayName: 'CONG CRE',
                        field: 'conguaglio',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'conguaglioRenzi',
                        displayName: 'CONG CRE RENZI',
                        field: 'conguagliorenzi',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'conguaglioDebito',
                        displayName: 'CONG DEB',
                        field: 'conguagliodebito',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'conguaglioDebitoRenzi',
                        displayName: 'CONG DEB RENZI',
                        field: 'conguagliodebitorenzi',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'addizionaleComunaleVariabile',
                        displayName: 'ADD COMN VAR',
                        field: 'addizionalecomunalevariabile',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'addizionaleComunaleVariabileAcconto',
                        displayName: 'ADD COMN VAR ACC',
                        field: 'addizionalecomunalevariabileacconto',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'addizionaleRegionaleFissa',
                        displayName: 'ADD REG FISSA',
                        field: 'addizionaleregionalefissa',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'addizionaleRegionaleVariabile',
                        displayName: 'ADD REG VAR',
                        field: 'addizionaleregionalevariabile',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
}, {
                        name: 'abbonamentoannualeatm',
                        displayName: 'ABB ATM',
                        field: 'abbonamentoannualeatm',
                        cellFilter: 'currency',
                        cellClass: 'text-right',
                        width: '7%',
                            footerCellFilter: 'number:2',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ]
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
