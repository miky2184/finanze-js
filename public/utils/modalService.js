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
        console.log("showModal");
        if (modalService.waitingModal) {
          return; // Evita aperture multiple.
        }
      
        var scope = $rootScope.$new(false);
        scope.text = text || $strings.MODAL.DEFAULT_WAITING_MESSAGE;
        scope.title = title;
      
        modalService.waitingModal = $uibModal.open({
          templateUrl: 'templates/modal/waitingModal.html',
          size: 'lg',
          scope: scope
        });
      
        modalService.opening = true;
      
        return $timeout(function () {
          modalService.waitingModal.opened.then(function () {
            modalService.opening = false;
            console.log("Modal fully opened");
          });
        }, 1000); // Ritardo di 50ms per garantire il rendering
      };
       
      modalService.hideModal = function () {
        console.log("hideModal");
        if (!modalService.waitingModal || modalService.opening) {
          return $q.resolve();
        }
      
        return $timeout(function () {
          if (modalService.waitingModal) {
            modalService.waitingModal.close();
            delete modalService.waitingModal;
          }
        }, 100); // Aspetta un breve intervallo prima di chiudere
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
