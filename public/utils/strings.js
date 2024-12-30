(function () {
    'use strict';
    angular.module('myApp')
        .constant('$strings', {
            MIN_ROWS_TO_SHOW: 20,
            MIN_ROWS_TO_SHOW_SETTINGS: 8,
            MODAL: {
                DEFAULT_WAITING_MESSAGE: 'Attendere prego...',
                OK: 'OK',
                ANNULLA: 'ANNULLA',
                WARNING: 'Attenzione',
                EXIT_MSG: 'Ci sono modifiche non salvate in sospeso. Sei sicuro di voler uscire?',
                ANNULLA_MSG: 'Ci sono modifiche non salvate in sospeso. Sei sicuro di voler annullare?'
            },
            REST:{
                SERVER: 'https://miky2184.ddns.net:3001'
            },
            PIVOT: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                conto: 1
            }
        });
})();
