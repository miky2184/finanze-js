(function () {
  'use strict';

  angular.module('myApp.utils')

    .config(['$uibModalProvider', function ($uibModalProvider) {
      // Le seguenti opzioni servono per impedire che i popup possano essere
      // cancellati cliccando sullo sfondo o premendo il tasto ESC
      $uibModalProvider.options.backdrop = 'static';
      $uibModalProvider.options.keyboard = false;
    }])

    .controller('modalService', function ($uibModalInstance, items) {
      var $ctrl = this;
      $ctrl.items = items;
      $ctrl.selected = {
        item: $ctrl.items[0]
      };

      $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
      };

      $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
})();
