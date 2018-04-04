(function() {
  'use strict';
  
  angular.module('myApp.utils')
    .constant("$strings", {
      
      SEARCHING_MESSAGE: 'Ricerca in corso.<br/>Attendere prego...',
      
      SAVING_MESSAGE: 'Salvataggio in corso.<br/>Attendere prego...',
      
      DEFAULT_WAITING_MESSAGE: 'Attendere prego...'

    });
})();
