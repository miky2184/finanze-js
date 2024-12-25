(function () {
  'use strict';
  angular.module('myApp')

    .config(['$uibModalProvider', function ($uibModalProvider) {
      // Le seguenti opzioni servono per impedire che i popup possano essere
      // cancellati cliccando sullo sfondo o premendo il tasto ESC
      $uibModalProvider.options.backdrop = 'static';
      $uibModalProvider.options.keyboard = false;
    }])

    .factory('modalService', ['$uibModal', '$strings', '$rootScope', '$timeout', '$q', function ($uibModal, $strings, $rootScope, $timeout, $q) {
      const modalService = {};

      modalService.showModal = function (title, text) {
        if (!text) {
          text = $strings.MODAL.DEFAULT_WAITING_MESSAGE;
        }

        if (modalService.waitingModal) {
          return;
        }

        var scope = $rootScope.$new(false);

        scope.text = text;
        scope.title = title;

        modalService.waitingModal = $uibModal.open({
          templateUrl: 'templates/modal/waitingModal.html',
          size: 'lg',
          scope: scope
        });

        modalService.opening = true;

        modalService.waitingModal.opened.then(function () {
          modalService.opening = false;
        });
      };
       
      modalService.hideModal = function () {
        if (!modalService.waitingModal) {
          return $q.reject();
        }

        if (modalService.opening) {
          // Timeout necessario per evitare di nascondere il popup
          // prima che fosse effettivamente apparso.
          return $timeout(modalService.hideModal, 100);
        }

        return $timeout(function () {
          if (modalService.waitingModal) {
            modalService.waitingModal.close();
            delete modalService.waitingModal;
          }
        });
      };

      modalService.showYesNoModal = function (title, text, yes, no, style) {

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
      };      

      return modalService;
    }]);
})();
