(function () {
  'use strict';

  angular.module('myApp')
    .factory('restService', ['modalService', '$http', '$interval', function (modalService, $http, $interval) {

      var srvc = {

        loadData: function (scope) {

          modalService.showSearchingModal();

          return $http.get('http://93.55.248.37:3001/ambito').then(function (response) {
            if (response.data) {
              response.data.unshift({
                "ambito": "null",
                "label": " "
              });
            }
            scope.editDropDownAmbitoArray = response.data;

            return $http.get('http://93.55.248.37:3001/categoria').then(function (response) {
              if (response.data) {
                response.data.unshift({
                  "categoria": "null",
                  "label": " "
                });
              }
              scope.editDropDownCategoriaArray = response.data;

              return $http.get('http://93.55.248.37:3001/sottocategoria').then(function (response) {
                if (response.data) {
                  response.data.unshift({
                    "sottocategoria": "null",
                    "label": " "
                  });
                }
                scope.editDropDownSottoCategoriaArray = response.data;

                return $http.get('http://93.55.248.37:3001/beneficiario').then(function (response) {
                  if (response.data) {
                    response.data.unshift({
                      "beneficiario": "null",
                      "label": " "
                    });
                  }
                  scope.editDropDownBeneficiarioArray = response.data;

                  return $http.get('http://93.55.248.37:3001/tipoConto').then(function (response) {
                    scope.editDropDownTipoContoArray = response.data;

                    return $http.get('http://93.55.248.37:3001/conto').then(function (response) {
                      scope.editDropDownContoArray = response.data;

                      return $http.get('http://93.55.248.37:3001/all').
                      then(function (response) {

                        scope.login.logged = true;

                        var resultsData = [];

                        response.data.forEach(function (row) {
                          var newRow = {};
                          newRow.id = row['ID'];
                          newRow.data = new Date(row['DATA_VAL']);
                          newRow.ambito = row['AMBITO'];
                          newRow.categoria = row['CATEGORIA'];
                          newRow.sottocategoria = row['SOTTOCATEGORIA'];                          
                          newRow.beneficiario = row['BENEFICIARIO'];
                          newRow.tipoConto = row['TP_CONTO'];
                          newRow.conto = row['CONTO'];
                          newRow.contabilizzata = row['FL_CONT'] === 'SI' ? true : false;
                          newRow.visualizzare = row['FL_VISL'] === 'SI' ? true : false;
                          newRow.cartaCredito = row['FL_CC'] === 'SI' ? true : false;
                          newRow.webapp = row['WEBAPP'] === 'SI' ? true : false;
                          newRow.fissa = row['FISSA'] === 'SI' ? true : false;
                          newRow.importo = row['VALUE'];
                          newRow.info = row['INFO'];
                          newRow.anno = new Date(row['DATA_VAL']).getFullYear();
                          newRow.mese = new Date(row['DATA_VAL']).getMonth() + 1;
                          return resultsData.push(newRow);
                        });

                        scope.backupData = angular.copy(resultsData);

                        scope.gridOptions.data = resultsData;

                        scope.gridOptions.columnDefs[1].editDropdownOptionsArray = scope.editDropDownAmbitoArray;
                        scope.gridOptions.columnDefs[2].editDropdownOptionsArray = scope.editDropDownCategoriaArray;
                        scope.gridOptions.columnDefs[3].editDropdownOptionsArray = scope.editDropDownSottoCategoriaArray;
                        scope.gridOptions.columnDefs[4].editDropdownOptionsArray = scope.editDropDownBeneficiarioArray;
                        scope.gridOptions.columnDefs[5].editDropdownOptionsArray = scope.editDropDownTipoContoArray;
                        scope.gridOptions.columnDefs[6].editDropdownOptionsArray = scope.editDropDownContoArray;
                        modalService.hideWaitingModal();
                        $interval(scope.gridOptions.gridApi.core.handleWindowResize, 100, 10);
                      });
                    });
                  });
                });
              });
            });
          });
        }

      };

      return srvc;

    }]);
})();
