(function () {
    'use strict';
    angular.module('myApp')
        .constant('$strings', {
            MODAL: {
                DEFAULT_WAITING_MESSAGE: 'Attendere prego...',
                OK: 'OK',
                ANNULLA: 'ANNULLA',
                WARNING: 'Attenzione',
                EXIT_MSG: 'Ci sono delle modifiche pending non salvate, sei sicuro di voler uscire??',
                ANNULLA_MSG: 'Ci sono delle modifiche pending non salvate, sei sicuro di voler annullare??'
            },
            BUDGET: {
                GREEN: 60,
                LIGHT_GREEN: 10,
                YELLOW: 5,
                ORANGE: -1
            },
        FANTACALCIO:{
         FANTAFIGHETTINO: "FANTAFIGHETTINO",
            FANTAMARELLI: "FANTAMARELLI",
            FANTABOMBOLACCI: "FANTABOMBOLACCI"
        },
        CONTO:{
            CONTO_COMUNE: "CONTO COMUNE",
            CONTO_PERSONALE: "CONTO PERSONALE"
        },
        REST:{
            SERVER: $strings.REST.SERVER+''
        }
        });
})();
