(function () {
  'use strict';
  angular.module('myApp')

    .config(['$uibModalProvider', function ($uibModalProvider) {
      // Le seguenti opzioni servono per impedire che i popup possano essere
      // cancellati cliccando sullo sfondo o premendo il tasto ESC
      $uibModalProvider.options.backdrop = 'static';
      $uibModalProvider.options.keyboard = false;
    }])

    .factory('modalService', ['$uibModal', '$strings', '$log', '$rootScope', '$timeout', '$q', function ($uibModal, $strings, $log, $rootScope, $timeout, $q) {
      var srvc = {

        showSearchingModal: function (text) {

          if (!text) {
            text = $strings.MODAL.DEFAULT_WAITING_MESSAGE;
          }

          if (srvc.waitingModal) {
            $log.error('Modal già esposto');
            return;
          }

          var scope = $rootScope.$new(false);

          scope.text = text;

          srvc.waitingModal = $uibModal.open({
            templateUrl: 'templates/modal/waitingModal.html',
            size: 'lg',
            scope: scope
          });

          srvc.opening = true;

          srvc.waitingModal.opened.then(function () {
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

          return $timeout(function () {
            if (srvc.waitingModal) {
              srvc.waitingModal.close();
              delete srvc.waitingModal;
            }
          });
        },

        showButtonModal: function (title, text, button, style) {

          var scope = $rootScope.$new(true);
          scope.title = title;
          scope.text = text;
          scope.button = button;
          scope.style = style;

          var modal = $uibModal.open({
            templateUrl: 'templates/modal/buttonModal.html',
            size: 'lg',
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

        showYesNoModal: function (title, text, yes, no, style) {
          $log.debug('YesNoModal in apertura');

          var scope = $rootScope.$new(false);
          scope.title = title;
          scope.text = text;
          scope.yes = yes;
          scope.no = no;
          scope.style = style;

          var modal = $uibModal.open({
            templateUrl: 'templates/modal/yesNoModal.html',
            size: 'lg',
            scope: scope,
            windowClass: style
          });

          return modal.result;
        },

        showYesNoCancelModal: function (title, text, yes, no, cancel, style) {
          $log.debug('YesNoCancelModal in apertura');

          var scope = $rootScope.$new(false);
          scope.title = title;
          scope.text = text;
          scope.yes = yes;
          scope.no = no;
          scope.cancel = cancel;
          scope.style = style;

          var modal = $uibModal.open({
            templateUrl: 'templates/modal/yesNoCancelModal.html',
            size: 'lg',
            scope: scope,
             windowClass: style
          });

          return modal.result;
        },
        
        showProgressModal: function(modalValue) {

            if (srvc.progressModal) {
              $log.error('Modal già esposto');
              return;
            }

            srvc.progressScope = $rootScope.$new(false);
            srvc.progressScope.max = modalValue.max;
            srvc.progressScope.dynamic = modalValue.initialValue || 0;
            srvc.progressScope.text = modalValue.text;
            srvc.progressScope.title = modalValue.title;

            $log.debug('Progress modal in apertura');
            srvc.progressModal = $uibModal.open({
              templateUrl: 'templates/progressModal.html',
              size: 'lg',
              scope: srvc.progressScope
            });

            srvc.opening = true;

            srvc.progressModal.rendered.then(function() {
              $log.debug('Progress modal creato');
              srvc.opening = false;
            });

          },

          updateProgressModal: function(value) {
            if (srvc.progressModal) {
              srvc.progressScope.dynamic = value;
            }
          },

          hideProgressModal: function() {

            srvc.progressScope.dynamic = 0;

            if (!srvc.progressModal) {
              $log.error('Modal già rimosso');

              return $q.reject();
            }

            if (srvc.opening) {
              // Timeout necessario per evitare di nascondere il popup
              // prima che fosse effettivamente apparso.


              return $timeout(srvc.hideProgressModal, 100);
            }

            srvc.progressModal.close();
            delete srvc.progressModal;

            $log.debug('Progress modal rimosso');
            return $q.when();
          }
      };
      return srvc;
    }]);
})();
