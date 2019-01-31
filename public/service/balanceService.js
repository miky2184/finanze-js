(function () {
    'use strict';
    angular.module('myApp').factory('balanceService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService) {        
        var srvc = {
            gridOptionsBalance: {
            columnVirtualizationThreshold: 100,
            showGridFooter: false,
            showColumnFooter: true,
            minRowsToShow: 23,
            enableFiltering: false,
            selectionRowHeaderWidth: 35,
            columnDefs: [{
                name: 'conto',
                displayName: 'Conto',
                field: 'conto',
                width: '20%'
            }, {
                name: 'contoComune',
                displayName: 'Conto Comune',
                field: 'contoComune',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency',
            }, {
                name: 'contoPersonale',
                displayName: 'Conto Personale',
                field: 'contoPersonale',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                name: 'totale',
                displayName: 'Totale',
                field: 'totale',
                width: '*',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }],
            data: [],
            onRegisterApi: function (gridApi) {
                srvc.gridOptionsBalance.gridApi = gridApi;
            }
        },         
        gridOptionsAvere : {
            columnVirtualizationThreshold: 100,
            showGridFooter: false,
            showColumnFooter: true,
            minRowsToShow: 23,
            enableFiltering: false,
            selectionRowHeaderWidth: 35,
            columnDefs: [{
                field: 'dataVal',
                cellFilter: 'date:\'yyyy-MM-dd\''
            }, {
                field: 'beneficiario'
            }, {
                field: 'contoComune',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }, {
                field: 'contoPersonale',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellFilter: 'currency',
                cellFilter: 'currency'
            }],
            data: [],
            onRegisterApi: function (gridApi) {
                srvc.gridOptionsAvere.gridApi = gridApi;
            }
        },
            loadBalance : function () {
            var balanceData = angular.copy(listaMovimentiService.gridOptions.data);
            var balance = [];
            dataService.data.editDropDownContoArray.forEach(function (row) {
                var newConto = {
                    "conto": row.label
                };
                var importoContoComune = 0;
                var importoContoPersonale = 0;
                for (var x = 0; x < balanceData.length; x++) {
                    if (balanceData[x].conto === row.conto) {
                        if (balanceData[x].contabilizzata) {
                            if (balanceData[x].tipoConto === 1) {
                                importoContoComune = importoContoComune + balanceData[x].importo;
                            } else {
                                importoContoPersonale = importoContoPersonale + balanceData[x].importo;
                            }
                        }
                    }
                }
                newConto.contoComune = importoContoComune;
                newConto.contoPersonale = importoContoPersonale;
                newConto.totale = importoContoComune + importoContoPersonale;
                balance.push(newConto);
            });
            srvc.gridOptionsBalance.data = balance;
            var avere = [];
            for (var x = 0; x < balanceData.length; x++) {
                if (balanceData[x].conto === 4) {
                    var newAvere = {};
                    if (dataService.data.editDropDownBeneficiarioArray.filter(function (ben) {
                            return balanceData[x].beneficiario === ben.beneficiario;
                        })[0]) {
                        newAvere.beneficiario = dataService.data.editDropDownBeneficiarioArray.filter(function (ben) {
                            return balanceData[x].beneficiario === ben.beneficiario;
                        })[0].label;
                    }
                    if (balanceData[x].tipoConto === 1) {
                        newAvere.contoComune = balanceData[x].importo;
                    } else {
                        newAvere.contoPersonale = balanceData[x].importo;
                    }
                    newAvere.dataVal = balanceData[x].data;
                    avere.push(newAvere);
                }
            }
            srvc.gridOptionsAvere.data = avere;
            $interval(srvc.gridOptionsBalance.gridApi.core.handleWindowResize, 100, 10);
            $interval(srvc.gridOptionsAvere.gridApi.core.handleWindowResize, 100, 10);
        }
        };
        return srvc;
    }]);
})();
