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
            headerCellClass: 'text-center',
            width: '3%',
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false,
            type: 'number',
            filters: [{
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
            headerCellClass: 'text-center',
            width: '3%',
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'retribuzione_ordinaria',
            displayName: 'RETRIBUZIONE',
            field: 'retribuzione_ordinaria',
            headerCellClass: 'text-center',
            width: '7%',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.avg,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'totale_trattenute',
            displayName: 'TOTALE TRATTENUTE',
            field: 'totale_trattenute',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'totale_competenze',
            displayName: 'TOTALE COMPETENZE',
            field: 'totale_competenze',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'stipendionetto',
            displayName: 'NETTO',
            field: 'stipendionetto',
            headerCellClass: 'text-center',
            width: '7%',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable-green',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'partecipazioneazioni',
            displayName: 'PARTEC. AZIONI',
            field: 'partecipazioneazioni',
            headerCellClass: 'text-center',
            width: '7%',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'festivita_non_goduta',
            displayName: 'FEST NON GODUTA',
            field: 'festivita_non_goduta',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'competenza_base',
            displayName: 'RETR. GG',
            field: 'competenza_base',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'espp',
            displayName: 'ESPP',
            field: 'espp',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'liq_rol',
            displayName: 'ORE ROL LIQ',
            field: 'liq_rol',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_rol',
            displayName: 'COMP ROL',
            field: 'comp_rol',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'straordinario_25',
            displayName: 'STR.25%',
            field: 'straordinario_25',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_straordinario_25',
            displayName: 'COMP.STR.25%',
            field: 'comp_straordinario_25',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'maggiorazione_25',
            displayName: 'MAGG.STR.25%',
            field: 'maggiorazione_25',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_maggiorazione_25',
            displayName: 'COMP.MAGG.STR.25%',
            field: 'comp_maggiorazione_25',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'straordinario_30',
            displayName: 'STR.30%',
            field: 'straordinario_30',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_straordinario_30',
            displayName: 'COMP.STR.30%',
            field: 'comp_straordinario_30',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'maggiorazione_30',
            displayName: 'MAGG.STR.30%',
            field: 'maggiorazione_30',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_maggiorazione_30',
            displayName: 'COMP.MAGG.STR.30%',
            field: 'comp_maggiorazione_30',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'straordinario_50',
            displayName: 'STR.50%',
            field: 'straordinario_50',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_straordinario_50',
            displayName: 'COMP.STR.50%',
            field: 'comp_straordinario_50',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'maggiorazione_50',
            displayName: 'MAGG.STR.50%',
            field: 'maggiorazione_50',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_maggiorazione_50',
            displayName: 'COMP.MAGG.STR.50%',
            field: 'comp_maggiorazione_50',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'maggiorazione_55',
            displayName: 'MAGG.STR.55%',
            field: 'maggiorazione_55',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_maggiorazione_55',
            displayName: 'COMP.MAGG.STR.55%',
            field: 'comp_maggiorazione_55',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'maggiorazione_60',
            displayName: 'MAGG.STR.60%',
            field: 'maggiorazione_60',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'comp_maggiorazione_60',
            displayName: 'COMP.MAGG.STR.60%',
            field: 'comp_maggiorazione_60',
            headerCellClass: 'text-center',
            cellClass: 'text-right',
            width: '7%',
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'erogazione_speciale',
            displayName: 'Erogazione Speciale',
            field: 'erogazione_speciale',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
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
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
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
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'premi_in_natura',
            displayName: 'Premi In Natura',
            field: 'premi_in_natura',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imp_prev_non_arr',
            displayName: 'IMP PREV NON ARR',
            field: 'imp_prev_non_arr',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imp_prev_arr',
            displayName: 'IMP PREV ARR',
            field: 'imp_prev_arr',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imponibile_previsto_annuo',
            displayName: 'IMP PREVISTO ANNUO',
            field: 'imponibile_previsto_annuo',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'trattenute_mese_inps',
            displayName: 'CTR DIP INPS',
            field: 'trattenute_mese_inps',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imponibili',
            displayName: 'IMPONIBILI',
            field: 'imponibili',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imposta_lorda',
            displayName: 'IMPOSTA LORDA',
            field: 'imposta_lorda',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'detrazione_coniuge',
            displayName: 'Detrazione Coniuge',
            field: 'detrazione_coniuge',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            cellClass: 'disable',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'detrazione_figli',
            displayName: 'Detrazione Figli',
            field: 'detrazione_figli',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            cellClass: 'disable',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'anf',
            displayName: 'ANF',
            field: 'anf',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            cellClass: 'disable',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'imposta_netta',
            displayName: 'Imposta Netta',
            field: 'imposta_netta',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'bonus_renzi',
            displayName: 'BONUS RENZI',
            field: 'bonus_renzi',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            width: '7%',
            cellClass: 'disable',
            enableCellEdit: false,
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
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
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'conguaglio_renzi',
            displayName: 'CONG CRE RENZI',
            field: 'conguaglio_renzi',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'conguaglio_debito',
            displayName: 'CONG DEB',
            field: 'conguaglio_debito',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'conguaglio_debito_renzi',
            displayName: 'CONG DEB RENZI',
            field: 'conguaglio_debito_renzi',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'add_comunale_variabile',
            displayName: 'ADD COMN VAR',
            field: 'add_comunale_variabile',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'add_comunale_variabile_acc',
            displayName: 'ADD COMN VAR ACC',
            field: 'add_comunale_variabile_acc',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'add_regionale_fissa',
            displayName: 'ADD REG FISSA',
            field: 'add_regionale_fissa',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'add_regionale_variabile',
            displayName: 'ADD REG VAR',
            field: 'add_regionale_variabile',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'greater than'
              },
              {
                condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                placeholder: 'less than'
              }
            ]
          }, {
            name: 'abbonamento_atm',
            displayName: 'ABB ATM',
            field: 'abbonamento_atm',
            headerCellClass: 'text-center',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: '7%',
            footerCellFilter: 'number:2',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            type: 'number',
            filters: [{
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
          return $http.get($strings.REST.SERVER + '/stipendio').then(function (response) {
            srvc.gridOptionsSalary.data = response.data;
          });
        }
      };
      return srvc;
    }]);
})();