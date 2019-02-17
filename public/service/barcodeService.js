(function () {
    'use strict';
    angular.module('myApp').factory('barcodeService', ['modalService', '$http', '$interval', 'dataService', 'uiGridConstants', 'listaMovimentiService', function (modalService, $http, $interval, dataService, uiGridConstants, listaMovimentiService) {
        var srvc = {
          barcodeBtn: {
              src: 'images/baseline-refresh-24px.svg',
              listener: function (gridOptions, maschera) {
                  if (maschera === "SP") {

                  }
              },
              disabled: function () {
                  return !dataService.data.admin;
              },
              label: 'Barcode'
          }
        };
        return srvc;
    }]);
})();
