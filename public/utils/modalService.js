(function () {
  'use strict';

  angular.module('myApp.utils')

    .config(['$uibModalProvider', function ($uibModalProvider) {
      // Le seguenti opzioni servono per impedire che i popup possano essere
      // cancellati cliccando sullo sfondo o premendo il tasto ESC
      $uibModalProvider.options.backdrop = 'static';
      $uibModalProvider.options.keyboard = false;
    }])


    .factory('modalService', ['$strings', '$log', '$rootScope', '$uibModal', '$timeout', '$filter', '$q', '$uibModalStack',
      function ($strings, $log, $rootScope, $uibModal, $timeout, $filter, $q, $uibModalStack) {

        var srvc = {

          showWaitingModal: function (text) {

            if (!text) {
              text = $strings.DEFAULT_WAITING_MESSAGE;
            }

            if (srvc.waitingModal) {
              $log.error('Modal già esposto');
              return;
            }

            var scope = $rootScope.$new(false);
            scope.text = text;

            $log.debug('Waiting modal in apertura');
            srvc.waitingModal = $uibModal.open({
              templateUrl: 'templates/waitingModal.html',
              size: 'sm',
              scope: scope
            });

            srvc.opening = true;

            srvc.waitingModal.opened.then(function () {
              $log.debug('Waiting modal creato');
              srvc.opening = false;
            });
          },

          hideWaitingModal: function () {


            if (!srvc.waitingModal) {
              $log.error('Modal già rimosso');

              return $q.reject();
            }

            if (srvc.opening) {
              // Timeout necessario per evitare di nascondere il popup
              // prima che fosse effettivamente apparso.


              return $timeout(srvc.hideWaitingModal, 100);
            }

            srvc.waitingModal.close();
            delete srvc.waitingModal;

            $log.debug('Waiting modal rimosso');
            return $q.when();
          },

          showButtonModal: function (title, text, button, style) {
            $log.debug('Button modal in apertura');

            var scope = $rootScope.$new(false);
            scope.title = title;
            scope.text = text;
            scope.button = button;
            scope.style = style;

            var modal = $uibModal.open({
              templateUrl: 'templates/buttonModal.html',
              size: 'sm',
              scope: scope,
              windowClass: style
            });

            return modal.result;
          },

          showWarningModal: function (title, text, button) {
            return srvc.showButtonModal(title, text, button, 'warning');
          },

          showErrorModal: function (title, text, button) {

            if (srvc.errorModalResult) {
              $log.error('Error modal duplicated: ' + text);
              return;
            }

            srvc.errorModalResult = srvc.showButtonModal(title, text, button, 'error')
              .then(function () {
                delete srvc.errorModalResult;
              });

            return srvc.errorModalResult;
          },


          showErrorListModal: function (title, text, errors, button) {

            if (srvc.errorModalResult) {
              $log.error('Error modal duplicated: ' + text);
              return;
            }

            var complexTest = text + '<p><ul class="nolist">';

            errors.forEach(function (error) {
              complexTest += '<li>' + error + '</li>';
            });

            complexTest += '</ul></p>';

            srvc.errorModalResult = srvc.showButtonModal(title, complexTest, button, 'error')
              .then(function () {
                delete srvc.errorModalResult;
              });

            return srvc.errorModalResult;
          },


          showYesNoModal: function (title, text, yes, no) {
            $log.debug('YesNoModal in apertura');

            var scope = $rootScope.$new(false);
            scope.title = title;
            scope.text = text;
            scope.yes = yes;
            scope.no = no;

            var modal = $uibModal.open({
              templateUrl: 'templates/yesNoModal.html',
              size: 'sm',
              scope: scope
            });

            return modal.result;
          },


          showYesNoCancelModal: function (title, text, yes, no, cancel) {
            $log.debug('YesNoCancelModal in apertura');

            var scope = $rootScope.$new(false);
            scope.title = title;
            scope.text = text;
            scope.yes = yes;
            scope.no = no;
            scope.cancel = cancel;

            var modal = $uibModal.open({
              templateUrl: 'templates/yesNoCancelModal.html',
              size: 'sm',
              scope: scope
            });

            return modal.result;
          },


          showMenuModal: function () {
            $log.debug('Button menu in apertura');

            srvc.menuModal = $uibModal.open({
              template: '<div class="modal-body" id="modal-menu-div"><app-menu></app-menu></div>',
              size: 'xl',
              keyboard: true,
              backdrop: true
            });

          },


          showSearchModal: function (id, label, fields, filter, popupFunction, gridOptions, searchOnOpen, onRowsRendered) {

            if (!id || !label || !fields) {
              throw ('Error showSearchModal: Illegal arguments');
            }

            $log.debug('Button search in apertura');

            var scope = $rootScope.$new(false);

            if (fields.length === 0) {
              return srvc.showTableModal(id, label, popupFunction, gridOptions, "lg", undefined, undefined, [{
                id: 'conferma',
                label: 'Conferma'
              }, {
                id: 'annulla',
                label: 'Annulla'
              }], scope).then(function (result) {
                if (result === 'conferma') {
                  return scope.gridApi.selection.getSelectedRows();
                } else {
                  return $q.reject();
                }
              });
            }

            scope.id = id;
            scope.label = label;
            scope.fields = fields;
            scope.filter = filter;
            scope.popupFunction = popupFunction;
            scope.gridOptions = gridOptions || {};

            scope.gridOptions.onRegisterApi = function (gridApi) {
              scope.gridApi = gridApi;
              if (onRowsRendered) {
                gridApi.core.on.rowsRendered(scope, onRowsRendered);
              }
              if (searchOnOpen) {
                popupFunction(scope.filter, scope.gridOptions, scope.gridApi);
              }
            };

            var modal = $uibModal.open({
              templateUrl: 'templates/searchModal.html',
              size: 'lg',
              scope: scope,
              controller: 'SearchModalController'
            });

            scope.gridOptions.data = [];

            return modal.result;
          },


          showTableModal: function (id, label, popupFunction, gridOptions, size, style, actionButtons, saveButtons, scope) {

            if (!id || !label) {
              throw ('Error showSearchModal: Illegal arguments');
            }

            $log.debug('Button search in apertura');

            scope = scope || $rootScope.$new(false);
            scope.id = id;
            scope.label = label;
            scope.popupFunction = popupFunction;
            scope.gridOptions = gridOptions || {};
            scope.gridOptions.data = scope.gridOptions.data || [];
            scope.gridOptions.onRegisterApi = function (gridApi) {
              scope.gridApi = gridApi;
              popupFunction(scope.gridOptions, scope.gridApi, scope);
            };
            scope.actionButtons = actionButtons;
            scope.saveButtons = saveButtons || [{
              label: 'Esci',
              id: 'esci'
            }];

            scope.getCatWidth = function (categoryName) {
              var width = 0;

              $filter('filter')(scope.gridOptions.columnDefs, {
                category: categoryName
              }).forEach(function (colonna) {
                width += colonna.width;
              });

              if (angular.isNumber(width)) {
                return 'max-width: ' + width + 'px;';
              }
            };

            var modal = $uibModal.open({
              templateUrl: 'templates/tableModal.html',
              size: size,
              scope: scope,
              windowClass: style
            });

            modal.rendered.then(function () {
              scope.rendered = true;
            });

            return modal.result;
          },


          showCustomModal: function (templateUrl, scope, size, style) {

            if (!templateUrl) {
              throw ('Error showSearchModal: Illegal arguments');
            }

            $log.debug('Custom modal in apertura');

            scope = scope || $rootScope.$new(false);

            var modal = $uibModal.open({
              templateUrl: templateUrl,
              size: size,
              scope: scope,
              windowClass: style,
              controller: 'CustomModalController'
            });

            return modal.result;
          },


          dismissAll: function () {
            return $uibModalStack.dismissAll();
          }

        };

        return srvc;

      }
    ])

    .controller('SearchModalController', ['$scope', '$uibModalInstance', '$log',
      function ($scope, $uibModalInstance, $log) {
        $scope.filterFields = function (value) {
          return $scope.fields.filter(function (field, index, array) {
            return Math.round(index / array.length) === value;
          });
        };

        $scope.searchText = 'Cerca';

        $scope.onSearch = function () {
          $scope.waitingResults = true;
          $scope.popupFunction($scope.filter, $scope.gridOptions, $scope.gridApi).then(function () {
            delete $scope.waitingResults;
          });
        };
      }
    ])

    .controller('CustomModalController', ['$scope', '$uibModalInstance', '$log',
      function ($scope, $uibModalInstance, $log) {

        $scope.$on('modal.closing', function (event, result, closing) {
          if ($scope.onClose) {
            $scope.onClose(event, result, closing, $scope);
          }
        });

        $scope.filterObject = $scope.$parent.filterObject;
      }
    ]);
})();
